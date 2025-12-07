import React from "react";

const AuthImagePattern = () => {
  return (
    <div className="hidden lg:flex w-full items-center justify-center bg-[#0f0f13] relative overflow-hidden">

      {/* Soft gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-500/10 to-transparent"></div>

      {/* Neon circles */}
      <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Welcome Text */}
      <h1 className="text-5xl font-extrabold text-white drop-shadow-xl tracking-wide z-10">
        Welcome to <span className="text-purple-400">Team😇</span>
      </h1>
    </div>
  );
};

export default AuthImagePattern;
