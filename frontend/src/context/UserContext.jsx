import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://virtual-assistant-backend-8d5t.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      // Silently handle 401 errors (user not logged in)
      if (error.response?.status !== 401) {
        console.error("Error fetching current user:", error);
      }
    }
  };

  const groqResponse = async (command) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log(error);
      return { type: "error", response: "Sorry, I couldn't process that request." };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);
  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    groqResponse
  };
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
