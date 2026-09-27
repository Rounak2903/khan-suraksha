import React, { useState, useEffect } from 'react';

import { 
  HardHat, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Building2, 
  Clock, 
  WifiOff, 
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  Globe2
} from 'lucide-react';
import { playIndustrialBeep } from '../../utils/speechHelper';
import { fetchMasterMiners, postMinerAction } from '../../utils/apiMiners';

const STORAGE_KEY = 'khan_suraksha_registered_miners';

const DEFAULT_ACCOUNTS = {};


const LABELS = {
  sat: {
    terminalTitle: 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱚᱞᱚᱱ ᱫᱩᱣᱟᱹᱨ',
    terminalSub: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ • ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    loginTab: 'ᱵᱚᱞᱚᱱ (Login)',
    signupTab: 'ᱱᱟᱣᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱨᱮᱡᱤᱥᱴᱟᱨ',
    labourId: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ID:',
    pin: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱤᱱ:',
    pinPlaceholder: '᱔-ᱮᱞ ᱨᱮᱭᱟᱜ ᱯᱤᱱ ᱮᱢ ᱢᱮ',
    shift: 'ᱠᱟᱹᱢᱤ ᱯᱟᱞᱤ:',
    loginBtn: 'ᱵᱚᱞᱚᱱ ᱢᱮ ᱟᱨ ᱞᱟᱦᱟᱜ ᱢᱮ',
    newHere: 'ᱯᱩᱭᱞᱩ ᱫᱷᱟᱣ ᱮᱢ ᱦᱮᱡ ᱟᱠᱟᱱᱟ? ',
    signupLink: 'ᱱᱚᱸᱰᱮ ᱥᱟᱭᱤᱱ ᱟᱯ ᱢᱮ',
    name: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ:',
    assignedId: 'ᱢᱮᱱᱮᱡᱽᱢᱮᱱᱴ ᱮᱢ ᱟᱠᱟᱫ ID:',
    colliery: 'ᱠᱷᱟᱫᱟᱱ / ᱡᱟᱭᱜᱟ:',
    createPin: 'ᱱᱟᱣᱟ ᱯᱤᱱ ᱵᱮᱱᱟᱣ ᱢᱮ:',
    confirmPin: 'ᱯᱤᱱ ᱫᱚᱦᱲᱟ ᱮᱢ ᱢᱮ:',
    signupBtn: 'ᱨᱮᱡᱤᱥᱴᱟᱨ ᱢᱮ ᱟᱨ ᱯᱤᱱ ᱥᱮᱴ ᱢᱮ',
    haveAccount: 'ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱯᱤᱱ ᱢᱮᱱᱟᱜ-ᱟ? ',
    loginLink: 'ᱵᱚᱞᱚᱱ ᱢᱮ',
    changeLang: 'ᱯᱟᱹᱨᱥᱤ ᱵᱚᱫᱚᱞ',
    successPinSet: '✓ ᱮᱠᱟᱣᱩᱱᱴ ᱥᱟᱹᱛ ᱮᱱᱟ! ᱱᱤᱛᱚᱜ ᱵᱚᱞᱚᱱ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱢ᱾',
    errEnterId: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ID ᱮᱢ ᱢᱮ᱾',
    errEnterPin: '᱔-ᱮᱞ ᱨᱮᱭᱟᱜ ᱯᱤᱱ ᱮᱢ ᱢᱮ᱾',
    errIdNotFound: '❌ ID DGMS ᱨᱮᱡᱤᱥᱴᱟᱨ ᱨᱮ ᱵᱟᱹᱱᱩᱜ-ᱟ! ᱢᱟᱲᱟᱝ ᱮᱰᱢᱤᱱ ᱴᱷᱮᱱ ᱨᱮᱡᱤᱥᱴᱟᱨ ᱢᱮ᱾',
    errPinNotSet: '⚠️ ᱱᱚᱶᱟ ID ᱞᱟᱹᱜᱤᱫ ᱯᱤᱱ ᱵᱟᱝ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾ "Sign Up" ᱨᱮ ᱪᱟᱞᱟᱣ ᱢᱮ᱾',
    errIncorrectPin: '❌ ᱵᱷᱩᱞ ᱯᱤᱱ᱾',
    errEnterName: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ ᱮᱢ ᱢᱮ᱾',
    errPinLength: 'ᱯᱤᱱ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱔-ᱮᱞ ᱨᱮᱭᱟᱜ ᱦᱩᱭᱩᱜ ᱞᱟᱹᱠᱛᱤ᱾',
    errPinMismatch: 'ᱵᱟᱱᱟᱨ ᱯᱤᱱ ᱵᱟᱝ ᱢᱤᱞᱟᱹᱣᱜ ᱠᱟᱱᱟ᱾',
    errPinAlreadySet: '⚠️ ᱱᱚᱶᱟ ID ᱨᱮᱭᱟᱜ ᱯᱤᱱ ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾ "ᱵᱚᱞᱚᱱ" ᱴᱮᱵᱽ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾'
  },
  hi: {
    terminalTitle: 'खान-सुरक्षा प्रवेश टर्मिनल',
    terminalSub: 'झारखंड सरकार • भूमिगत औद्योगिक प्रवेश द्वार',
    loginTab: 'लॉगिन',
    signupTab: 'नया श्रमिक पंजीकरण (साइन अप)',
    labourId: 'आवंटित लेबर ID:',
    pin: 'सुरक्षा पिन:',
    pinPlaceholder: 'अपना 4-अंकों का पिन दर्ज करें',
    shift: 'कार्य पाली:',
    loginBtn: 'प्रवेश करें और आगे बढ़ें',
    newHere: 'पहली बार आए हैं? ',
    signupLink: 'यहाँ नया पिन बनाएं',
    name: 'श्रमिक का पूरा नाम:',
    assignedId: 'प्रबंधन द्वारा आवंटित लेबर ID:',
    colliery: 'आवंटित खदान / कार्यक्षेत्र:',
    createPin: 'नया 4-अंकों का पिन बनाएं:',
    confirmPin: 'पिन दोबारा दर्ज करें:',
    signupBtn: 'पंजीकृत करें और पिन सेट करें',
    haveAccount: 'पहले से पिन बना चुके हैं? ',
    loginLink: 'लॉगिन करें',
    changeLang: 'भाषा बदलें',
    successPinSet: '✓ खाता सफलतापूर्वक बन गया! अब आप सीधे लॉगिन कर सकते हैं।',
    errEnterId: 'कृपया लेबर ID दर्ज करें।',
    errEnterPin: 'कृपया 4-अंकों का पिन दर्ज करें।',
    errIdNotFound: '❌ यह लेबर ID DGMS मास्टर रजिस्टर में मौजूद नहीं है! कृपया पहले एडमिन से Form-B नामांकन करवाएं।',
    errPinNotSet: '⚠️ इस ID का पिन अभी नहीं बना है। कृपया पहले "साइन अप" में जाकर 4-अंकों का पिन बनाएं।',
    errIncorrectPin: '❌ गलत सुरक्षा पिन दर्ज किया गया है।',
    errEnterName: 'कृपया श्रमिक का पूरा नाम दर्ज करें।',
    errPinLength: 'सुरक्षा पिन कम से कम 4 अंकों का होना चाहिए।',
    errPinMismatch: 'दोनों पिन मेल नहीं खा रहे हैं।',
    errPinAlreadySet: '⚠️ इस लेबर ID का पिन पहले ही सेट हो चुका है। कृपया लॉगिन करें।'
  },
  en: {
    terminalTitle: 'Pit-Head Safety Clearance Terminal',
    terminalSub: 'Government of Jharkhand • Subterranean Industrial Ingress',
    loginTab: 'Login',
    signupTab: 'New Worker Registration (Sign Up)',
    labourId: 'Labour Mining ID (DGMS ID):',
    pin: 'Security PIN / Password:',
    pinPlaceholder: 'Enter 4-digit PIN',
    shift: 'Operational Shift:',
    loginBtn: 'AUTHENTICATE & PROCEED',
    newHere: 'First time here? ',
    signupLink: 'Sign Up and set your PIN',
    name: 'Worker Full Name:',
    assignedId: 'Management Allotted Labour ID:',
    colliery: 'Colliery / Mining Seam:',
    createPin: 'Create 4-Digit Security PIN:',
    confirmPin: 'Confirm Security PIN:',
    signupBtn: 'REGISTER & SET PIN',
    haveAccount: 'Already have a PIN? ',
    loginLink: 'Login here',
    changeLang: 'Change Language',
    successPinSet: '✓ Account registered successfully! You can now log in.',
    errEnterId: 'Please enter Labour ID.',
    errEnterPin: 'Please enter 4-digit PIN.',
    errIdNotFound: '❌ Labour ID not found in DGMS Master Ledger! Please contact Mine Admin first.',
    errPinNotSet: '⚠️ No PIN configured yet for this ID. Please switch to "Sign Up" to create your 4-digit PIN.',
    errIncorrectPin: '❌ Incorrect Security PIN entered.',
    errEnterName: 'Please enter worker full name.',
    errPinLength: 'Security PIN must be at least 4 digits.',
    errPinMismatch: 'PINs do not match.',
    errPinAlreadySet: '⚠️ PIN is already set for this Labour ID. Please use the Login tab.'
  }
};

