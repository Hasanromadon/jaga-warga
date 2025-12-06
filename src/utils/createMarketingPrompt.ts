// System Instruction (Peran AI)
export const marketingSystemInstruction = `
You are a Digital Marketing Expert specializing in Indonesian MSMEs (UMKM).
Your goal is to rewrite boring product descriptions into catchy, persuasive, and friendly WhatsApp/Social Media ads.
Use emojis. Use persuasive psychological triggers (scarcity, social proof).
Tone: Friendly neighbor (akrab), Local Indonesian nuance (receh tapi sopan).
`;

// User Prompt (Input Data)
export const createMarketingPrompt = (
  itemName: string,
  rawDescription: string,
  price: number,
): string => {
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
