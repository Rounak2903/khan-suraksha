import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, AlertOctagon, ShieldCheck, CheckCircle2, UserCheck, 
  RotateCcw, Activity, ShieldAlert, ArrowRight, HeartPulse
} from 'lucide-react';
import { translations } from '../../data/translations';
import { speakInstruction, playIndustrialBeep } from '../../utils/speechHelper';

export default function Module2GasConfined({ lang, soundEnabled, onModuleComplete, onViewCertificate }) {
  const t = translations[lang] || translations.hi;
  const canvasRef = useRef(null);

  // Steps: 1 = Alarm Identification, 2 = PPE Selection, 3 = Buddy-check, 4 = Safe Zone
  const [gasStep, setGasStep] = useState(1);
  const [ch4Level, setCh4Level] = useState(2.4); // Methane % (Danger threshold >1.25%)
  const [coPpm, setCoPpm] = useState(78); // Carbon monoxide (PPM)
  const [selectedPpe, setSelectedPpe] = useState(null);
  const [buddyVerified, setBuddyVerified] = useState(false);
  const [reactionTimer, setReactionTimer] = useState(0);
  const [oxygenReserveMinutes, setOxygenReserveMinutes] = useState(60); // SCSR 60-min rated

  // Reaction timer
  useEffect(() => {
    let timer = null;
    if (gasStep < 4) {
      timer = setInterval(() => setReactionTimer(prev => prev + 0.1), 100);
    }
    return () => clearInterval(timer);
  }, [gasStep]);

  // Voice triggers
  useEffect(() => {
    if (!soundEnabled) return;

    if (gasStep === 1) {
      playIndustrialBeep(1200, 350);
      speakInstruction(t.gasSteps.step1, lang);
    } else if (gasStep === 2) {
      speakInstruction(t.gasSteps.step2, lang);
    } else if (gasStep === 3) {
      speakInstruction(t.gasSteps.step3, lang);
    } else if (gasStep === 4) {
      playIndustrialBeep(900, 300);
      speakInstruction(lang === 'sat' ? 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱧᱪᱟᱣ ᱮᱱᱟ।' : 'उत्कृष्ट! सभी खनिक सुरक्षित क्षेत्र में पहुंच गए हैं।', lang);
    }
  }, [gasStep, soundEnabled, lang]);

  // -------------------------------------------------------------
  // REAL-TIME GAS CONCENTRATION OSCILLOSCOPE WAVEFORM SIMULATION
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Oscilloscope Waveform for Methane (CH4) Concentration
      ctx.strokeStyle = gasStep >= 4 ? '#10b981' : '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = gasStep >= 4 ? '#10b981' : '#ef4444';
      ctx.beginPath();

      const centerY = canvas.height * 0.55;
      const amplitude = gasStep >= 4 ? 8 : 28;
      const frequency = gasStep >= 4 ? 0.03 : 0.08;

      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + Math.sin(x * frequency + phase) * amplitude + (Math.random() - 0.5) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [gasStep]);

  const handlePpeSelect = (type) => {
    setSelectedPpe(type);
    if (type === 'scsr') {
      playIndustrialBeep(980, 150);
      setTimeout(() => setGasStep(3), 600);
    } else {
      playIndustrialBeep(320, 300);
      alert(lang === 'sat'
        ? 'ᱵᱟᱝ ᱴᱷᱤᱠᱟᱹ! ᱠᱷᱟᱫᱟᱱ ᱵᱤᱥ ᱦᱚᱭ ᱞᱟᱹᱜᱤᱫ SCSR ᱢᱩᱠᱷᱚᱴᱟ ᱜᱮ ᱞᱟᱹᱠᱛᱤᱭᱟ।'
        : 'खतरनाक निर्णय! भूमिगत विषाक्त गैस (Methane/CO) के लिए केवल SCSR (Self-Contained Self-Rescuer) ऑक्सीजन मास्क ही मान्य है!');
    }
  };

  const handleBuddyCheck = () => {
    playIndustrialBeep(1050, 200);
    setBuddyVerified(true);
    setTimeout(() => {
      setGasStep(4);
      setCh4Level(0.4); // Safe level
      setCoPpm(12);
      if (onModuleComplete) {
        onModuleComplete({
          moduleId: 'MOD-02-GAS',
          accuracy: 94,
          reactionTime: parseFloat(reactionTimer.toFixed(1)),
          completed: true
        });
      }
    }, 800);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden text-slate-100 select-none">
      
      {/* TOP TACTICAL HUD */}
      <div className="z-20 flex items-center justify-between p-3 bg-black/80 backdrop-blur border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
            DRILL 02 • TOXIC GAS & SCSR
          </span>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className={`px-2 py-0.5 rounded border font-bold ${
            ch4Level > 1.25 ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse' : 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
          }`}>
            CH₄: {ch4Level}%
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            LATENCY: <span className="text-amber-400 font-bold">{reactionTimer.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* CENTER OSCILLOSCOPE STAGE */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Real-time Oscilloscope Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" />

        {/* Step 1: Warning Modal Overlay */}
        {gasStep === 1 && (
          <div className="z-10 flex flex-col items-center text-center p-5 bg-[#0e1622]/90 border-2 border-red-500/70 rounded-2xl backdrop-blur max-w-sm shadow-2xl animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-3">
              <AlertOctagon className="w-8 h-8 text-red-500 animate-bounce" />
            </div>

            <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
              SECTOR 04B CONFINED DRIFT
            </span>
            <h3 className="text-base font-black text-white mt-1 uppercase tracking-tight">
              {lang === 'sat' ? 'ᱵᱚᱛᱚᱨᱟᱱ ᱦᱚᱭ ᱪᱤᱛᱟᱹᱨ (GAS HAZARD)' : 'विषाक्त गैस रिसाव अलार्म'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t.gasSteps.step1}
            </p>

            <button
              onClick={() => setGasStep(2)}
              className="mt-5 w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 active:scale-95 transition"
            >
              {lang === 'sat' ? 'SCSR ᱦᱚᱨᱚᱜ ᱢᱮ (EQUIP OXYGEN RESCUER)' : 'सुरक्षा उपकरण चुनें (EQUIP PPE MASK) →'}
            </button>
          </div>
        )}

        {/* Step 2: PPE Equipment Selection Deck */}
        {gasStep === 2 && (
          <div className="z-10 flex flex-col items-center w-full max-w-sm space-y-2.5 animate-fade-in">
            <div className="text-center mb-1">
              <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                {lang === 'sat' ? 'ᱥᱟᱹᱨᱤ ᱢᱩᱠᱷᱚᱴᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ' : 'DGMS अनिवार्य उपकरण चयन करें'}
              </div>
              <div className="text-[10px] text-slate-400">
                Select the only certified respirator for underground oxygen-deficient environments.
              </div>
            </div>

            {/* Option 1 */}
            <button
              onClick={() => handlePpeSelect('cloth')}
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 text-left flex items-center justify-between transition group"
            >
              <div>
                <div className="text-xs font-bold text-slate-300 group-hover:text-red-400">Gamchha / Cotton Cloth</div>
                <div className="text-[10px] text-slate-500">Zero gas filtration • Fatal in &lt;90 seconds</div>
              </div>
              <span className="text-[10px] font-mono text-red-400 px-2 py-0.5 rounded bg-red-950/50 border border-red-800">
                UNSAFE ✗
              </span>
            </button>

            {/* Option 2 */}
            <button
              onClick={() => handlePpeSelect('dust')}
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 text-left flex items-center justify-between transition group"
            >
              <div>
                <div className="text-xs font-bold text-slate-300 group-hover:text-orange-400">N95 Dust & Particulate Mask</div>
                <div className="text-[10px] text-slate-500">Coal dust only • No chemical oxygen production</div>
              </div>
              <span className="text-[10px] font-mono text-orange-400 px-2 py-0.5 rounded bg-orange-950/50 border border-orange-800">
                INEFFECTIVE ✗
              </span>
            </button>

            {/* Option 3: SCSR (CORRECT) */}
            <button
              onClick={() => handlePpeSelect('scsr')}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-2 border-emerald-500 text-left flex items-center justify-between shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition"
            >
              <div>
                <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SCSR Chemical Oxygen Rescuer (KO₂ Bed)</span>
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">
                  Mines Act 1952 Mandatory: Generates 60-Min Closed-Circuit O₂
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-950 bg-emerald-400 px-2 py-1 rounded">
                MANDATORY ✓
              </span>
            </button>
          </div>
        )}

        {/* Step 3: Buddy-System Verification */}
        {gasStep === 3 && (
          <div className="z-10 flex flex-col items-center text-center p-5 bg-[#0e1622]/95 border-2 border-cyan-500/70 rounded-2xl backdrop-blur max-w-sm shadow-2xl animate-fade-in">
            <UserCheck className="w-14 h-14 text-cyan-400 mb-2 animate-bounce" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
              TWO-PERSON INTEGRITY CHECK
            </span>
            <h4 className="text-sm font-black text-white mt-1 uppercase">
              {lang === 'sat' ? 'ᱜᱟᱛᱮ ᱪᱮᱠ ᱯᱨᱳᱴᱳᱠᱳᱞ' : 'बडी-सिस्टम (Buddy System) सील जांच'}
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t.gasSteps.step3}
            </p>

            <button
              onClick={handleBuddyCheck}
              className={`mt-5 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg ${
                buddyVerified
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:from-cyan-400 shadow-cyan-500/30'
              }`}
            >
              {buddyVerified
                ? 'PARTNER SEAL VERIFIED ✓'
                : (lang === 'sat' ? 'ᱜᱟᱛᱮ ᱥᱤᱞ ᱴᱷᱤᱠ ᱜᱮᱭᱟ (VERIFY PARTNER SEAL)' : 'साथी की ऑक्सीजन सील प्रमाणित करें (VERIFY SEAL)')}
            </button>
          </div>
        )}

        {/* Step 4: Clearance & Safe Evacuation */}
        {gasStep === 4 && (
          <div className="z-10 flex flex-col items-center text-center p-6 bg-black/85 rounded-2xl border-2 border-emerald-500 shadow-2xl backdrop-blur animate-fade-in max-w-xs">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-2" />
            <h3 className="text-base font-black text-emerald-300 uppercase tracking-wide">
              {lang === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱮᱴᱮᱨ ᱮᱱᱟ!' : 'सुरक्षित क्षेत्र में निकासी सफल!'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Methane level normalized to 0.4%. Closed-circuit SCSR breathing verified for all shift members.
            </p>

            <div className="mt-3 flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold bg-emerald-950/70 px-4 py-1.5 rounded-lg border border-emerald-500/40">
              <span>PIT-HEAD SURFACE LEVEL</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Action Latency: <span className="text-amber-400 font-bold">{reactionTimer.toFixed(1)}s</span> (Pass &lt;20s)
            </div>

            {onViewCertificate && (
              <button
                type="button"
                onClick={onViewCertificate}
                className="mt-4 w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition"
              >
                <span>{lang === 'sat' ? 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱯᱟᱥᱯᱳᱨᱴ ᱧᱮᱞ ᱢᱮ ➔' : 'डिजिटल सुरक्षा पासपोर्ट देखें (VIEW PASSPORT) ➔'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM INFO BAR */}
      <div className="z-20 bg-[#0d131d]/95 p-3 rounded-t-xl border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>DGMS Threshold: &lt;1.25% CH₄ (Mines Act 1952)</span>
        </div>
        {gasStep === 4 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setGasStep(1);
                setSelectedPpe(null);
                setBuddyVerified(false);
                setReactionTimer(0);
                setCh4Level(2.4);
                setCoPpm(78);
              }}
              className="flex items-center gap-1 text-amber-400 hover:underline font-bold text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.retake}</span>
            </button>

            {onViewCertificate && (
              <button
                type="button"
                onClick={onViewCertificate}
                className="py-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 shadow transition"
              >
                <span>{lang === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ➔' : 'सर्टिफिकेट देखें ➔'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
