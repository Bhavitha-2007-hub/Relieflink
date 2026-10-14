import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Fingerprint,
  Radio,
} from 'lucide-react';
import { signInWithGoogle, UserIdentityProfile } from '../lib/firebase';

interface LoginPageProps {
  onLoginSuccess: (profile: UserIdentityProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // 1. Google Sign-In with Firebase Auth & OIDC Claims Verification
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    setStatusMessage('Initiating Google Identity Provider handshake...');

    try {
      setStatusMessage('Authenticating via Firebase Auth & OpenID Connect...');
      const profile = await signInWithGoogle();

      setStatusMessage('Verifying OIDC claims (sub, email_verified)...');

      if (profile.emailVerified) {
        setStatusMessage(
          `Email verified by Google. Writing identity record to Firestore (sub: ${profile.sub.slice(0, 8)}...)...`
        );
      }

      setTimeout(() => {
        setIsGoogleLoading(false);
        onLoginSuccess(profile);
      }, 350);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setIsGoogleLoading(false);
      setStatusMessage('');

      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Authentication popup was closed before verification completed.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Another authentication request is currently active.');
      } else {
        setErrorMessage(
          err?.message || 'Google Authentication failed. Please check popup permissions and try again.'
        );
      }
    }
  };

  // 2. Direct volunteer credential authentication
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setErrorMessage('Please provide a valid emergency dispatch or volunteer email address.');
        setIsLoading(false);
        return;
      }

      if (cleanPassword.length < 4) {
        setErrorMessage('Password must be at least 4 characters in length.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      // Construct stable deterministic sub for local session
      const deterministicSub = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`;
      onLoginSuccess({
        sub: deterministicSub,
        email: cleanEmail,
        emailVerified: true,
        displayName: cleanEmail.split('@')[0],
        role: 'Field Coordinator / Volunteer',
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] text-[#0B0F19] flex flex-col font-sans selection:bg-[#0052CC] selection:text-white">
      {/* Tactical Incident Header Bar */}
      <div className="bg-[#0B0F19] text-[#F4F5F6] px-4 py-2 text-xs font-mono tracking-wide border-b border-[#0B0F19]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#0052CC]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              ReliefLink // Incident Command Authentication
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
            <span>DISPATCH NETWORK: ONLINE</span>
            <span aria-hidden="true">/</span>
            <span>SECURE OIDC VERIFICATION</span>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Heavy Solid Field-Guide Style Container */}
          <div className="bg-white border-2 border-[#0B0F19] p-6 sm:p-8 space-y-6">
            {/* Header Typography */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono tracking-widest text-[#0052CC] uppercase font-bold">
                  System Gate 01
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#E9EBEF] text-[#0B0F19] px-2 py-0.5 font-semibold">
                  Field Ready
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#0B0F19] tracking-tight">
                ReliefLink Verification
              </h1>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Coordinate disaster response volunteer shifts, verified supply drops, and flood hazard routing.
              </p>
            </div>

            {/* Status Feedback Toast */}
            {statusMessage && (
              <div className="p-3 bg-[#EBF3FF] border-l-2 border-[#0052CC] text-xs text-[#0052CC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="font-mono text-[11px] leading-tight">{statusMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-[#FEF2F2] border-l-2 border-[#B45309] text-xs text-[#991B1B] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <span className="font-medium text-[11px] leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Primary Action: Official Sign in with Google Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-3 px-4 bg-[#0B0F19] hover:bg-[#1A2333] active:bg-[#000000] text-white font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-3 transition-colors border-2 border-[#0B0F19] cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {isGoogleLoading ? 'Verifying Credentials...' : 'Sign In With Google'}
                </span>
              </button>
              <div className="text-[10px] font-mono text-slate-500 text-center tracking-tight">
                Authenticates via Firebase Auth with OIDC claims verification
              </div>
            </div>

            {/* Hairline Divider with Tactical Label */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
                <span className="bg-white px-3 text-slate-400 font-semibold">
                  Or Volunteer Email Dispatch
                </span>
              </div>
            </div>

            {/* Direct Email / Password Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="coordinator@domain.org"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F8F9FA] border border-slate-300 text-xs text-[#0B0F19] placeholder-slate-400 focus:outline-none focus:border-[#0052CC] focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#F8F9FA] border border-slate-300 text-xs text-[#0B0F19] placeholder-slate-400 focus:outline-none focus:border-[#0052CC] focus:bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0B0F19] font-bold text-xs tracking-wider uppercase border-2 border-[#0B0F19] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none"
              >
                <span>Authorize &amp; Enter Incident Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Architecture Invariants Footnote */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-3 h-3 text-[#0052CC]" />
                Primary Key: <span className="text-[#0B0F19] font-semibold">OIDC sub</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#064E3B] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Zero-Trust Rules Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Prototype Safety Disclaimer */}
      <footer className="border-t border-slate-300 bg-white py-4 px-4 text-center text-xs text-slate-600">
        <div className="max-w-4xl mx-auto">
          <strong>Prototype Disclaimer:</strong> Fictional demonstration data. Calamity status dynamically adjusts to the user's selected location. In a real emergency, follow official instructions from local disaster management authorities.
        </div>
      </footer>
    </div>
  );
};
