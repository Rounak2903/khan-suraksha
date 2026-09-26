import React from 'react';
import { ShieldCheck, HardHat, Eye, Volume2, VolumeX, WifiOff } from 'lucide-react';
import { translations } from '../data/translations';

export default function Header({ 
  activeView, 
  setActiveView, 
  lang, 
  setLang, 
  soundEnabled, 
  setSoundEnabled 
}) {
  const t = translations[lang] || translations.hi;

  return (
    <header className="sticky top-0 z-50 bg-[#0A0E15]/95 backdrop-blur border-b border-amber-500/20 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
              <HardHat className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0A0E15]" title="Offline Engine Active" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-slate-100 uppercase">
                खान सुरक्षा <span className="text-amber-400">AR</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-bold">
                DGMS 26041
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight font-medium hidden sm:block">
              Government of Jharkhand • Mining Vocational AR Simulator
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Offline badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
            <WifiOff className="w-3 h-3 text-emerald-400" />
            <span>PIT-OFFLINE READY</span>
          </div>

          {/* View Mode Toggle: Worker vs Admin */}
          <div className="flex bg-[#121824] p-1 rounded-lg border border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setActiveView('worker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeView === 'worker'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.workerMode}</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeView === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.adminMode}</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#121824] p-1 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-1 rounded text-xs transition ${
                lang === 'hi' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('sat')}
              className={`px-2 py-1 rounded text-xs transition font-['Noto_Sans_Ol_Chiki'] ${
                lang === 'sat' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Santali (Ol Chiki)"
            >
              ᱥᱟᱱᱛᱟᱲᱤ
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded text-xs transition ${
                lang === 'en' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-[#121824] border border-slate-700/60 text-slate-300 hover:text-amber-400 transition"
            title={soundEnabled ? 'Voice Guidance Active' : 'Voice Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
