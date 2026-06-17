import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Users, ChevronRight, Building2, UserCircle, Sun, Moon, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { useScrollState } from '../hooks/useScrollState';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCountUp } from '../hooks/useCountUp';

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button 
    onClick={toggleTheme}
    className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    aria-label="Toggle theme"
  >
    {theme === 'light' ? <Moon className="w-5 h-5 text-text-h" /> : <Sun className="w-5 h-5 text-text-h" />}
  </button>
);

const AnimatedNumber = ({ end, duration = 2000, suffix = "" }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
  const count = useCountUp(end, duration, isVisible);
  return <span ref={ref}>{count}{suffix}</span>;
};

const FadeInSection = ({ children, className = "", delay = "" }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const isScrolled = useScrollState(50);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen text-text font-sans selection:bg-primary selection:text-white transition-colors duration-200">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel border-b border-border py-3 shadow-lg backdrop-blur-xl' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br - to-blue-600 flex items-center justify-center -">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading tracking-wide text-text-h">MRTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link 
              to="/login"
              className="px-6 py-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/10 rounded-full font-medium transition-all text-text-h"
            >
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/30 text-primary text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              The Future of Medical Sales Tracking
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight mb-8 animate-fade-in stagger-1 text-text-h">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r - via-blue-400 -">
                Field Sales Activity
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-text max-w-xl mb-10 animate-fade-in stagger-2 leading-relaxed">
              Gain complete transparency over your medical representatives. Log visits, schedule follow-ups, and monitor real-time productivity from a single unified dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-3">
              <Link 
                to="/login"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
              >
                Start Tracking Now
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Live Feed Card (Hero UI Element) */}
          <div className="relative animate-fade-in stagger-4 hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr - - rounded-[2.5rem] transform rotate-3 opacity-20 dark:opacity-30 blur-2xl" />
            <div className="glass-panel p-6 rounded-[2.5rem] border border-border shadow-2xl relative bg-surface/80">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-heading font-bold text-lg text-text-h">Live Activity Feed</h3>
                <span className="flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDuration: '1.5s' }} />
                  LIVE
                </span>
              </div>
              
              <div className="space-y-4">
                {[
                  { dr: "Dr. Yash", action: "Visit Completed", time: "Just now", icon: CheckCircle2, color: "text-emerald-500" },
                  { dr: "Dr. Ramesh", action: "Follow-up Scheduled", time: "2 min ago", icon: Calendar, color: "text-blue-500" },
                  { dr: "Dr. Appolo", action: "Visit Logged", time: "15 min ago", icon: MapPin, color: "text-primary" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-hover border border-border/50 animate-fade-in" style={{ animationDelay: `${500 + i * 200}ms` }}>
                    <div className={`w-10 h-10 rounded-full bg-surface flex items-center justify-center shadow-sm ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-text-h text-sm">{item.dr}</p>
                      <p className="text-xs text-text">{item.action}</p>
                    </div>
                    <span className="text-xs font-medium text-text">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="py-12 border-y border-border bg-surface-hover">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active MRs", value: 120, suffix: "+" },
              { label: "Visits Logged", value: 45000, suffix: "+" },
              { label: "Doctors Reached", value: 12500, suffix: "+" },
              { label: "Productivity Increase", value: 35, suffix: "%" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold font-heading text-primary">
                  <AnimatedNumber end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-text uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos / Social Proof */}
      <section className="py-16">
        <FadeInSection className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-text uppercase tracking-widest mb-8">Trusted by Forward-Thinking Pharma Companies</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale dark:opacity-40">
            {['MediTech', 'PharmaCorp', 'HealthSynergy', 'BioNexus', 'CureDynamics'].map((logo, idx) => (
              <span key={idx} className="text-xl md:text-2xl font-bold font-heading">{logo}</span>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative bg-surface-hover/30">
        <div className="max-w-7xl mx-auto">
          <FadeInSection className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-text-h">Designed for Peak Efficiency</h2>
            <p className="text-text max-w-2xl mx-auto text-lg">Everything you need to orchestrate a high-performing medical sales team without the administrative overhead.</p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-8 h-8 text-primary transition-colors group-hover:text-white" />,
                title: "Real-time Productivity",
                desc: "Monitor visit completion, follow-ups, and doctor interest levels instantly as your MRs log their activity from the field."
              },
              {
                icon: <Users className="w-8 h-8 text-accent transition-colors group-hover:text-white" />,
                title: "Doctor Engagement",
                desc: "Keep a centralized directory of healthcare professionals. Track products discussed, samples distributed, and crucial feedback."
              },
              {
                icon: <Building2 className="w-8 h-8 text-blue-500 transition-colors group-hover:text-white" />,
                title: "Manager Dashboards",
                desc: "Empower Area Sales Managers with bird's-eye views. Compare MR performance, spot trends, and drive strategic growth."
              }
            ].map((feature, idx) => (
              <FadeInSection key={idx} delay={`delay-[${idx * 150}ms]`}>
                <div className="glass-panel p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-300 hover:border-accent hover:shadow-xl bg-surface">
                  <div className="w-16 h-16 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4 text-text-h">{feature.title}</h3>
                  <p className="text-text leading-relaxed">{feature.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 relative border-y border-border">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-center mb-20 text-text-h">Hear From Our Users</h2>
          </FadeInSection>
          <div className="grid md:grid-cols-2 gap-10">
            <FadeInSection delay="delay-100">
              <div className="glass-panel p-10 rounded-3xl relative bg-surface hover:shadow-xl transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[60px] opacity-10" />
                <p className="text-xl text-text-h italic mb-8 leading-relaxed">
                  "MRTracker completely revolutionized how we monitor our territory. I no longer have to wait for end-of-week spreadsheets. I see doctor engagement the moment a visit concludes."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr - to-blue-500 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold font-heading text-lg text-text-h">Sarah Jenkins</h4>
                    <p className="text-sm text-primary font-medium">Area Sales Manager, PharmaCorp</p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay="delay-200">
              <div className="glass-panel p-10 rounded-3xl relative bg-surface hover:shadow-xl transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[60px] opacity-10" />
                <p className="text-xl text-text-h italic mb-8 leading-relaxed">
                  "Logging visits takes seconds. The follow-up scheduling features mean I never miss a callback with an interested doctor. It's built exactly for how we work in the field."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr - to-emerald-500 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold font-heading text-lg text-text-h">David Chen</h4>
                    <p className="text-sm text-accent font-medium">Medical Representative</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-surface-hover/50">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeInSection>
            <h2 className="text-5xl md:text-6xl font-extrabold font-heading mb-8 text-text-h">Ready to Elevate Your Sales?</h2>
            <p className="text-xl text-text mb-10">Join industry leaders utilizing MRTracker to maximize field efficiency and close the loop on healthcare professional engagement.</p>
            <Link 
              to="/login"
              className="inline-flex px-10 py-5 - - font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl items-center gap-3 text-lg"
            >
              Access Your Dashboard
              <ChevronRight className="w-6 h-6" />
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-text text-sm -">
        <p>&copy; {new Date().getFullYear()} MRTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
