import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Building2, 
  WifiOff, 
  CheckCircle2, 
  AlertCircle,
  Globe2,
  KeyRound,
  Radio,
  FileText,
  Activity,
  Server
} from 'lucide-react';
import { playIndustrialBeep } from '../../utils/speechHelper';

const ADMIN_TEXTS = {
  en: {
    portalBadge: 'DGMS CENTRAL SURVEILLANCE • DHANBAD HQ',
    heroTag: 'GOVERNMENT OF JHARKHAND & MINISTRY OF COAL',
    heroTitle: 'Statutory Mining Safety Command & Control System',
    heroDesc: 'Centralized telemetry, subterranean personnel mustering, and digital compliance ledger under Mines Act 1952 & CMR 2017.',
    loginTitle: 'Statutory Officer Ingress',
    loginSub: 'Enter authorized administrative credentials to unlock pit-head monitoring.',
    idLabel: 'Admin Officer Call-Sign / ID',
    passLabel: 'Master Security Passcode',
    loginBtn: 'AUTHENTICATE & ENTER COMMAND CENTER',
    disclaimer: 'RESTRICTED ACCESS: Unauthorized login attempts are logged and punishable under Mines Act 1952 § 72C.'
  },
  hi: {
    portalBadge: 'डीजीएमएस केंद्रीय निगरानी • धनबाद मुख्यालय',
    heroTag: 'झारखंड सरकार एवं कोयला मंत्रालय भारत सरकार',
    heroTitle: 'वैधानिक खदान सुरक्षा कमान एवं नियंत्रण प्रणाली',
    heroDesc: 'भूमिगत खदानों की लाइव निगरानी, आपातकालीन रेस्क्यू ट्रैकर एवं डीजीएमएस डिजिटल उपस्थिति रिकॉर्ड (खान अधिनियम 1952)।',
    loginTitle: 'अधिकृत अधिकारी लॉगिन',
    loginSub: 'कंट्रोल रूम और लाइव हेडकाउंट डैशबोर्ड एक्सेस करने के लिए क्रेडेंशियल दर्ज करें।',
    idLabel: 'अधिकारी / एडमिन कॉल-साइन ID',
    passLabel: 'मास्टर सुरक्षा पासवर्ड',
    loginBtn: 'प्रमाणित करें एवं कमान कक्ष में प्रवेश करें',
    disclaimer: 'प्रतिबंधित प्रवेश: अनधिकृत लॉगिन प्रयास कानूनी रूप से दंडनीय हैं (Mines Act 1952 § 72C)।'
  },
  sat: {
    portalBadge: 'DGMS ᱫᱷᱟᱱᱵᱟᱫᱽ ᱦᱮᱰᱠᱩᱣᱟᱴᱚᱨ',
    heroTag: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ',
    heroTitle: 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱚᱢᱟᱱ ᱟᱨ ᱠᱚᱱᱴᱨᱳᱞ ᱥᱤᱥᱴᱚᱢ',
    heroDesc: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚᱣᱟᱜ ᱞᱟᱭᱤᱵᱽ ᱴᱨᱮᱠᱤᱝ, ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱨᱮᱥᱠᱤᱭᱩ ᱟᱨ DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱥᱚᱱ ᱨᱮᱠᱳᱨᱰ᱾',
    loginTitle: 'ᱚᱯᱷᱤᱥᱚᱨ ᱵᱚᱞᱚᱱ (Officer Ingress)',
    loginSub: 'ᱠᱚᱱᱴᱨᱳᱞ ᱨᱩᱢ ᱰᱮᱥᱵᱳᱨᱰ ᱠᱷᱩᱞᱟᱹᱭ ᱞᱟᱹᱜᱤᱫ credentials ᱮᱢ ᱢᱮ᱾',
    idLabel: 'ᱚᱯᱷᱤᱥᱚᱨ / Admin ID',
    passLabel: 'ᱢᱟᱥᱴᱟᱨ ᱯᱟᱥᱣᱟᱨᱰ',
    loginBtn: 'DGMS ᱠᱚᱱᱥᱳᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ',
    disclaimer: 'ᱵᱟᱹᱲᱤᱡ ᱵᱚᱞᱚᱱ ᱫᱚ ᱠᱷᱟᱫᱟᱱ ᱟᱹᱭᱤᱱ ᱑᱙᱕᱒ § 72C ᱞᱮᱠᱟᱛᱮ ᱥᱟᱡᱟ ᱦᱩᱭᱩᱜ-ᱟ᱾'
  }
};

