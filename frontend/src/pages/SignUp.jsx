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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#0d0d2b] to-[#000000] flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>

      {/* Futuristic grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-line"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <form
          className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/20 to-purple-950/20 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
          onSubmit={handleSignup}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <img src="/ai.png" alt="Virtual Assistant logo" className="h-10 w-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Register to Virtual Assistant
            </h1>
            <p className="mt-2 text-cyan-300/80 text-sm">
              Create your assistant profile
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-4 py-3 text-cyan-100 placeholder-cyan-300/50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-4 py-3 text-cyan-100 placeholder-cyan-300/50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-4 py-3 text-cyan-100 placeholder-cyan-300/50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {!showPassword && (
                <FaEye
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
              {showPassword && (
                <FaEyeSlash
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              )}
            </div>
          </div>

          {err.length > 0 && (
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {err}
            </p>
          )}

          <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] transition hover:from-cyan-400 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="mt-5 text-center text-sm text-cyan-300/80">
            Already have an account?{" "}
            <span
              className="text-cyan-300 font-semibold cursor-pointer hover:text-cyan-200"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
