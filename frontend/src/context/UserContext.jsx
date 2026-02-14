import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://virtual-assistant-backend-8d5t.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Simple axios instance
  const axiosInstance = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
  });

  const handleCurrentUser = async () => {
    try {
      const result = await axiosInstance.get("/api/user/current");
      setUserData(result.data);
    } catch (error) {
      // Silently fail - user is not logged in
    }
  };

  const groqResponse = async (command) => {
    try {
      const result = await axiosInstance.post("/api/user/asktoassistant", { command });
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
    groqResponse,
    axiosInstance,
  };
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
