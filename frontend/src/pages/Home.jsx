import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

function Home() {
  const { userData, serverUrl, setUserData, groqResponse, axiosInstance } =
    useContext(userDataContext);

  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const isRecognitionActiveRef = useRef(false);
  const shouldRestartRef = useRef(true);

  // 🔊 Speak function
  const speak = (text) => {
    if (!text) return;
    
    console.log("🔊 Speaking:", text);
    synthRef.current.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      console.log("🎙️ Speech started");
    };
    
    utterance.onend = () => {
      console.log("✅ Speech ended");
      setAiText("");
      setTimeout(() => {
        startListening();
      }, 500);
    };
    
    utterance.onerror = (error) => {
      console.error("❌ Speech error:", error);
    };
    
    synthRef.current.speak(utterance);
  };

  // 🎤 Start listening
  const startListening = () => {
    if (!recognitionRef.current || isProcessing || isRecognitionActiveRef.current) {
      return;
    }
    
    try {
      isRecognitionActiveRef.current = true;
      recognitionRef.current.start();
      console.log("👂 Starting recognition");
    } catch (error) {
      isRecognitionActiveRef.current = false;
      if (error.name !== "InvalidStateError") {
        console.error("Start listening error:", error);
      }
    }
  };

  // ⏹️ Stop listening
  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    shouldRestartRef.current = false;
    try {
      recognitionRef.current.stop();
      console.log("🛑 Stopping recognition");
    } catch (error) {
      console.error("Stop listening error:", error);
    }
  };

  // 🎯 Process command
  const processCommand = async (command) => {
    if (!command || isProcessing) return;
    
    setIsProcessing(true);
    setUserText(command);
    
    try {
      console.log("📤 Sending command:", command);
      const response = await groqResponse(command);
      console.log("📥 Received response:", response);
      
      if (response && response.response) {
        setAiText(response.response);
        shouldRestartRef.current = true; // Allow restart after speaking
        speak(response.response);
        
        // Handle different action types
        const query = encodeURIComponent(command);
        
        switch(response.type) {
          case "google-search":
            window.open(`https://www.google.com/search?q=${query}`, "_blank");
            break;
          case "youtube-search":
          case "youtube-play":
            window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
            break;
          case "calculator-open":
            window.open("https://www.google.com/search?q=calculator", "_blank");
            break;
          case "instagram-open":
            window.open("https://www.instagram.com/", "_blank");
            break;
          case "facebook-open":
            window.open("https://www.facebook.com/", "_blank");
            break;
          case "weather-show":
            window.open("https://www.google.com/search?q=weather", "_blank");
            break;
          default:
            // General response - just speak it
            break;
        }
      } else {
        const errorMsg = "Sorry, I couldn't process that.";
        setAiText(errorMsg);
        shouldRestartRef.current = true;
        speak(errorMsg);
      }
    } catch (error) {
      console.error("❌ Command processing error:", error);
      const errorMsg = "Sorry, something went wrong.";
      setAiText(errorMsg);
      shouldRestartRef.current = true;
      speak(errorMsg);
    } finally {
      setTimeout(() => {
        setUserText("");
        setIsProcessing(false);
      }, 2000);
    }
  };

  // 🎤 Initialize speech recognition
  useEffect(() => {
    if (!userData?.assistantName || !isActivated) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    
    recognitionRef.current = recognition;

    // On speech recognized
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("🎤 Heard:", transcript);
      
      if (!transcript) return;
      
      const assistantName = userData.assistantName.toLowerCase();
      const lowerTranscript = transcript.toLowerCase();
      
      // Check if assistant name is mentioned
      if (lowerTranscript.includes(assistantName)) {
        shouldRestartRef.current = false;
        stopListening();
        
        // Extract command (remove assistant name)
        const commandRegex = new RegExp(assistantName + "\\s*", "i");
        const command = transcript.replace(commandRegex, "").trim();
        
        if (command) {
          processCommand(command);
        } else {
          speak("Yes? How can I help you?");
        }
      }
    };

    // On start
    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      setListening(true);
      console.log("✅ Recognition started");
    };

    // On end
    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      setListening(false);
      console.log("⏹️ Recognition ended");
      
      // Only restart if should restart flag is true and not processing
      if (shouldRestartRef.current && !isProcessing) {
        setTimeout(() => {
          startListening();
        }, 500);
      } else {
        shouldRestartRef.current = true; // Reset flag for next time
      }
    };

    // On error
    recognition.onerror = (event) => {
      console.warn("⚠️ Recognition error:", event.error);
      isRecognitionActiveRef.current = false;
      setListening(false);
      
      // Don't restart on aborted or no-speech errors
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      
      // For other errors, restart after delay
      setTimeout(() => {
        if (shouldRestartRef.current) {
          startListening();
        }
      }, 1000);
    };

    // Start listening after short delay
    setTimeout(() => {
      shouldRestartRef.current = true;
      startListening();
    }, 3000);

    // Cleanup
    return () => {
      shouldRestartRef.current = false;
      synthRef.current.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      isRecognitionActiveRef.current = false;
    };
  }, [userData?.assistantName, userData?.name, isActivated]);

  // Activation handler
  const handleActivate = () => {
    if (isActivated) return;
    
    setIsActivated(true);
    console.log("🚀 Assistant activated!");
    
    // Initial greeting
    const greeting = `Hello ${userData.name}! I'm ${userData.assistantName}. How can I help you today?`;
    speak(greeting);
  };

  // 🚪 Logout
  const handleLogOut = async () => {
    try {
      stopListening();
      synthRef.current.cancel();
      
      await axiosInstance.get(`/api/auth/logout`);
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!userData) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a0015] via-[#0d0d2b] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-cyan-400 mb-4">Loading...</h1>
          <p className="text-cyan-300">Initializing your assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen bg-gradient-to-br from-[#0a0015] via-[#0d0d2b] to-[#000000] flex flex-col items-center justify-center relative overflow-hidden" 
      onClick={(e) => {
        if (menuOpen) setMenuOpen(false);
      }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      
      {/* Futuristic grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-line"></div>
      </div>

      {/* Activation overlay */}
      {!isActivated && (
        <div 
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center cursor-pointer"
          onClick={handleActivate}
        >
          <div className="text-center animate-pulse-slow">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.8)]">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Click to Activate
            </h2>
            <p className="text-cyan-300 text-lg">
              Start your voice assistant
            </p>
          </div>
        </div>
      )}

      {/* Top buttons - Desktop */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button
          className="relative group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transform hover:scale-105 overflow-hidden"
          onClick={() => navigate("/customize")}
        >
          <span className="relative z-10">Customize</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </button>
        <button
          className="relative group bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] transform hover:scale-105 overflow-hidden"
          onClick={handleLogOut}
        >
          <span className="relative z-10">Logout</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-4 right-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="relative group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white p-3 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-14 right-0 bg-gradient-to-br from-cyan-950/95 to-purple-950/95 backdrop-blur-xl border-2 border-cyan-400/50 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.6)] overflow-hidden min-w-[200px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/customize");
                setMenuOpen(false);
              }}
              className="w-full px-6 py-4 text-left text-white hover:bg-cyan-500/20 transition-colors duration-300 border-b border-cyan-400/20 flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="font-semibold">Customize</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogOut();
                setMenuOpen(false);
              }}
              className="w-full px-6 py-4 text-left text-white hover:bg-red-500/20 transition-colors duration-300 flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex flex-col h-full justify-center items-center overflow-hidden">
        {/* Assistant image with glow effect */}
        <div className="mb-4 sm:mb-8 relative group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 rounded-3xl overflow-hidden border-2 sm:border-4 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300">
            <img
              src={userData?.assistantImage}
              alt="assistant"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Assistant name with gradient */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse-slow px-2 text-center">
          I'm {userData?.assistantName}
        </h1>

        {/* Status indicator */}
        <div className={`mb-4 sm:mb-6 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 text-center ${ 
          listening 
            ? 'bg-cyan-500/30 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] border-2 border-cyan-400 animate-pulse' 
            : 'bg-purple-500/20 text-purple-300 border-2 border-purple-400/50'
        }`}>
          {listening ? "🎤 Listening..." : "Standby"}
        </div>

        {/* Themed voice indicator */}
        <div className="mb-3 sm:mb-4 h-[88px] sm:h-[100px] flex items-center justify-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <div className={`absolute inset-0 rounded-full border ${listening ? "border-cyan-400/60" : "border-purple-400/35"} animate-pulse-slow`}></div>
            <div className={`absolute inset-3 rounded-full border ${listening ? "border-cyan-400/40" : "border-purple-400/25"} animate-pulse`} style={{animationDelay: "0.2s"}}></div>
            <div className={`absolute inset-7 rounded-full ${listening ? "bg-cyan-500/15" : "bg-purple-500/15"} blur-sm`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${listening ? "bg-cyan-500/25" : "bg-purple-500/20"} border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.35)]`}></div>
            </div>
          </div>
        </div>

        {/* Display text with glowing effect */}
        {(userText || aiText) && (
          <div className="w-full max-w-2xl mb-4 sm:mb-8 px-2">
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-purple-950/30 backdrop-blur-sm border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <p className="text-cyan-300 text-center text-sm sm:text-base md:text-lg leading-relaxed">
                {userText || aiText}
              </p>
            </div>
          </div>
        )}

        {/* History section */}
        {userData?.history && userData.history.length > 0 && (
          <div className="w-full max-w-2xl mt-3 sm:mt-4 px-2 sm:px-3">
            <div className="rounded-xl border border-cyan-400/25 bg-cyan-950/15 backdrop-blur-sm px-3 py-2">
              <h2 className="text-cyan-300 text-xs sm:text-sm font-semibold text-center mb-2">
                Recent Commands
              </h2>
              <div className="flex flex-wrap gap-2 justify-center max-h-20 sm:max-h-24 overflow-y-auto">
                {userData.history.map((command, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-500/15 border border-cyan-400/30 rounded-full text-cyan-300 text-xs sm:text-sm font-medium"
                  >
                    {command}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
