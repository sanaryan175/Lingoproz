// netlify/functions/chatbot.js
// Node 18+ on Netlify supports global fetch
const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // safe if you host frontend elsewhere; adjust if needed
};

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message;
    const language = body.language || "English";

    if (!message) {
      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "message required" }) };
    }

    // system prompt: tune how the assistant responds
    const systemPrompt = `You are a friendly language tutor. Answer user's questions in ${language}. Give short explanations, examples, and if helpful include transliteration for Hindi. Keep answers concise and beginner-friendly.`;

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change to a model you have access to if needed
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.2,
        max_tokens: 800
      }),
    });

    const data = await openaiResp.json();

    // Support different response shapes
    const reply = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "Sorry, no reply.";

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: "Server error" }) };
  }
};
