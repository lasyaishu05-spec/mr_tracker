import { useState, useContext, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPin, setForgotPin] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotPin) {
      toast.error("Please enter both email and PIN");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post("/auth/pin-login", { email: forgotEmail, pin: forgotPin });
      toast.success("PIN Login successful");
      login(res.data.user, res.data.token);
      setIsForgotModalOpen(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid PIN or Email");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #dbeafe 0%, #f0f9ff 40%, #f8fafc 100%)'
      }}
    >
      {/* Decorative cloud-like elements and concentric lines for background matching the image */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-white/60 rounded-[100%] blur-3xl translate-y-1/2 pointer-events-none"></div>
      
      {/* Subtle concentric circles */}
      <div className="absolute top-[45%] left-1/2 w-[500px] h-[500px] border border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-[45%] left-1/2 w-[800px] h-[800px] border border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-[45%] left-1/2 w-[1100px] h-[1100px] border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-[420px] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] flex items-center justify-center mb-6">
            <LogIn className="w-6 h-6 text-gray-800" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Sign in with email</h1>
          <p className="text-[13px] text-gray-500 text-center leading-relaxed max-w-xs font-medium">
            Sign in to MRTracker to bring your field operations, data, and teams together.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all hover:bg-gray-100/50"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all hover:bg-gray-100/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button 
              type="button" 
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1C1C1E] hover:bg-black text-white rounded-2xl py-4 text-sm font-bold shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Started"}
          </button>
        </form>


      </div>

      {/* Forgot Password / PIN Login Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[400px] p-8 relative z-50">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency Access</h2>
            <p className="text-sm text-gray-500 mb-8 font-medium">Enter your email and the master PIN to securely login to your dashboard.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all hover:bg-gray-100/50"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={forgotPin}
                  onChange={(e) => setForgotPin(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all hover:bg-gray-100/50"
                  placeholder="Master PIN"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-3.5 bg-[#1C1C1E] text-white font-bold text-sm rounded-2xl hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify PIN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
