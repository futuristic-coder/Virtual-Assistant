import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
// import Customize from "./pages/customize"
// import { userDataContext } from "./context/userContext";
// import Home from "./pages/Home"

function App() {
  // const {userData, setUserData}=useContext(userDataContext)
  return (
    <Routes>
      {/* <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home />:<Navigate to={"/customize"}/> } /> */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<SignIn />} />
      {/* <Route path="/customize" element={userData?<Customize />:<Navigate to={"/signup"}/>}/> */}
    </Routes>
  );
}

export default App;
