// AI Study Assistant Controller — uses Google Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are EduNest AI Study Assistant — a friendly, knowledgeable tutor helping students with homework and exam preparation. 

Rules:
- Give clear, step-by-step explanations
- Use simple language appropriate for school students (grades 1-12)
- Include examples when possible
- If asked about a specific subject, stay focused on that subject
- Encourage the student and be positive
- If you don't know something, say so honestly
- Never give direct test/exam answers — guide the student to understand the concept
- Keep responses concise but thorough (max 300 words)
- Format your responses with line breaks for readability`;

export const chatWithAI = async (req, res) => {
  try {
    const { message, subject, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (!GEMINI_API_KEY) {
      // Fallback: return a helpful response without API
      return res.json({
        success: true,
        data: {
          reply: getFallbackResponse(message, subject),
          model: "fallback",
        },
      });
    }

    // Build the prompt
    let userPrompt = message;
    if (subject) userPrompt = `[Subject: ${subject}] ${userPrompt}`;
    if (context) userPrompt = `[Context: ${context}] ${userPrompt}`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\nStudent's question: ${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return res.json({
        success: true,
        data: {
          reply: getFallbackResponse(message, subject),
          model: "fallback",
        },
      });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    res.json({ success: true, data: { reply, model: "gemini" } });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ success: false, message: "AI service error", error: err.message });
  }
};

// Fallback responses when no API key is configured
function getFallbackResponse(message, subject) {
  const msg = message.toLowerCase();
  
  if (msg.includes("explain") || msg.includes("what is") || msg.includes("define")) {
    return `Great question! 📚\n\nTo understand this concept${subject ? ` in ${subject}` : ""}, I'd recommend:\n\n1. **Check your textbook** — Look for the chapter that covers this topic\n2. **Watch your course videos** — Your teacher may have uploaded a video explanation\n3. **Review your notes** — Check the Notes section for relevant materials\n4. **Break it down** — Try to understand one part at a time\n\n💡 *Tip: To enable AI-powered explanations, ask your administrator to configure the Gemini API key.*`;
  }

  if (msg.includes("practice") || msg.includes("question") || msg.includes("quiz")) {
    return `Want to practice? Here's what I suggest: 🎯\n\n1. **Take a test** — Go to the Tests section to attempt practice tests\n2. **Review past tests** — Check your Test Records to see areas for improvement\n3. **Study your notes** — Re-read the key concepts before practicing\n\n💡 *Tip: For AI-generated practice questions, configure the Gemini API key.*`;
  }

  if (msg.includes("homework") || msg.includes("assignment") || msg.includes("help")) {
    return `I'm here to help! 📝\n\n**For homework help:**\n1. Read the homework description carefully\n2. Check your class notes on the topic\n3. Watch related video materials\n4. Try to solve step by step\n\n**Remember:** Understanding the concept is more important than just getting the answer!\n\n💡 *Tip: For detailed AI tutoring, configure the Gemini API key.*`;
  }

  return `Hello! 👋 I'm your EduNest Study Assistant.\n\nI can help you with:\n• **Explaining concepts** — Ask "What is...?" or "Explain..."\n• **Homework guidance** — Tell me what you're working on\n• **Exam preparation** — Ask for study tips or practice\n• **Subject-specific help** — Mention your subject for focused help\n\n${subject ? `I see you're studying **${subject}**. What would you like to know?` : "What would you like to learn today?"}\n\n💡 *For full AI-powered responses, configure the Gemini API key in the backend.*`;
}
