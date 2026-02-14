import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://virtual-assistant-backend-8d5t.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Create axios instance with interceptor
  const axiosInstance = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
  });

  // Response interceptor to handle 401 silently
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // For 401 errors on /api/user/current, silently fail (user not logged in)
      if (
        error.response?.status === 401 &&
        error.config.url === "/api/user/current"
      ) {
        return Promise.resolve({ data: null });
      }
      return Promise.reject(error);
    }
  );

  const handleCurrentUser = async () => {
    try {
      const result = await axiosInstance.get("/api/user/current");
      if (result.data) {
        setUserData(result.data);
        console.log(result.data);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
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
