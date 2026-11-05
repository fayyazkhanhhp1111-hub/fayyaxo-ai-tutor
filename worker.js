export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("FAYYAXO AI Tutor is running!", {
        headers: cors
      });
    }

    try {
      const body = await request.json();
      const question = body.question;

      if (!question || typeof question !== "string" || question.length > 3000) {
        return Response.json(
          { error: "Please enter a valid maths question." },
          { status: 400, headers: cors }
        );
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "You are FAYYAXO AI Maths Tutor. Solve this student's maths question step by step. Explain simply. Use Urdu if the question asks for Urdu, otherwise English. Show formulas, working and final answer. Question: " + question
              }]
            }]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          { error: "AI service error. Please try again." },
          { status: 502, headers: cors }
        );
      }

      const answer = data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "").join("\n");

      return Response.json(
        { answer: answer || "No answer received." },
        { headers: cors }
      );

    } catch (error) {
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500, headers: cors }
      );
    }
  }
};
