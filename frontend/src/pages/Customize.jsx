import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/userContext";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import image1 from "../assets/p 1.jpeg";
import image2 from "../assets/p 2.jpg";
import image3 from "../assets/p 3.jpg";
import image4 from "../assets/p 4.jpeg";


function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleContinueToName = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleCreateProfile = async () => {
    setLoading(true);
    setError("");

    if (!assistantName.trim()) {
      setError("Please enter an assistant name");
      setLoading(false);
      return;
    }

    if (!selectedImage) {
      setError("Please select an assistant image");
      setLoading(false);
      return;
    }

    try {
      // If user selected a custom uploaded image
      if (selectedImage === "input" && backendImage) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageData = reader.result;
          await submitProfile(imageData);
        };
        reader.onerror = () => {
          setError("Failed to read image file");
          setLoading(false);
        };
        reader.readAsDataURL(backendImage);
      } else {
        // User selected one of the preset images
        await submitProfile(selectedImage);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const submitProfile = async (imageData) => {
    try {
      if (!imageData) {
        setError("Image data is missing");
        setLoading(false);
        return;
      }

      const response = await fetch(`${serverUrl}/api/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantName: assistantName.trim(),
          assistantImage: imageData,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      // Update context with new user data
      setUserData(data);
      setFrontendImage(null);
      setBackendImage(null);
      setSelectedImage(null);
      setAssistantName("");
      setStep(1);
      setLoading(false);
      alert("Profile created successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Profile update error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0a0015] via-[#0d0d2b] to-[#000000] flex flex-col items-center justify-center relative overflow-hidden">
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

      {/* Step 1: Image Selection */}
      {step === 1 && (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col h-full justify-center overflow-y-auto">
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse-slow px-2">
              Select Your Assistant Avatar
            </h1>
            <p className="text-cyan-300/70 text-sm sm:text-base md:text-lg font-light tracking-wide px-2">
              Choose an identity for your AI companion
            </p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2 sm:mt-3"></div>
          </div>

          {/* Cards grid */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
            <Card image={image1} />
            <Card image={image2} />
            <Card image={image3} />
            <Card image={image4} />
            
            {/* Custom upload card */}
            <div 
              className="group w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 relative cursor-pointer"
              onClick={() => {
                inputImage.current.click();
                setSelectedImage("input");
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-cyan-950/30 to-purple-950/30 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500 flex items-center justify-center relative">
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {!frontendImage ? (
                  <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 transform group-hover:scale-110 transition-transform duration-300">
                    <RiImageAddLine className="text-cyan-400 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <span className="text-cyan-300 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase px-1">
                      Upload Custom
                    </span>
                  </div>
                ) : (
                  <img 
                    src={frontendImage} 
                    alt="assistant" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            ref={inputImage} 
            hidden 
            onChange={handleImage}
          />

          {/* Next button */}
          {selectedImage && (
            <div className="flex justify-center mt-4 sm:mt-6 pb-4">
              <button 
                onClick={handleContinueToName}
                className="relative group bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Continue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Name Input */}
      {step === 2 && (
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col h-full justify-center">
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse-slow px-2">
              Name Your Assistant
            </h1>
            <p className="text-cyan-300/70 text-sm sm:text-base md:text-lg font-light tracking-wide px-2">
              Give your AI companion a unique identity
            </p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2 sm:mt-3"></div>
          </div>

          {/* Selected Image Preview */}
          <div className="flex justify-center mb-4 sm:mb-8">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 sm:border-4 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                <img 
                  src={selectedImage === "input" ? frontendImage : selectedImage} 
                  alt="Selected assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 bg-cyan-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                Selected
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl text-red-400 text-xs sm:text-sm backdrop-blur-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="mb-4 sm:mb-8">
            <label className="block text-cyan-300 text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-center">
              Assistant Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="e.g., Jarvis, Friday, Oracle..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-cyan-950/20 to-purple-950/20 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl text-white text-center text-base sm:text-xl placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 group-hover:border-cyan-400/60"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                maxLength="50"
                autoFocus
              />
              <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl"></div>
            </div>
            <p className="text-cyan-300/50 text-xs sm:text-sm mt-2 text-center">
              {assistantName.length}/50 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 sm:gap-4 pb-4">
            <button
              onClick={handleBack}
              disabled={loading}
              className="relative px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gray-500/50 transform hover:scale-105"
            >
              Back
            </button>
            <button
              onClick={handleCreateProfile}
              disabled={loading || !assistantName.trim()}
              className="relative group bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white px-6 sm:px-12 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
            >
              <span className="relative z-10">
                {loading ? "Creating..." : "Create Profile"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </button>
          </div>

          <p className="text-center text-cyan-300/40 text-xs sm:text-sm mt-4 sm:mt-6 px-4">
            You can change this later from your profile settings
          </p>
        </div>
      )}
    </div>
  );
}
export default Customize;