export default function PitHeadLogin({ lang = 'hi', onLoginSuccess, onBackToLanguage }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Form states
  const [loginId, setLoginId] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [loginShift, setLoginShift] = useState('Shift A (06:00 - 14:00)');

  // Sign Up states
  const [signupName, setSignupName] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupColliery, setSignupColliery] = useState('BCCL Jharia Underground (Seam 4)');
  const [signupPin, setSignupPin] = useState('');
  const [signupConfirmPin, setSignupConfirmPin] = useState('');
  const [showSignupPin, setShowSignupPin] = useState(false);

  // Status & Feedback states (localized by key)
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', key: string, customText?: string }
  const [isLoading, setIsLoading] = useState(false);

  const L = LABELS[lang] || LABELS.en;

  // Auto-detect worker profile when Labour ID is entered
  useEffect(() => {
    let active = true;
    const lookupId = async () => {
      if (signupId.trim().length >= 6) {
        try {
          const miners = await fetchMasterMiners();
          if (!active) return;
          const found = miners[signupId.trim().toUpperCase()];
          if (found) {
            if (!signupName) setSignupName(found.name);
            if (found.colliery) setSignupColliery(found.colliery);
          }
        } catch {}
      }
    };
    lookupId();
    return () => { active = false; };
  }, [signupId]);

  const switchMode = (mode) => {
    playIndustrialBeep(1000, 60);
    setAuthMode(mode);
    setFeedback(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const formattedId = loginId.trim().toUpperCase();
    if (!formattedId) {
      setFeedback({ type: 'error', key: 'errEnterId' });
      return;
    }
    if (!loginPin) {
      setFeedback({ type: 'error', key: 'errEnterPin' });
      return;
    }

    setIsLoading(true);
    playIndustrialBeep(880, 80);

    const masterMiners = await fetchMasterMiners();
    const existingUser = masterMiners[formattedId];

    if (!existingUser) {
      setIsLoading(false);
      setFeedback({ type: 'error', key: 'errIdNotFound' });
      return;
    }

    if (!existingUser.pin) {
      setIsLoading(false);
      setFeedback({ type: 'error', key: 'errPinNotSet' });
      return;
    }

    if (existingUser.pin !== loginPin) {
      setIsLoading(false);
      setFeedback({ type: 'error', key: 'errIncorrectPin' });
      return;
    }

    setIsLoading(false);
    onLoginSuccess({
      ...existingUser,
      shift: loginShift,
      prefLang: lang
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const formattedId = signupId.trim().toUpperCase();
    const formattedName = signupName.trim();

    if (!formattedId) {
      setFeedback({ type: 'error', key: 'errEnterId' });
      return;
    }
    if (!formattedName) {
      setFeedback({ type: 'error', key: 'errEnterName' });
      return;
    }
    if (signupPin.length < 4) {
      setFeedback({ type: 'error', key: 'errPinLength' });
      return;
    }
    if (signupPin !== signupConfirmPin) {
      setFeedback({ type: 'error', key: 'errPinMismatch' });
      return;
    }

    setIsLoading(true);
    playIndustrialBeep(920, 80);

    // Verify against DGMS Master Ledger
    const masterMiners = await fetchMasterMiners();
    const enrolledRecord = masterMiners[formattedId];

    if (!enrolledRecord) {
      setIsLoading(false);
      setFeedback({ type: 'error', key: 'errIdNotFound' });
      return;
    }

    if (enrolledRecord.pinSet && enrolledRecord.pin) {
      setIsLoading(false);
      setFeedback({ type: 'error', key: 'errPinAlreadySet' });
      return;
    }

    // Set PIN in Master Ledger
    await postMinerAction({
      action: 'setPin',
      id: formattedId,
      pin: signupPin
    });

    setIsLoading(false);
    setFeedback({ type: 'success', key: 'successPinSet' });
    setLoginId(formattedId);
    setLoginPin(signupPin);

    // Switch to login tab and prefill for seamless authentication
    setTimeout(() => {
      setAuthMode('login');
    }, 1100);
  };


  return (
    <div className="w-full max-w-lg mx-auto my-auto p-4 sm:p-6 animate-fade-in">
      {/* Top DGMS Status Bar with Language Switcher link */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">DGMS DHANBAD NODE</span>
          <span className="text-emerald-400">• GATE 01</span>
        </div>

        {/* Change Language Button */}
        <button
          type="button"
          onClick={onBackToLanguage}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition text-[11px] font-sans border border-slate-700"
          title="भाषा बदलने के लिए क्लिक करें"
        >
          <Globe2 className="w-3 h-3 text-amber-400" />
          <span>{L.changeLang}</span>
        </button>
      </div>

      {/* Main Tactical Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E1A] border border-slate-800 shadow-2xl p-5 sm:p-7 backdrop-blur overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800/80">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40 shrink-0">
            <HardHat className="w-6 h-6 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                {L.terminalTitle}
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                STEP-02
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {L.terminalSub}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
              authMode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{L.loginTab}</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
              authMode === 'signup'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{L.signupTab}</span>
          </button>
        </div>

        {/* Feedback Messages - 100% reactive to currently selected language */}
        {feedback && feedback.type === 'error' && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{feedback.customText || L[feedback.key] || feedback.key}</span>
          </div>
        )}

        {feedback && feedback.type === 'success' && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{L[feedback.key] || feedback.key}</span>
          </div>
        )}


        {/* ================= LOGIN FORM ================= */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{L.labourId}</span>
                <span className="text-[10px] text-slate-500 font-mono">e.g. JH-BCCL-9901</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserCheck className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                  placeholder="e.g. JH-BCCL-9901"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{L.pin}</span>
                <span className="text-[10px] text-slate-500">4-DIGIT PIN</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  type={showLoginPin ? 'text' : 'password'}
                  maxLength={6}
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder={L.pinPlaceholder}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPin(!showLoginPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{L.shift}</span>
              </label>
              <select
                value={loginShift}
                onChange={(e) => setLoginShift(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00 | Morning)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00 | Afternoon)</option>
                <option value="Shift C (22:00 - 06:00)">Shift C (22:00 - 06:00 | Night)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>{L.loginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">{L.newHere}</span>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                {L.signupLink}
              </button>
            </div>
          </form>
        ) : (
          /* ================= SIGN UP FORM ================= */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {L.name}
              </label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g. सोमरा मरांडी / Ramesh Kumar"
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>{L.assignedId}</span>
                <span className="text-[10px] text-slate-500">BY ADMIN</span>
              </label>
              <input
                type="text"
                value={signupId}
                onChange={(e) => setSignupId(e.target.value.toUpperCase())}
                placeholder="e.g. JH-BCCL-1025"
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>{L.colliery}</span>
              </label>
              <select
                value={signupColliery}
                onChange={(e) => setSignupColliery(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="BCCL Jharia Underground (Seam 4)">BCCL Jharia Underground (Seam 4)</option>
                <option value="CCL North Karanpura (Incline 2)">CCL North Karanpura (Incline 2)</option>
                <option value="Tata Steel West Bokaro (Shaft 3)">Tata Steel West Bokaro (Shaft 3)</option>
                <option value="SAIL Chasnalla Colliery">SAIL Chasnalla Colliery</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {L.createPin}
                </label>
                <div className="relative">
                  <input
                    type={showSignupPin ? 'text' : 'password'}
                    maxLength={6}
                    value={signupPin}
                    onChange={(e) => setSignupPin(e.target.value)}
                    placeholder="4-digit PIN"
                    className="w-full px-3 pr-8 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPin(!showSignupPin)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showSignupPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {L.confirmPin}
                </label>
                <input
                  type={showSignupPin ? 'text' : 'password'}
                  maxLength={6}
                  value={signupConfirmPin}
                  onChange={(e) => setSignupConfirmPin(e.target.value)}
                  placeholder="Re-enter PIN"
                  className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>{L.signupBtn}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-400">{L.haveAccount}</span>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                {L.loginLink}
              </button>
            </div>
          </form>
        )}

        {/* Footnote */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          DIRECTORATE GENERAL OF MINES SAFETY (DHANBAD) • ZERO HARM PROTOCOL
        </div>
      </div>
    </div>
  );
}
