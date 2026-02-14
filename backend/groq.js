import axios from "axios";

const groqResponse = async (command, assistantName, userName) => {
  try {
    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google.
You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond ONLY with a JSON object in the following format:

{
  "type": "general | google-search | youtube-search | youtube-play | get-time | get-date | get-day | get-month | calculator-open | instagram-open | facebook-open | weather-show",
  "userInput": "<original user input>" (remove your name if it exists). If the user asks to search on Google or YouTube, keep ONLY the search text,
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": Determine the intent of the user.
- "userInput": The original sentence the user spoke.
- "response": A short voice-friendly reply.

Type meanings:
- "general": If it's a factual or informational question.
- "google-search": If the user wants to search something on Google.
- "youtube-search": If the user wants to search something on YouTube.
- "youtube-play": If the user wants to directly play a video or song.
- "calculator-open": If the user wants to open a calculator.
- "instagram-open": If the user wants to open Instagram.
- "facebook-open": If the user wants to open Facebook.
- "weather-show": If the user wants to know the weather.
- "get-time": If the user asks for the current time.
- "get-date": If the user asks for today's date.
- "get-day": If the user asks what day it is.
- "get-month": If the user asks for the current month.

Important:
- Use "${userName}" if someone asks who created you.
- Respond ONLY with the JSON object, nothing else.
- Do not include any markdown formatting or code blocks.

Now the user input: ${command}
`;

    console.log("🚀 Sending to Groq API...");
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    console.log("✅ Groq API response:", aiResponse);
    return aiResponse;
  } catch (error) {
    console.error("❌ Groq API error:", error.response?.data || error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return "Error generating response";
  }
};

export default groqResponse;
