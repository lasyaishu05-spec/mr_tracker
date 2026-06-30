import { useState, useContext, useEffect, useRef } from "react";
import api from "../services/api";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ShieldCheck, ArrowRight, Loader2, MapPin, ClipboardList, Shield, Activity, Users, Lock, ChevronRight, ActivitySquare } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPin, setForgotPin] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const loginSectionRef = useRef(null);

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      setForgotEmail("");
      setForgotPin("");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid PIN or Email");
    } finally {
      setForgotLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-text-h font-sans selection:bg-accent/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#FDFCFB]/80 backdrop-blur-md z-40 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A2E21] rounded-lg flex items-center justify-center">
              <ActivitySquare className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[#0A2E21]">MRTracker</h1>
              <p className="text-[10px] uppercase tracking-widest text-text font-semibold">Portal V2.4</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text">
            <a href="#overview" className="hover:text-primary transition-colors">Overview</a>
            <a href="#capabilities" className="hover:text-primary transition-colors">Capabilities</a>
            <a href="#protocol" className="hover:text-primary transition-colors">Protocol</a>
            <a href="#access" className="hover:text-primary transition-colors">Access</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-sm font-medium text-text hover:text-primary transition-colors">Support</button>
            <button 
              onClick={scrollToLogin}
              className="bg-[#0A2E21] text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#114633] transition-all transform hover:scale-[1.02]"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-accent">
              <div className="w-8 h-[1px] bg-accent"></div>
              Field Operations Platform
            </div>
            
            <h1 className="font-editorial text-5xl md:text-7xl font-medium leading-[1.1] text-[#0A2E21]">
              The quiet precision <br/> behind every <span className="italic text-accent">clinical visit.</span>
            </h1>
            
            <p className="text-lg text-text max-w-md leading-relaxed">
              MRTracker orchestrates medical representative operations with the rigor of an instrument and the clarity of an editorial. Coordinate visits, capture field intelligence, and maintain compliance — all from one refined workspace.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={scrollToLogin}
                className="bg-[#0A2E21] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#114633] transition-colors"
              >
                Access Portal <ChevronRight className="w-4 h-4" />
              </button>
              <button className="border border-border bg-white px-6 py-3 rounded-lg font-medium hover:bg-surface-hover transition-colors">
                Explore Capabilities
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border/50">
              <div>
                <div className="text-3xl font-editorial font-medium text-[#0A2E21]">2.4M</div>
                <div className="text-[10px] uppercase tracking-widest text-text mt-1 font-semibold">Visits Logged</div>
              </div>
              <div>
                <div className="text-3xl font-editorial font-medium text-[#0A2E21]">98.6%</div>
                <div className="text-[10px] uppercase tracking-widest text-text mt-1 font-semibold">Compliance</div>
              </div>
              <div>
                <div className="text-3xl font-editorial font-medium text-[#0A2E21]">47</div>
                <div className="text-[10px] uppercase tracking-widest text-text mt-1 font-semibold">Therapeutic Areas</div>
              </div>
            </div>
          </div>

          <div 
            className="relative animate-fade-in stagger-2 h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between"
            style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Subtle overlay to ensure the background blends well and text pops */}
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-900/20 to-purple-600/10 mix-blend-overlay"></div>

            {/* Top pill and badge */}
            <div className="flex justify-between items-start relative z-10">
               <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm font-semibold">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  Live - 247 active reps
               </div>
               <div className="bg-[#D4B872] text-[#0A2E21] p-4 rounded-xl shadow-lg max-w-[160px] translate-x-4 -translate-y-2">
                 <div className="text-[10px] uppercase tracking-wider font-bold mb-1">Featured</div>
                 <div className="font-semibold text-sm">Q4 Field Report</div>
                 <div className="text-xs opacity-75 mt-2">Just published</div>
               </div>
            </div>

            {/* Bottom chart widget */}
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl relative z-10 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div className="text-xs uppercase tracking-widest font-bold text-[#0A2E21]">Today's Activity</div>
                <Activity className="w-4 h-4 text-accent" />
              </div>
              <div className="flex items-end gap-2 h-20">
                {[40, 55, 30, 70, 60, 85, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#0A2E21]/80 rounded-t-md transition-all hover:bg-accent" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 px-6 bg-[#F4F1ED]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-accent mb-6">
                <div className="w-8 h-[1px] bg-accent"></div>
                Capabilities
              </div>
              <h2 className="font-editorial text-4xl md:text-5xl font-medium text-[#0A2E21] leading-tight max-w-md">
                An instrument built for <span className="italic text-accent">clinical precision.</span>
              </h2>
            </div>
            <div className="flex items-end pb-2">
              <p className="text-text max-w-md">
                Six core capabilities compose the platform. Each is engineered to reduce friction in field operations while elevating the quality of captured intelligence — from the first scheduled visit to the final compliance audit.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 bg-white rounded-3xl overflow-hidden shadow-sm border border-border/50">
            {[
              { icon: <MapPin className="w-5 h-5"/>, title: "Visit Orchestration", desc: "Schedule, route, and document field visits with geographic intelligence and calendar integration across therapeutic territories." },
              { icon: <ClipboardList className="w-5 h-5"/>, title: "Field Intelligence", desc: "Capture structured observations, sample distributions, and physician feedback in a unified, queryable record." },
              { icon: <ShieldCheck className="w-5 h-5"/>, title: "Compliance Guardrails", desc: "Built-in HIPAA, PhRMA, and Sunshine Act adherence with automated audit trails and disclosure logging." },
              { icon: <Activity className="w-5 h-5"/>, title: "Performance Analytics", desc: "Real-time dashboards surface call frequency, conversion signals, and territory saturation with editorial clarity." },
              { icon: <Users className="w-5 h-5"/>, title: "Team Coordination", desc: "Hierarchical roles for managers, reps, and medical liaisons with granular permissioning and delegation flows." },
              { icon: <Lock className="w-5 h-5"/>, title: "Enterprise Security", desc: "SOC 2 Type II infrastructure with SSO, MFA, and field-level encryption for sensitive clinical data.", bg: "bg-[#EAE6DF]" }
            ].map((cap, i) => (
              <div key={i} className={`p-10 border-b md:border-r border-border/50 relative ${cap.bg || ''}`}>
                <div className="text-xs font-mono font-bold text-text/40 absolute top-10 right-10">0{i+1}</div>
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shadow-sm border border-border/50 mb-6 text-[#0A2E21]">
                  {cap.icon}
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#0A2E21] mb-3">{cap.title}</h3>
                <p className="text-sm text-text leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Section */}
      <section id="protocol" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-accent mb-6">
            <div className="w-8 h-[1px] bg-accent"></div>
            Operating Protocol
            <div className="w-8 h-[1px] bg-accent"></div>
          </div>
          <h2 className="font-editorial text-4xl md:text-5xl font-medium text-[#0A2E21] leading-tight mb-6">
            Four movements, <br/> <span className="italic text-accent">one continuous workflow.</span>
          </h2>
          <p className="text-text max-w-2xl">
            The platform follows a deliberate sequence — from authentication through analysis — designed to mirror how medical operations actually unfold in the field.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-border/80"></div>
          
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { num: "I", title: "Authenticate", desc: "Sign in with your enterprise credentials. SSO and MFA supported." },
              { num: "II", title: "Orchestrate", desc: "Schedule visits, assign territories, and brief your field team." },
              { num: "III", title: "Document", desc: "Capture observations, samples, and physician feedback in real time." },
              { num: "IV", title: "Analyze", desc: "Review performance, compliance, and field intelligence dashboards." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 rounded-full bg-[#FDFCFB] border border-border flex items-center justify-center shadow-sm mb-8 mx-auto md:mx-0">
                  <span className="font-editorial text-2xl text-accent italic">{step.num}</span>
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#0A2E21] mb-3">{step.title}</h3>
                <p className="text-sm text-text leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-6 border-t border-border/50 max-w-5xl mx-auto text-center">
         <div className="flex items-center justify-center gap-4 text-xs font-bold tracking-widest uppercase text-accent mb-12">
            <div className="w-8 h-[1px] bg-accent"></div>
            Field Testimony
            <div className="w-8 h-[1px] bg-accent"></div>
          </div>

          <h2 className="font-editorial text-3xl md:text-4xl leading-relaxed text-[#0A2E21] mb-12 italic font-medium">
            "MRTracker replaced three separate systems with one coherent workspace. Our reps spend less time logging and more time in the field — exactly where they belong."
          </h2>

          <div className="flex items-center justify-center gap-4 mb-20">
            <div className="w-12 h-12 rounded-full bg-[#0A2E21] flex items-center justify-center text-white font-bold text-sm">DM</div>
            <div className="text-left">
              <div className="font-bold text-[#0A2E21] text-sm">Dr. Daniela Marsh</div>
              <div className="text-xs text-text">VP of Field Operations &middot; Helix Therapeutics</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-editorial font-medium text-accent">42%</div>
              <div className="text-[10px] uppercase tracking-widest text-text mt-2 font-semibold">Time Saved</div>
            </div>
            <div>
              <div className="text-2xl font-editorial font-medium text-accent">3.1x</div>
              <div className="text-[10px] uppercase tracking-widest text-text mt-2 font-semibold">Visit Frequency</div>
            </div>
            <div>
              <div className="text-2xl font-editorial font-medium text-accent">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-text mt-2 font-semibold">Audit Pass</div>
            </div>
            <div>
              <div className="text-2xl font-editorial font-medium text-accent">$2.4M</div>
              <div className="text-[10px] uppercase tracking-widest text-text mt-2 font-semibold">Annual Savings</div>
            </div>
          </div>
      </section>

      {/* Secure Access / Login Section */}
      <section ref={loginSectionRef} id="access" className="bg-[#1C1A17] text-white py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-[#D4B872] mb-6">
                <div className="w-8 h-[1px] bg-[#D4B872]"></div>
                Secure Access
              </div>
              <h2 className="font-editorial text-5xl md:text-6xl font-medium leading-[1.1] mb-6 !text-white" style={{ color: 'white' }}>
                Sign in to manage <br/> your <span className="italic text-[#D4B872]">field operations.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Access the MRTracker portal to coordinate medical representatives, document visits, and review field intelligence. Authentication is required for all sessions.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Shield className="w-5 h-5 text-[#D4B872]"/>, title: "Enterprise SSO", desc: "SAML 2.0, OIDC, and SCIM provisioning supported." },
                { icon: <ShieldCheck className="w-5 h-5 text-[#D4B872]"/>, title: "Multi-Factor Authentication", desc: "TOTP, hardware keys, and biometric verification." },
                { icon: <Lock className="w-5 h-5 text-[#D4B872]"/>, title: "Session Encryption", desc: "TLS 1.3 with certificate pinning and HSTS." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 max-w-sm">
              Contact your administrator if you don't have an account. New representative onboarding requires manager approval and compliance training certification.
            </p>
          </div>

          {/* Right Content - Login Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="bg-[#FDFCFB] text-text-h p-10 rounded-3xl shadow-2xl relative">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-text font-bold mb-1">Portal Access</div>
                  <h3 className="text-xl font-bold text-[#0A2E21]">MRTracker Sign In</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F4F1ED] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-text" />
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="rep.name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl text-sm focus:outline-none focus:border-[#0A2E21] focus:ring-1 focus:ring-[#0A2E21] transition-all"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-text">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-xs text-text hover:text-[#0A2E21] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl text-sm focus:outline-none focus:border-[#0A2E21] focus:ring-1 focus:ring-[#0A2E21] transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="remember" className="rounded border-border text-[#0A2E21] focus:ring-[#0A2E21]" />
                  <label htmlFor="remember" className="text-xs text-text font-medium">Keep me signed in for 14 days</label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 mt-2 bg-[#0A2E21] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-[#114633] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-2 text-xs text-text justify-center">
                <ShieldCheck className="w-4 h-4" />
                Protected by enterprise-grade security. All access is logged.
              </div>
            </div>

            <div className="text-center mt-6">
              <button 
                onClick={() => setIsForgotModalOpen(true)}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 w-full"
              >
                <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
                Need help signing in?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password / PIN Login Modal (Preserved Functionality) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FDFCFB] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-50 p-8" onClick={e => e.stopPropagation()}>
            <h2 className="font-editorial text-2xl font-medium text-[#0A2E21] mb-2">Emergency Access</h2>
            <p className="text-sm text-text mb-8">Enter your email and the master PIN to securely login to your dashboard.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl text-sm focus:outline-none focus:border-[#0A2E21] focus:ring-1 focus:ring-[#0A2E21] transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-2">Master PIN</label>
                <input
                  type="password"
                  required
                  value={forgotPin}
                  onChange={(e) => setForgotPin(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl text-sm focus:outline-none focus:border-[#0A2E21] focus:ring-1 focus:ring-[#0A2E21] transition-all"
                  placeholder="Enter PIN"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white text-text font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors border border-border/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 px-4 py-3 bg-[#0A2E21] text-white font-bold text-sm rounded-xl hover:bg-[#114633] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
