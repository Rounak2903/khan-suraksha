import React, { useState } from 'react';
import { 
  Globe2, 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  HardHat, 
  Sparkles,
  WifiOff,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { speakInstruction, playIndustrialBeep } from '../../utils/speechHelper';

const LANGUAGES = [
  {
    code: 'sat',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    engName: 'Santali',
    region: 'Santhal Pargana, Kolhan & Chota Nagpur',
    desc: 'ᱟᱭᱳ ᱟᱲᱟᱝ ᱛᱮ ᱥᱩᱨᱚᱠᱠᱷᱟ ᱥᱮᱪᱮᱫ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱰᱨᱤᱞ',
    audioGreeting: 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ! ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱠᱷᱟ ᱨᱮ ᱟᱢᱟᱜ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾ ᱟᱢᱟᱜ ᱡᱤᱣᱤ ᱟᱹᱰᱤ ᱜᱚᱱᱚᱝ-ᱟᱱᱟ᱾',
    accentColor: 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400',
    tag: 'INDIGENOUS REGIONAL'
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    script: 'देवनागरी (Devanagari)',
    engName: 'Hindi',
    region: 'Dhanbad, Ranchi, Bokaro & Ramgarh',
    desc: 'व्यावहारिक खदान सुरक्षा, अग्नि नियंत्रण व आपातकालीन निकासी प्रशिक्षण',
    audioGreeting: 'नमस्कार! खान-सुरक्षा में आपका स्वागत है। अपनी सुरक्षा और जीवन रक्षा के लिए प्रशिक्षण आरंभ करें।',
    accentColor: 'border-amber-500/80 bg-amber-500/10 text-amber-400',
    tag: 'NATIONAL STANDARD'
  },
  {
    code: 'en',
    nativeName: 'English',
    script: 'Latin Script',
    engName: 'English',
    region: 'Statutory DGMS & Engineering Standard',
    desc: 'Standard Industrial DGMS Safety, SCSR Protocols & Evacuation Tactics',
    audioGreeting: 'Welcome to Khan-Suraksha Vocational Safety Simulator. Prepare for your mandatory pre-shift drills.',
    accentColor: 'border-blue-500/80 bg-blue-500/10 text-blue-400',
    tag: 'TECHNICAL / DGMS'
  }
];

export default function LanguageSelection({ onSelectLanguage, initialLang = 'hi' }) {
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayVoice = (e, langObj) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    playIndustrialBeep(1000, 60);
    speakInstruction(langObj.audioGreeting, langObj.code);
    setTimeout(() => setIsPlayingAudio(false), 2500);
  };

  const handleCardClick = (langCode) => {
    playIndustrialBeep(880, 80);
    setSelectedLang(langCode);
    const matched = LANGUAGES.find(l => l.code === langCode);
    if (matched) {
      speakInstruction(matched.audioGreeting, langCode);
    }
  };

  const handleConfirm = () => {
    playIndustrialBeep(1200, 100);
    onSelectLanguage(selectedLang);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-auto p-4 sm:p-6 animate-fade-in">
      {/* Top DGMS Status Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">GOVT OF JHARKHAND</span>
          <span className="text-emerald-400">• DGMS 26041</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-500">CMR 2017 § 77B</span>
          <div className="flex items-center gap-1 text-amber-400">
            <WifiOff className="w-3 h-3" />
            <span>OFFLINE READY</span>
          </div>
        </div>
      </div>

      {/* Main Selection Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E1A] border border-slate-800 shadow-2xl p-5 sm:p-7 backdrop-blur overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800/80">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40 shrink-0">
            <HardHat className="w-6 h-6 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                खान-सुरक्षा <span className="text-amber-400">प्रशिक्षण द्वार</span>
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                STEP-01
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Government of Jharkhand • Multilingual Subterranean Safety Gateway
            </p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>अपनी भाषा चुनें / ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ / SELECT LANGUAGE</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            खदान में जाने से पहले अपनी मातृभाषा चुनें। सभी सुरक्षा निर्देश, अलार्म और वीआर प्रशिक्षण इसी भाषा में होंगे।
          </p>
        </div>

        {/* Language Options Cards */}
        <div className="space-y-3 mb-6">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => handleCardClick(lang.code)}
                className={`relative p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg border shrink-0 ${
                    isSelected ? lang.accentColor : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {lang.code === 'sat' ? 'ᱥ' : lang.code === 'hi' ? 'अ' : 'En'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({lang.engName})
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
                        {lang.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {lang.desc}
                    </p>
                  </div>
                </div>

                {/* Right Controls: Audio Preview & Radio */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePlayVoice(e, lang)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700"
                    title="आवाज़ सुनें (Listen Voice Preview)"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  </button>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue to Login Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
        >
          <span>
            {selectedLang === 'sat' 
              ? 'ᱞᱟᱦᱟᱜ ᱢᱮ (CONTINUE TO LOGIN)' 
              : selectedLang === 'hi' 
              ? 'लॉगिन के लिए आगे बढ़ें (CONTINUE TO LOGIN)' 
              : 'CONTINUE TO LOGIN & VERIFICATION'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Footnote */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          DIRECTORATE GENERAL OF MINES SAFETY (DHANBAD) • ZERO HARM PROTOCOL
        </div>
      </div>
    </div>
  );
}
