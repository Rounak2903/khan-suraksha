import React, { useState, useEffect, useRef } from 'react';
import { 
  Siren, AlertTriangle, ShieldCheck, MapPin, QrCode, 
  Compass, Volume2, VolumeX, ArrowRight, CheckCircle2,
  Activity, Radio, LogOut, Flame, Wind, Clock, User, ChevronRight, X,
  ShieldAlert, Sparkles, Navigation
} from 'lucide-react';
import CertificateCard from '../assessment/CertificateCard';
import { postEmergencyAction, fetchEmergencyStatus, postMinerAction } from '../../utils/apiMiners';
import { playIndustrialBeep } from '../../utils/speechHelper';

const SHIFT_TEXTS = {
  en: {
    circle: 'DGMS DHANBAD • CIRCLE-1',
    coalfield: 'BCCL JHARIA COALFIELD • SEAM-4',
    title: 'Subterranean Mining Safety Companion & Telemetry Console',
    tabSos: '1. Emergency SOS & Mustering',
    tabMap: '2. Subterranean Mine Map (Monitor)',
    tabPassport: '3. Gate-Out QR Exit Pass',
    statDuration: 'SHIFT ELAPSED',
    statSignal: 'LORA MESH TELEMETRY',
    statVitals: 'PRE-SHIFT VITALS',
    statusNormal: 'NORMAL SHIFT ACTIVE',
    statusEmergency: '🚨 CRITICAL RED ALARM ACTIVE',
    sosPrompt: 'Underground Hazard Detected? Push SOS to broadcast live evacuation siren to Surface Control Room & Rescue Teams immediately.',
    pushSosBtn: '🚨 PUSH EMERGENCY SOS',
    triggerGas: '💥 CH₄ Methane Gas Spike (>1.25%)',
    triggerFire: '🔥 Conveyor Belt Smoke / Fire',
    alarmSounding: 'EMERGENCY SIREN BROADCASTING',
    refugeDistance: 'Refuge Chamber B (Sealed Oxygen Haven):',
    refugeDistValue: '65 meters • Bearing 045° NE (Seam 4 Gallery)',
    freshAirDistance: 'Fresh Air Intake Shaft:',
    freshAirDistValue: '180 meters • Bearing 180° S (Main Drift)',
    cancelSosBtn: 'End Alarm (False Alarm / Drill Complete)',
    mapTitle: 'Subterranean Mine 2D Digital Twin & Worker Position',
    mapSub: 'BCCL Jharia Colliery • Seam 2 & Seam 4 Gallery Layout • PDR Sensor Sync',
    legendYou: 'You (Active Worker Beacon)',
    legendRefuge: 'Refuge Chamber (Safe)',
    legendAir: 'Fresh Air Intake',
    legendHazard: 'Active Hazard Plume',
    compassHeading: 'Compass Heading: 045° NE • Cadence: 82 steps/min • Accuracy: ±1.2m',
    exitNoticeTitle: 'Ready to Conclude Underground Shift?',
    exitNoticeSub: 'Present this digital safety passport QR at the pit-head optical turnstile to log safe shift exit.',
    returnToCard: '← Return to Surface & Exit Shift',
    surfaceAscent: '✓ Turnstile Clearance Ready'
  },
  hi: {
    circle: 'डीजीएमएस धनबाद • मंडल-१',
    coalfield: 'बीसीसीएल झरिया कोयलांचल • सीम-४',
    title: 'भूमिगत खदान सुरक्षा साथी एवं टेलीमेट्री कंसोल',
    tabSos: '1. आपातकालीन SOS एवं अलार्म',
    tabMap: '2. 2D खदान मैप (नेविगेशन)',
    tabPassport: '3. गेट-आउट QR निकास पास',
    statDuration: 'शिफ्ट समय',
    statSignal: 'लोरा मेश सिग्नल',
    statVitals: 'स्वास्थ्य पैरामीटर',
    statusNormal: 'सामान्य शिफ्ट सक्रिय',
    statusEmergency: '🚨 गंभीर रेड अलार्म सक्रिय',
    sosPrompt: 'खदान में गैस रिसाव या आग दिखने पर तुरंत लाल बटन दबाएं। सरफेस कंट्रोल रूम और रेस्क्यू टीम को तुरंत सूचना जाएगी।',
    pushSosBtn: '🚨 आपातकालीन SOS दबाएं (PUSH SOS)',
    triggerGas: '💥 मीथेन गैस रिसाव (CH₄ > 1.25%)',
    triggerFire: '🔥 कन्वेयर बेल्ट धुआं / आग',
    alarmSounding: 'आपातकालीन सायरन बज रहा है',
    refugeDistance: 'निकटतम रिफ्यूज चैंबर (सुरक्षित ऑक्सीजन कमरा):',
    refugeDistValue: '65 मीटर • दिशा 045° उत्तर-पूर्व (NE)',
    freshAirDistance: 'ताजी हवा इनटेक शाफ्ट:',
    freshAirDistValue: '180 मीटर • दिशा 180° दक्षिण',
    cancelSosBtn: 'अलार्म बंद करें (सामान्य स्थिति / ड्रिल समाप्त)',
    mapTitle: 'भूमिगत खदान 2D डिजिटल ट्विन एवं कार्मिक स्थिति',
    mapSub: 'बीसीसीएल झरिया कोलियरी • सीम 2 एवं सीम 4 लेआउट • पी-डी-आर सेंसर सिंक',
    legendYou: 'आप (सक्रिय बीकन)',
    legendRefuge: 'रिफ्यूज चैंबर (सुरक्षित)',
    legendAir: 'ताजी हवा इनटेक',
    legendHazard: 'खतरे का क्षेत्र',
    compassHeading: 'कम्पास दिशा: 045° उत्तर-पूर्व • चाल: 82 कदम/मिनट • सटीकता: ±1.2m',
    exitNoticeTitle: 'शिफ्ट समाप्त करके सतह पर लौट रहे हैं?',
    exitNoticeSub: 'पिट-हेड गेट पर लगे कैमरे के सामने यह QR दिखाएं ताकि सुरक्षित निकास दर्ज हो सके।',
    returnToCard: '← शिफ्ट समाप्त करें व सतह पर लौटें',
    surfaceAscent: '✓ गेट-आउट सत्यापन तैयार'
  },
  sat: {
    circle: 'DGMS ᱫᱷᱟᱱᱵᱟᱫᱽ • ᱢᱟᱱᱰᱟᱞ-᱑',
    coalfield: 'BCCL ᱡᱷᱟᱨᱤᱭᱟ ᱠᱩᱭᱞᱟᱹ ᱴᱚᱴᱷᱟ • SEAM-4',
    title: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱟᱛᱮ ᱟᱨ ᱴᱮᱞᱤᱢᱮᱴᱨᱤ',
    tabSos: '1. ᱮᱢᱟᱨᱡᱮᱱᱥᱤ SOS',
    tabMap: '2. ᱠᱷᱟᱫᱟᱱ ᱢᱮᱯ (Map)',
    tabPassport: '3. ᱜᱮᱴ-ᱟᱣᱩᱴ QR ᱯᱟᱥ',
    statDuration: 'ᱥᱤᱯᱷᱴ ᱚᱠᱛᱚ',
    statSignal: 'LoRa MESH',
    statVitals: 'ᱦᱚᱲᱢᱚ ᱦᱟᱞᱚᱛ',
    statusNormal: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱹᱢᱤ',
    statusEmergency: '🚨 ᱟᱨᱟᱜ ᱦᱩᱥᱤᱭᱟᱹᱨ (EMERGENCY)',
    sosPrompt: 'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱜᱮᱥ ᱥᱮ ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱞᱮᱱᱠᱷᱟᱱ ᱞᱚᱜᱚᱱ ᱱᱚᱣᱟ ᱵᱟᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾',
    pushSosBtn: '🚨 ᱮᱢᱟᱨᱡᱮᱱᱥᱤ SOS ᱚᱛᱟᱭ ᱢᱮ',
    triggerGas: '💥 ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ ᱞᱤᱠ (CH₄ > 1.25%)',
    triggerFire: '🔥 ᱥᱮᱸᱜᱮᱞ / ᱫᱷᱩᱶᱟᱹ ᱧᱮᱞᱮᱱᱟ',
    alarmSounding: 'ᱥᱟᱭᱨᱮᱱ ᱥᱟᱰᱮᱜ ᱠᱟᱱᱟ',
    refugeDistance: 'ᱥᱩᱨ ᱨᱮᱯᱷᱤᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ (ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱲᱟᱜ):',
    refugeDistValue: '65 ᱢᱤᱴᱟᱨ • ᱩᱛᱟᱹᱨ-ᱯᱩᱨᱩᱵᱽ (NE)',
    freshAirDistance: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ:',
    freshAirDistValue: '180 ᱢᱤᱴᱟᱨ • ᱫᱟᱹᱠᱷᱤᱱ',
    cancelSosBtn: 'ᱟᱞᱟᱨᱢ ᱵᱚᱸᱫᱽ ᱢᱮ (ALL CLEAR)',
    mapTitle: 'Seam 4 ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱷᱟᱫᱟᱱ 2D ᱢᱮᱯ',
    mapSub: 'BCCL ᱡᱷᱟᱨᱤᱭᱟ • Seam 2 ᱟᱨ Seam 4 ᱞᱮᱟᱣᱩᱴ',
    legendYou: 'ᱟᱢ (ᱱᱚᱸᱰᱮ ᱢᱮᱱᱟᱢᱟ)',
    legendRefuge: 'ᱨᱮᱯᱷᱤᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ',
    legendAir: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ',
    legendHazard: 'ᱵᱚᱛᱚᱨ ᱴᱚᱴᱷᱟ',
    compassHeading: 'ᱫᱤᱥᱟᱹ: 045° NE • 82 steps/min',
    exitNoticeTitle: 'ᱥᱤᱯᱷᱴ ᱪᱟᱵᱟ ᱠᱟᱛᱮ ᱪᱮᱛᱟᱱ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟᱢ?',
    exitNoticeSub: 'ᱜᱮᱴ ᱠᱮᱢᱨᱟ ᱥᱟᱢᱟᱝ ᱨᱮ ᱱᱚᱣᱟ QR ᱩᱫᱩᱜ ᱢᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ᱾',
    returnToCard: '← ᱨᱩᱣᱟᱹᱲ ᱢᱮ',
    surfaceAscent: '✓ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ'
  }
};