export default function AdminLogin({ currentLang = 'en', onLangChange, onLoginSuccess }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const T = ADMIN_TEXTS[currentLang] || ADMIN_TEXTS.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const formattedId = adminId.trim().toLowerCase();
    const formattedPass = password.trim();

    if (!formattedId) {
      setError(
        currentLang === 'hi' ? 'कृपया एडमिन कॉल-साइन ID दर्ज करें' :
        currentLang === 'sat' ? 'Admin ID ᱮᱢ ᱢᱮ' :
        'Please enter Admin Call-Sign ID'
      );
      return;
    }
    if (!formattedPass) {
      setError(
        currentLang === 'hi' ? 'कृपया मास्टर सुरक्षा पासवर्ड दर्ज करें' :
        currentLang === 'sat' ? 'ᱢᱟᱥᱴᱟᱨ ᱯᱟᱥᱣᱟᱨᱰ ᱮᱢ ᱢᱮ' :
        'Please enter Master Security Passcode'
      );
      return;
    }

    setIsLoading(true);
    playIndustrialBeep(1000, 80);

    setTimeout(() => {
      if (formattedId === 'admin' && formattedPass === 'admin@1234') {
        setIsLoading(false);
        playIndustrialBeep(1200, 150);
        onLoginSuccess({
          role: 'DGMS_OFFICER',
          id: 'DGMS-DHN-01',
          name: 'Er. R. K. Soren, Director of Mines Safety',
          station: 'Dhanbad Region I (Jharkhand)'
        });
      } else {
        setIsLoading(false);
        setError(
          currentLang === 'hi' ? '❌ अमान्य क्रेडेंशियल! प्रवेश अस्वीकृत।' :
          currentLang === 'sat' ? '❌ ᱵᱟᱹᱲᱤᱡ credentials! ᱵᱚᱞᱚᱱ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾' :
          '❌ Invalid Call-Sign ID or Master Passcode. Access Denied.'
        );
        playIndustrialBeep(300, 200);
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto p-4 sm:p-6 animate-fade-in">
      {/* Top Bar with Language Selector */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">{T.portalBadge}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-amber-400 hidden sm:inline">DGMS PORTAL ID: 26041</span>
        </div>

        {/* Executive Language Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 font-sans">
          <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => onLangChange('en')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              currentLang === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLangChange('hi')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              currentLang === 'hi' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onLangChange('sat')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition font-['Noto_Sans_Ol_Chiki'] ${
              currentLang === 'sat' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ᱥᱟᱱᱛᱟᱲᱤ
          </button>
        </div>
      </div>

      {/* Main Split-Screen Executive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-amber-500/25 shadow-2xl overflow-hidden backdrop-blur">
        {/* Left Side: Command Telemetry & Stats (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#090D15]/80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-400/50">
                <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  STATUTORY ADMIN
                </span>
                <div className="text-xs font-bold text-slate-300 mt-0.5">
                  DHANBAD CIRCLE • ZONE-1
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              {T.heroTag}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
              {T.heroTitle}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {T.heroDesc}
            </p>

            {/* Live Telemetry Micro-Cards */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Monitored Coalfields:</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  BCCL, CCL, TATA STEEL
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>Subterranean Node Status:</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  ACTIVE • 100% AIR-GAPPED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Statutory Compliance:</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  RULE 77B REGISTER VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
            DIRECTOR GENERAL OF MINES SAFETY • MINISTRY OF LABOUR & EMPLOYMENT
          </div>
        </div>

        {/* Right Side: High-Security Login Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span>LEVEL-4 RESTRICTED SURVEILLANCE INGRESS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {T.loginTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {T.loginSub}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{T.idLabel}:</span>
                <span className="text-[10px] text-slate-500 font-mono">DGMS CALL-SIGN</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserCheck className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter Call-Sign ID (e.g. admin)"
                  className="w-full pl-10 pr-3 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{T.passLabel}:</span>
                <span className="text-[10px] text-slate-500 font-mono">ENCRYPTED KEY</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Master Passcode"
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>प्रमाणित किया जा रहा है (Authenticating Officer)...</span>
                </>
              ) : (
                <>
                  <span>{T.loginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Statutory Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 leading-normal">
            {T.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
