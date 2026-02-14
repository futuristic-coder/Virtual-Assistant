import React from 'react'

const Home = () => {
  return (
    <div>
      
    </div>
  )
}

export default Home

// import { useContext, useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { userDataContext } from "../context/userContext";
// import aiImg from "../assets/Ai.gif";
// import userImg from "../assets/user.gif";

// function Home() {
//   const { userData, serverUrl, setUserData, getOllamaResponse } =
//     useContext(userDataContext);

//   const navigate = useNavigate();
//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const recognitionRef = useRef(null);
//   const isRecognizingRef = useRef(false);
//   const isSpeakingRef = useRef(false);

//   const synth = window.speechSynthesis;

//   // 🔓 ONE-TIME speech unlock (browser requirement)
//   const unlockSpeech = () => {
//     const utterance = new SpeechSynthesisUtterance("Assistant activated");

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       isSpeakingRef.current = false;
//       safeStartRecognition();
//     };

//     synth.speak(utterance);
//   };

//   // 🔊 Speak helper (SAFE)
//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "hi-IN";
//     const voices = window.speechSynthesis.getVoices();
//     const hindiVoice = voices.find((v) => v.lang === "hi-IN");
//     if (hindiVoice) {
//       utterance.voice = hindiVoice;
//     }

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => {
//         safeStartRecognition();
//       }, 800);
//     };
//     synth.cancel();

//     synth.speak(utterance);
//   };

//   // 🎤 Safe recognition starter
//   const safeStartRecognition = () => {
//     if (!isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current?.start();
//         console.log("Recognition requested to start");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") {
//           console.error("Recognition start error:", error);
//         }
//       }
//     }
//   };

//   // 🎯 Handle assistant commands
//   const handleCommand = (data) => {
//     const { type, userInput, response } = data;

//     speak(response);

//     const query = encodeURIComponent(userInput || "");

//     if (type === "google-search") {
//       window.open(`https://www.google.com/search?q=${query}`, "_blank");
//     }
//     if (type === "calculator-open") {
//       window.open("https://www.google.com/search?q=calculator", "_blank");
//     }
//     if (type === "instagram-open") {
//       window.open("https://www.instagram.com/", "_blank");
//     }
//     if (type === "facebook-open") {
//       window.open("https://www.facebook.com/", "_blank");
//     }
//     if (type === "weather-show") {
//       window.open("https://www.google.com/search?q=weather", "_blank");
//     }
//     if (type === "youtube-search" || type === "youtube-play") {
//       window.open(
//         `https://www.youtube.com/results?search_query=${query}`,
//         "_blank",
//       );
//     }
//   };

//   // 🎤 Voice assistant core logic
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.continuous = false;

//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     recognitionRef.current = recognition;
//     let isMounted = true;
//     const startTimeout = setTimeout(() => {
//       if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
//         try {
//           recognition.start();
//           console.log("Recognition requested to start");
//         } catch (error) {
//           if (error.name !== "InvalidStateError") {
//             console.log(error);
//           }
//         }
//       }
//     }, 1000);
//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => {
//           if (isMounted) {
//             try {
//               recognition.start();
//               console.log("Recognition restarted");
//             } catch (error) {
//               if (error.name !== "InvalidStateError") {
//                 console.log(error);
//               }
//             }
//           }
//         }, 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("Recognition error:", event.error);

//       isRecognizingRef.current = false;
//       setListening(false);
//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => {
//           if (isMounted) {
//             try {
//               recognition.start();
//               console.log("Recognition restarted after error");
//             } catch (error) {
//               if (error.name !== "InvalidStateError") {
//                 console.log(error);
//               }
//             }
//           }
//         }, 1000);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript?.trim();
//       const assistantName = userData.assistantName.toLowerCase();

//       if (transcript.toLowerCase().includes(assistantName)) {
//         setAiText("");
//         setUserText(transcript);
//         recognition.stop();
//         isRecognizingRef.current = false;
//         setListening(false);
//         const data = await getOllamaResponse(cleanCommand);
//         handleCommand(data);
//         setAiText(data.response);
//         setUserText("");
//       }
//     };


   
//       const greeting=new SpeechSynthesisUtterance(`hell ${userData.name}, What can i help you with?`)
//       greeting.lang="hi-IN";
      
//       window.speechSynthesis.speak(greeting);

//     return () => {
//       isMounted=false;
//       clearTimeout(startTimeout);
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, []);

//   // 🚪 Logout
//   const handleLogOut = async () => {
//     await axios.get(`${serverUrl}/api/auth/logout`, {
//       withCredentials: true,
//     });
//     setUserData(null);
//     navigate("/signin");
//   };

//   return (
//     <div
//       className="w-full h-screen bg-gradient-to-t from-black to-[#02023d]
//                  flex flex-col justify-center items-center"
//       onClick={unlockSpeech}
//     >
//       <button
//         className="absolute top-5 right-5 bg-white px-6 py-3 rounded-full font-semibold"
//         onClick={handleLogOut}
//       >
//         Log Out
//       </button>

//       <button
//         className="absolute top-24 right-5 bg-white px-6 py-3 rounded-full font-semibold"
//         onClick={() => navigate("/customize")}
//       >
//         Customize Assistant
//       </button>

//       <div className="w-[300px] h-[400px] overflow-hidden rounded-xl shadow-lg">
//         <img
//           src={userData?.assistantImage}
//           alt="assistant"
//           className="h-full object-cover"
//         />
//       </div>

//       <h1 className="text-white mt-6 text-xl">I'm {userData?.assistantName}</h1>

//       <p className="text-gray-300 mt-2 text-sm">
//         {listening ? "Listening..." : "(Click once anywhere to activate voice)"}
//       </p>
//       {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
//       {aiText && <img src={aiImg} alt="" className="w-[200px]" />}
//       <h1 className="text-white">
//         {userText ? userText : aiText ? aiText : null}
//       </h1>
//       <div>
//         <h1>History</h1>
//         <div>
//           {userData.histpry?.map((his) => (
//             <span>{his}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
