import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, MessageSquare } from "lucide-react";
import { Loader2 } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore.js";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {login, isLoggingIn} = useAuthStore();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      login(formData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create your account</h1>
            <p className="text-base-content/60">Join with us to chat</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
    
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>

                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />

                {/* Toggle Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                <Loader2 className="size-5 animate-spin"/>
                Loading...
                </>
              ):(
                "Sign-In"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
            I don't have an account?  {" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
               Sign up
            </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern />
    </div>
  );
}

export default LoginPage