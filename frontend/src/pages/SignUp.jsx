import React, { useContext, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl,userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);


    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true },
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (err) {
      console.error("Signup error:", err);
      setUserData(null);
      setLoading(false);
      setErr(err.response.data.message || "An error occurred during signup.");
    }
  };

  return (
    <div>
      <form className="" onSubmit={handleSignup}>
        <h1>Register to Virtual Assistant</h1>
        <input
          type="text"
          placeholder="Enter your name"
          className=""
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="Enter your email"
          className=""
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className=""
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <FaEye className="" onClick={() => setShowPassword(true)} />
          )}
          {showPassword && (
            <FaEyeSlash className="" onClick={() => setShowPassword(false)} />
          )}
        </div>
        {err.length > 0 && <p className="">{err}</p>}
        <button className="" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="" onClick={() => navigate("/signin")}>
          Already have an account?<span>Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
