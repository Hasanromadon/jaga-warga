import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Resident } from './useResidents';
import toast from 'react-hot-toast';

const marketingSystemInstruction = `
You are a Digital Marketing Expert specializing in Indonesian MSMEs (UMKM).
Your goal is to rewrite boring product descriptions into catchy, persuasive, and friendly WhatsApp/Social Media ads.
Use emojis. Use persuasive psychological triggers (scarcity, social proof).
Tone: Friendly neighbor (akrab), Local Indonesian nuance (receh tapi sopan).
`;

const createMarketingPrompt = (itemName: string, rawDescription: string, price: number) => {
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

interface GenerateAdVariables {
  itemName: string;
  rawDescription: string;
  price: number;
  resident: Resident;
  imageUrl: string;
}

// This would ideally be in a secure backend, but for simplicity, we'll call it from the client.
async function generateMarketingContent(itemName: string, rawDescription: string, price: number) {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: marketingSystemInstruction },
          { text: createMarketingPrompt(itemName, rawDescription, price) },
        ],
      },
    ],
    generationConfig: {
        temperature: 0.8,
        responseMimeType: 'application/json',
    },
  };

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API Error:', errorData);
    throw new Error('Gagal membuat konten marketing.');
  }

  const data = await response.json();
  // The actual content is in the first candidate's content part
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

export function useGenerateAdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: GenerateAdVariables) => {
      const { itemName, rawDescription, price, resident, imageUrl } = variables;

      const marketingContent = await generateMarketingContent(
        itemName,
        rawDescription,
        price,
      );

      await addDoc(collection(db, 'ads'), {
        ...marketingContent,
        itemName,
        price,
        imageUrl,
        residentId: resident.id,
        residentName: resident.name,
        block: resident.block,
        houseNumber: resident.houseNumber,
        createdAt: serverTimestamp(),
        residential_id: resident.residential_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast.success('Iklan berhasil dibuat dan dipublikasikan!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Gagal membuat iklan. Coba lagi nanti.');
    },
  });
}
