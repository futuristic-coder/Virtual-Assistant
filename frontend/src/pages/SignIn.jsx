import React, { useContext, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { set } from "mongoose";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      setLoading(false);
    } catch (err) {
      console.error("Signin error:", err);
      setErr(err.response.data.message || "An error occurred during signin.");
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="" onSubmit={handleSignIn}>
        <h1>Sign In to Virtual Assistant</h1>
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
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <p className="" onClick={() => navigate("/signup")}>
          Want to Create a new account ? <span>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
