import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import groqResponse from "../groq.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Get current user Not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { assistantName, assistantImage: imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true },
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Update assistant ERROR!!!" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ response: "No command provided" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    user.history.push(command);
    await user.save();
    
    const userName = user.name;
    const assistantName = user.assistantName;

    console.log("🤖 Processing command:", command);
    const result = await groqResponse(command, assistantName, userName);
    console.log("🔍 Groq response:", result);

    if (!result || result === "Error generating response") {
      return res.status(500).json({
        type: "general",
        userInput: command,
        response: "Sorry, I'm having trouble connecting to my AI brain right now."
      });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      console.error("❌ Failed to extract JSON from:", result);
      return res.status(400).json({
        type: "general",
        userInput: command,
        response: "Sorry, I couldn't understand that properly.",
      });
    }

    const groqResult = JSON.parse(jsonMatch[0]);
    const type = groqResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: groqResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: groqResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: groqResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: groqResult.userInput,
          response: `today is ${moment().format("MMMM")}`,
        });
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: groqResult.userInput,
          response: groqResult.response,
        });
        default:
          return res.status(400).json({response:"I didn't understand that command"})
    }
  } catch (error) {
    return res.status(500).json({response:"Ask Assistant Error "})
  }
};