export default function WorkerShiftCompanion({ worker, workerData, lang, onExitShift }) {
  const [activeTab, setActiveTab] = useState('sos'); // 'sos' | 'map' | 'passport'
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [hazardType, setHazardType] = useState('CH4_GAS');
  const [soundMuted, setSoundMuted] = useState(false);
  const [secondsInShift, setSecondsInShift] = useState(5320); // ~1 hr 28 min
  const [vitals, setVitals] = useState({ spo2: 97, pulse: 74 });
  const [workerPos, setWorkerPos] = useState({ x: 320, y: 284, dir: 1, steps: 1420 });

  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const T = SHIFT_TEXTS[lang] || SHIFT_TEXTS.hi || SHIFT_TEXTS.en;

  // Live PDR Movement Loop for Worker's single dot
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setWorkerPos(prev => {
        if (isEmergencyActive) {
          const targetX = 540;
          const targetY = 265;
          const dx = targetX - prev.x;
          const dy = targetY - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 10) return { ...prev, x: targetX, y: targetY };
          return {
            ...prev,
            x: Math.round(prev.x + (dx / dist) * 16),
            y: Math.round(prev.y + (dy / dist) * 16),
            steps: prev.steps + 2
          };
        }

        let nextDir = prev.dir;
        let nextX = prev.x + prev.dir * 16;
        if (nextX >= 460) {
          nextX = 460;
          nextDir = -1;
        } else if (nextX <= 240) {
          nextX = 240;
          nextDir = 1;
        }

        return {
          ...prev,
          x: nextX,
          y: 284,
          dir: nextDir,
          steps: prev.steps + 2
        };
      });
    }, 1200);

    return () => clearInterval(moveInterval);
  }, [isEmergencyActive]);

  // Live Shift Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsInShift(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatShiftTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check emergency status from server sync periodically
  useEffect(() => {
    const checkEmergency = async () => {
      try {
        const em = await fetchEmergencyStatus();
        if (em && em.active) {
          setIsEmergencyActive(true);
          setHazardType(em.hazard || 'CH4_GAS');
        } else if (em && em.active === false && isEmergencyActive) {
          stopSiren();
          setIsEmergencyActive(false);
        }
      } catch {}
    };

    checkEmergency();
    const pollId = setInterval(checkEmergency, 2500);
    return () => clearInterval(pollId);
  }, [isEmergencyActive]);

  // Audio Siren generator using Web Audio API
  const startSiren = () => {
    if (soundMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.35);
      osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.7);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 1.5;
      lfoGain.gain.value = 350;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      sirenOscRef.current = { osc, lfo, gain };
    } catch (e) {
      console.warn("Audio siren error", e);
    }
  };

  const stopSiren = () => {
    if (sirenOscRef.current) {
      try {
        sirenOscRef.current.osc.stop();
        sirenOscRef.current.lfo.stop();
      } catch {}
      sirenOscRef.current = null;
    }
  };

  const speakVoiceAlarm = () => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance();
      if (lang === 'hi') {
        msg.text = 'सावधान! खदान में आपातकालीन अलार्म घोषित हुआ है। कृपया शांत रहें और तुरंत निकटतम रिफ्यूज चैंबर की ओर बढ़ें!';
        msg.lang = 'hi-IN';
      } else if (lang === 'sat') {
        msg.text = 'ᱦᱩᱥᱤᱭᱟᱹᱨ! ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱟᱞᱟᱨᱢ! ᱞᱚᱜᱚᱱ ᱨᱮᱯᱷᱤᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ!';
        msg.lang = 'hi-IN';
      } else {
        msg.text = 'Attention! Subterranean emergency declared! Please evacuate towards the nearest refuge chamber immediately!';
        msg.lang = 'en-US';
      }
      msg.rate = 1.0;
      window.speechSynthesis.speak(msg);
    } catch {}
  };

  const handleTriggerSos = async (type = 'CH4_GAS') => {
    setHazardType(type);
    setIsEmergencyActive(true);
    startSiren();
    speakVoiceAlarm();

    // Broadcast to backend & Admin Console
    await postEmergencyAction({
      active: true,
      triggeredBy: worker?.name || workerData?.name || 'Worker Shreyash Jaiswal',
      workerId: worker?.id || workerData?.id || 'JH-BCCL-6858',
      hazard: type,
      location: 'Seam 4 - Active Longwall Face',
      time: new Date().toLocaleTimeString()
    });

    await postMinerAction({
      action: 'triggerSOS',
      id: worker?.id || workerData?.id || 'JH-BCCL-6858',
      workerName: worker?.name || workerData?.name || 'Shreyash Jaiswal',
      hazard: type,
      location: 'Seam 4 - Active Longwall Face'
    });
  };

  const handleClearSos = async () => {
    stopSiren();
    setIsEmergencyActive(false);
    playIndustrialBeep(880, 120);

    await postEmergencyAction({ active: false });
    await postMinerAction({
      action: 'clearSOS',
      id: worker?.id || workerData?.id
    });
  };

  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 animate-fade-in text-slate-100">
      {/* ======================================================== */}
      {/* 1. TOP INDUSTRIAL BANNER (MATCHING ADMIN DASHBOARD)      */}
      {/* ======================================================== */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-500 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isEmergencyActive 
          ? 'bg-gradient-to-r from-red-950 via-[#1e0a0a] to-[#0A0E18] border-red-500/80 animate-pulse'
          : 'bg-gradient-to-r from-[#0F172A] via-[#0D131F] to-[#070A11] border-slate-800'
      }`}>
        {/* Left: Miner Identification & Assigned Workplace */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
            isEmergencyActive 
              ? 'bg-red-500/20 border-red-500 text-red-400' 
              : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
          }`}>
            {isEmergencyActive ? <Siren className="w-7 h-7 animate-spin" /> : <ShieldCheck className="w-7 h-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {T.circle}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-slate-400">
                {T.coalfield}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                {worker?.name || workerData?.name || 'Shreyash Jaiswal'}
              </h1>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                {worker?.id || workerData?.id || 'JH-BCCL-6858'}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
                • {worker?.trade || 'Coal Face Driller'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Telemetry Stats Box (Matching Admin Stat Tiles) */}
        <div className="grid grid-cols-3 gap-2.5 p-2 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-center shrink-0">
          {/* Tile 1: Shift Timer */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">{T.statDuration}</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatShiftTime(secondsInShift)}</span>
            </span>
          </div>

          {/* Tile 2: LoRa Mesh Link */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">{T.statSignal}</span>
            <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>915 MHz OK</span>
            </span>
          </div>

          {/* Tile 3: Health Vitals & Alarm Status */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">{T.statVitals}</span>
            <span className="text-xs sm:text-sm font-black text-cyan-300 flex items-center justify-center gap-1 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{vitals.spo2}% • {vitals.pulse} BPM</span>
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. 3 EQUAL NAVIGATION TABS (MATCHING ADMIN TAB LAYOUT)   */}
      {/* ======================================================== */}
      <div className="p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 shadow-xl">
        {/* Tab 1: Emergency SOS */}
        <button
          type="button"
          onClick={() => setActiveTab('sos')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'sos'
              ? (isEmergencyActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-600/40 animate-pulse border border-red-400'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20')
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Siren className={`w-4 h-4 ${isEmergencyActive ? 'animate-spin' : ''}`} />
          <span>{T.tabSos}</span>
        </button>

        {/* Tab 2: 2D Mine Map */}
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{T.tabMap}</span>
        </button>

        {/* Tab 3: Gate-Out QR Exit Pass */}
        <button
          type="button"
          onClick={() => setActiveTab('passport')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'passport'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{T.tabPassport}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EMERGENCY SOS & MUSTERING COMMAND                 */}
      {/* ======================================================== */}
      {activeTab === 'sos' && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all duration-300 animate-fade-in ${
          isEmergencyActive
            ? 'bg-gradient-to-b from-red-950/90 via-[#180A0A] to-[#0A0E18] border-red-500/90'
            : 'bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border-slate-800'
        }`}>
          {isEmergencyActive ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Urgent Siren Alarm Banner */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500 text-red-300 text-xs font-mono font-bold animate-pulse">
                  <Siren className="w-4 h-4 animate-spin text-red-400" />
                  <span>{T.alarmSounding}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  {hazardType === 'CH4_GAS' ? '💥 CH₄ METHANE GAS LEAK DETECTED' : '🔥 CONVEYOR BELT FIRE OUTBREAK'}
                </h2>

                <p className="text-xs text-red-200/90 leading-relaxed font-mono">
                  🚨 Real-time alert transmitted to <strong>DGMS Mines Rescue Station (Dhanbad)</strong> and Surface Control Room. Audio beacon sounding across all subterranean sectors.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSoundMuted(!soundMuted)}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-2 transition"
                  >
                    {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    <span>{soundMuted ? 'Unmute Audio Siren' : 'Mute Audio Siren'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSos}
                    className="py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 transition active:scale-95"
                  >
                    {T.cancelSosBtn}
                  </button>
                </div>
              </div>

              {/* Right Column: Rapid Escape Route Navigation HUD */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-black/60 border border-red-500/50 space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-red-500/30 text-xs text-slate-400">
                  <span className="font-bold text-red-400">RAPID ESCAPE VECTORS (SEAM-4)</span>
                  <span className="text-[10px] text-emerald-400">COMPASS BEARING ACTIVE</span>
                </div>

                {/* Haven Vector */}
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Compass className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{T.refugeDistance}</span>
                      <span className="text-[11px] text-emerald-300">{T.refugeDistValue}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500 text-slate-950">
                    O₂ HAVEN
                  </span>
                </div>

                {/* Fresh Air Vector */}
                <div className="p-3.5 rounded-xl bg-sky-950/50 border border-sky-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{T.freshAirDistance}</span>
                      <span className="text-[11px] text-sky-300">{T.freshAirDistValue}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-sky-500 text-slate-950">
                    INTAKE AIR
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-[10px] text-red-300 leading-tight">
                  ⚠️ <strong>Protocol:</strong> Put on Self-Contained Self-Rescuer (SCSR) mask immediately. Follow gallery ceiling guide wire to Refuge Haven.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Big Push SOS Panic Button */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>DGMS EMERGENCY ACTION PLAN (RULE 77B / MINES RESCUE RULES 1985)</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Subterranean Rapid Panic & Evacuation Broadcast
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {T.sosPrompt}
                </p>

                {/* BIG PROMINENT PUSH SOS BUTTON */}
                <button
                  type="button"
                  onClick={() => handleTriggerSos('CH4_GAS')}
                  className="w-full py-6 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl shadow-red-600/40 flex flex-col items-center justify-center gap-1.5 border-2 border-red-400 transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Siren className="w-7 h-7 animate-pulse" />
                    <span>{T.pushSosBtn}</span>
                  </div>
                  <span className="text-[11px] font-mono text-red-100 font-normal">
                    BROADCAST TO SURFACE CONTROL ROOM & ALL SUBTERRANEAN MINERS
                  </span>
                </button>
              </div>

              {/* Right Column: Quick Incident Triggers & Safety Checkpoints */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-800">
                  1-TAP SPECIFIC HAZARD TRIGGERS:
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerSos('CH4_GAS')}
                  className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-left transition flex items-center justify-between group active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300">{T.triggerGas}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Influx Plume @ Seam 4 Longwall</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSos('FIRE')}
                  className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-left transition flex items-center justify-between group active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">{T.triggerFire}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Trunk Conveyor #2 Friction Smoke</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </button>

                <div className="pt-2 text-[10px] font-mono text-slate-500">
                  Central Mining Safety Command Node: Port 5174 synchronized via LoRa Telemetry.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SUBTERRANEAN 2D MINE MAP & PDR NAVIGATION         */}
      {/* ======================================================== */}
      {activeTab === 'map' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-base sm:text-lg font-bold text-white">{T.mapTitle}</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{T.mapSub}</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                ● PDR SENSOR SYNC ACTIVE
              </span>
            </div>
          </div>

          {/* Large High-Tech Mine Map Viewport */}
          <div className="relative rounded-2xl bg-[#070A11] border border-slate-800 p-4 sm:p-6 overflow-hidden min-h-[360px]">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            <svg viewBox="0 0 800 360" className="w-full h-auto max-h-[380px] drop-shadow-md">
              <line x1="50" y1="40" x2="750" y2="40" stroke="#475569" strokeWidth="3" strokeDasharray="6,4" />
              <text x="60" y="30" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">SURFACE PIT-HEAD COLLAR (DATUM 0.0m)</text>

              {/* Main Vertical Shaft */}
              <rect x="180" y="40" width="40" height="280" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="140" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace" transform="rotate(-90 140 160)">MAIN INTAKE SHAFT (320m)</text>

              {/* Return Air Incline */}
              <line x1="680" y1="40" x2="480" y2="300" stroke="#0ea5e9" strokeWidth="3" />
              <text x="600" y="120" fill="#0ea5e9" fontSize="10" fontFamily="monospace" transform="rotate(-40 600 120)">RETURN AIR INCLINE</text>

              {/* Seam 2 Gallery */}
              <rect x="220" y="150" width="380" height="24" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="240" y="166" fill="#cbd5e1" fontSize="10" fontFamily="monospace">SEAM 2 — DRILLING & BLASTING GALLERY</text>

              {/* Seam 4 Longwall Face */}
              <rect x="220" y="270" width="460" height="28" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="240" y="288" fill="#cbd5e1" fontSize="10" fontFamily="monospace">SEAM 4 — LONGWALL COAL FACE</text>

              {/* Refuge Chamber B (Safe Haven) */}
              <rect x="520" y="240" width="90" height="50" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
              <text x="532" y="262" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">REFUGE CHAMBER</text>
              <text x="536" y="278" fill="#a7f3d0" fontSize="8" fontFamily="monospace">O₂ POSITIVE PRESS.</text>

              {/* Emergency Gas Plume Overlay */}
              {isEmergencyActive && (
                <g className="animate-pulse">
                  <rect x="220" y="265" width="240" height="38" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="240" y="288" fill="#fee2e2" fontSize="11" fontFamily="monospace" fontWeight="bold">⚠️ GAS SPIKE (CH₄: 2.8%)</text>
                </g>
              )}

              {/* Live Moving Worker Beacon (Single Dot for Worker) */}
              <g 
                transform={`translate(${workerPos.x}, ${workerPos.y})`} 
                className="transition-transform duration-1000 ease-in-out cursor-pointer"
              >
                <circle cx="0" cy="0" r="10" fill={isEmergencyActive ? "#ef4444" : "#10b981"} stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="20" fill="none" stroke={isEmergencyActive ? "#ef4444" : "#10b981"} strokeWidth="2" className="animate-ping" opacity="0.8" />
                <rect x="12" y="-12" width="165" height="24" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke={isEmergencyActive ? "#ef4444" : "#10b981"} strokeWidth="1" />
                <text x="18" y="4" fill="#ffffff" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                  👷 YOU ({worker?.name ? worker.name.split(' ')[0] : 'Shreyash'})
                </text>
              </g>

              {/* Dynamic Evacuation Vector to Refuge Chamber */}
              {isEmergencyActive && (
                <line x1={workerPos.x} y1={workerPos.y} x2="520" y2="265" stroke="#34d399" strokeWidth="3" strokeDasharray="6,3" />
              )}
            </svg>

            {/* Live Compass Heading & Dynamic PDR Telemetry Strip */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Compass className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Direction: {workerPos.dir === 1 ? '090° East (Longwall Patrol)' : '270° West (Main Gate)'}</span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 font-bold">PDR Steps: {workerPos.steps.toLocaleString()}</span>
              </div>
              <span className="text-emerald-400 font-bold">
                Distance to Haven B: {Math.max(12, Math.round(Math.abs(520 - workerPos.x) * 0.45))}m
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-1">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {T.legendYou}
              </span>
              <span className="flex items-center gap-1.5 text-teal-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                {T.legendRefuge}
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                {T.legendAir}
              </span>
              {isEmergencyActive && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  {T.legendHazard}
                </span>
              )}
            </div>

            <span className="text-slate-500">DGMS Standard GIS Mine Floorplan v3</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DIGITAL PASSPORT / SHIFT GATE-OUT QR EXIT PASS    */}
      {/* ======================================================== */}
      {activeTab === 'passport' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in items-start">
          {/* Left Column: Shift Egress Instructions */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{T.exitNoticeTitle}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {T.exitNoticeSub}
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 font-mono text-xs space-y-2 text-emerald-300">
              <div className="flex justify-between">
                <span className="text-slate-400">CURRENT STATUS:</span>
                <span className="font-bold text-white">UNDERGROUND (SEAM 4)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DESIRED ACTION:</span>
                <span className="font-bold text-amber-300">GATE-OUT (SURFACE EGRESS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STATUTORY AUDIT:</span>
                <span className="text-emerald-400 font-bold">RULE 77B COMPLIANT</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
              💡 <strong>Tip:</strong> Tap on the QR code on the right to open <strong>Zoom QR Fullscreen</strong> for fast optical scanning at the pit-head webcam.
            </div>

            <button
              type="button"
              onClick={onExitShift}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition flex items-center justify-center gap-2"
            >
              <span>{T.returnToCard}</span>
            </button>
          </div>

          {/* Right Column: Physical Digital Safety Passport Card with Zoom QR */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <CertificateCard
              workerData={workerData || {
                id: worker?.id || 'JH-BCCL-6858',
                name: worker?.name || 'Shreyash Jaiswal',
                mine: worker?.colliery || 'BCCL Jharia Underground Seam 4',
                casScore: 94,
                certHash: 'f49a8820c7104b901235ea19',
                vitals: worker?.vitals || { spo2: 97, heartRate: 74, cognitiveScore: 98 }
              }}
              lang={lang}
              onReset={onExitShift}
            />
          </div>
        </div>
      )}
    </div>
  );
}
