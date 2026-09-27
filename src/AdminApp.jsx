import React, { useState } from 'react';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { ShieldCheck, LogOut, WifiOff, Activity } from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('khan_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [lang, setLang] = useState('en');
  const [officer, setOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('khan_admin_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (officerData) => {
    setOfficer(officerData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('khan_admin_auth', 'true');
      localStorage.setItem('khan_admin_officer', JSON.stringify(officerData));
    } catch {}
  };

  const handleLogout = () => {
    setOfficer(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('khan_admin_auth');
      localStorage.removeItem('khan_admin_officer');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans">
      {/* Admin Top Tactical Header */}
      <header className="sticky top-0 z-50 bg-[#0A0E18]/95 backdrop-blur border-b border-amber-500/25 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white uppercase">
                  DGMS CENTRAL <span className="text-amber-400">COMMAND</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 font-mono font-bold">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                Subterranean Mine Safety Intelligence & Compliance HQ • Dhanbad (Jharkhand)
              </p>
            </div>
          </div>

          {/* Right Status & Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <WifiOff className="w-3 h-3 text-emerald-400" />
              <span>AIR-GAPPED COMMAND NODE (PORT 5174)</span>
            </div>

            {/* Language Switcher in Admin Header */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                  lang === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                  lang === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('sat')}
                className={`px-2 py-1 rounded text-xs font-semibold transition font-['Noto_Sans_Ol_Chiki'] ${
                  lang === 'sat' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Santali (Ol Chiki)"
              >
                ᱥᱟᱱᱛᱟᱲᱤ
              </button>
            </div>

            {/* Officer Profile & Logout */}
            {isAuthenticated && officer && (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">{officer.name}</div>
                  <div className="text-[10px] font-mono text-amber-400 mt-0.5">{officer.station}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 text-xs font-semibold transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col items-center justify-center">
        {!isAuthenticated ? (
          <AdminLogin
            currentLang={lang}
            onLangChange={setLang}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <div className="w-full">
            <AdminDashboard lang={lang} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#05070B] py-3 px-4 text-center text-[10px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DGMS SURVEILLANCE NODE • PORT 5174</span>
          <span>MINES ACT 1952 § 22A • FACTORIES ACT 1948 • CMR 2017</span>
          <span>DIRECTORATE GENERAL OF MINES SAFETY (DHANBAD)</span>
        </div>
      </footer>
    </div>
  );
}
