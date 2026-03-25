export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Mock response for local testing
      const mockResponse = {
        verdict: "good",
        verdictReason: "Balanced nutrition suitable for general health",
        benefits: ["Good source of protein", "Low in added sugars"],
        cautions: [],
        avoidReasons: [],
        allergenAlert: false,
        allergenDetail: null
      };
      return res.status(200).json({ text: JSON.stringify(mockResponse) });
    }

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY || 'AIzaSyC16Mn1T5MOuE-rP5fBHo2WogCazH9D7co'}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
// Clean markdown JSON
text = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
// Fix common JSON formatting issues
text = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
