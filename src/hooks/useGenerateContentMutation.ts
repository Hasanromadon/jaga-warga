import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const marketingSystemInstruction = `
You are a Digital Marketing Expert specializing in Indonesian MSMEs (UMKM).
Your goal is to rewrite boring product descriptions into catchy, persuasive, and friendly WhatsApp/Social Media ads.
Use emojis. Use persuasive psychological triggers (scarcity, social proof).
Tone: Friendly neighbor (akrab), Local Indonesian nuance (receh tapi sopan).
`;

const createMarketingPrompt = (
  itemName: string,
  rawDescription: string,
  price: number,
) => {
  return `
    Product Name: "${itemName}"
    User's Boring Description: "${rawDescription}"
    Price: Rp ${price}
    
    Task: Create a marketing copy for this product.
    
    Return JSON with this structure:
    {
      "headline": "string", // Short, punchy, catchy header (e.g. "🔥 Promo Tetangga!")
      "adBody": "string", // The main content, persuasive, include emojis. Mention the price attractively.
      "shortTagline": "string", // 3-5 words slogan
      "suggestedHashtags": ["string", "string"]
    }
  `;
};

interface GenerateContentVariables {
  itemName: string;
  rawDescription: string;
  price: number;
}

export interface GeneratedContent {
  headline: string;
  adBody: string;
  shortTagline: string;
  suggestedHashtags: string[];
}

async function generateMarketingContent(
  itemName: string,
  rawDescription: string,
  price: number,
): Promise<GeneratedContent> {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error(
      'API Key Gemini tidak ditemukan. Periksa konfigurasi environment.',
    );
  }

  // Use gemini-2.0-flash with v1beta API
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const systemPrompt = `${marketingSystemInstruction}\n\n${createMarketingPrompt(itemName, rawDescription, price)}\n\nIMPORTANT: You must respond with ONLY a valid JSON object, no other text. The JSON must have this exact structure: {"headline": "string", "adBody": "string", "shortTagline": "string", "suggestedHashtags": ["string", "string"]}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: systemPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.8,
    },
  };

  console.log('Calling Gemini API with:', {
    url: URL.replace(API_KEY, 'HIDDEN'),
    itemName,
    price,
  });

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorData;
    let errorText = '';

    try {
      errorText = await response.text();
      errorData = JSON.parse(errorText);
    } catch {
      console.error('Gemini API Error (raw text):', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Gagal membuat konten marketing: ${response.status} - ${errorText || response.statusText}`,
      );
    }

    console.error('Gemini API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      fullResponse: errorText,
    });

    const errorMessage =
      errorData?.error?.message ||
      errorData?.error?.status ||
      errorData?.message ||
      'Unknown error';
    throw new Error(
      `Gagal membuat konten marketing: ${response.status} - ${errorMessage}`,
    );
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    console.error('Invalid Gemini response:', data);
    throw new Error('Format respon Gemini tidak valid');
  }

  // The actual content is in the first candidate's content part
  const responseText = data.candidates[0].content.parts[0].text;

  // Extract JSON from response (might have markdown code blocks)
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(jsonText);
  } catch {
    console.error('Failed to parse JSON response:', jsonText);
    throw new Error('Gagal mem-parse respon dari AI');
  }
}

export function useGenerateContentMutation() {
  return useMutation({
    mutationFn: async (variables: GenerateContentVariables) => {
      return await generateMarketingContent(
        variables.itemName,
        variables.rawDescription,
        variables.price,
      );
    },
    onError: (error: Error) => {
      console.error('Generate Content Error:', error);
      if (error.message.includes('API Key')) {
        toast.error('API Key tidak ditemukan. Hubungi administrator.');
      } else if (error.message.includes('Gemini')) {
        toast.error(error.message);
      } else {
        toast.error('Gagal membuat konten. Coba lagi nanti.');
      }
    },
  });
}
