import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, 
  Crosshair, ShieldCheck, Zap, Activity, Info
} from 'lucide-react';
import { translations } from '../../data/translations';
import { speakInstruction, playIndustrialBeep } from '../../utils/speechHelper';

export default function Module1FirePass({ lang, soundEnabled, onModuleComplete }) {
  const t = translations[lang] || translations.hi;
  const canvasRef = useRef(null);

  // PASS Steps: 1 = Pull Pin, 2 = Aim Base, 3 = Squeeze & Spray, 4 = Extinguished
  const [currentStep, setCurrentStep] = useState(1);
  const [pinPulled, setPinPulled] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);
  const [fireHealth, setFireHealth] = useState(100); // 100 down to 0
  const [sprayProgress, setSprayProgress] = useState(0);
  const [reactionTimer, setReactionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [aimLocked, setAimLocked] = useState(false);

  // Pressure gauge state
  const pressurePSI = 195; // Optimal green zone (180 - 210 PSI)

  // Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && currentStep < 4) {
      interval = setInterval(() => {
        setReactionTimer(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentStep]);

  // Voice Instructions on step change
  useEffect(() => {
    if (!soundEnabled) return;

    if (currentStep === 1) {
      playIndustrialBeep(700, 150);
      speakInstruction(t.passSteps.p.desc, lang);
    } else if (currentStep === 2) {
      playIndustrialBeep(850, 150);
      speakInstruction(t.passSteps.a.desc, lang);
    } else if (currentStep === 3) {
      playIndustrialBeep(900, 200);
      speakInstruction(t.passSteps.s1.desc + ' ' + t.passSteps.s2.desc, lang);
    } else if (currentStep === 4) {
      playIndustrialBeep(1100, 350);
      speakInstruction(t.fireExtinguished + ' ' + t.evacuatePath, lang);
    }
  }, [currentStep, soundEnabled, lang]);

  // -------------------------------------------------------------
  // REAL DYNAMIC PARTICLE SIMULATION (Fire, Smoke & Chemical Foam)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const fireParticles = [];
    const foamParticles = [];
    const smokeParticles = [];

    // Particle generators
    const createFireParticle = () => {
      if (fireHealth <= 0) return;
      const baseWidth = 80 * (fireHealth / 100);
      const centerX = canvas.width / 2;
      const baseY = canvas.height * 0.65;

      fireParticles.push({
        x: centerX + (Math.random() - 0.5) * baseWidth,
        y: baseY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 3 + 2.5),
        size: Math.random() * 18 + 12,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        colorType: Math.random() // 0 = yellow, 1 = orange, 2 = red
      });

      // Spawn light smoke
      if (Math.random() > 0.65) {
        smokeParticles.push({
          x: centerX + (Math.random() - 0.5) * baseWidth,
          y: baseY - 40,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(Math.random() * 2 + 1),
          size: Math.random() * 20 + 15,
          life: 0.6,
          decay: 0.015
        });
      }
    };

    const createFoamParticle = () => {
      // Foam streams from nozzle at bottom-right towards center fire base
      const startX = canvas.width * 0.85;
      const startY = canvas.height * 0.90;
      const targetX = canvas.width * 0.5;
      const targetY = canvas.height * 0.65;

      const angle = Math.atan2(targetY - startY, targetX - startX) + (Math.random() - 0.5) * 0.18;
      const speed = Math.random() * 6 + 14;

      foamParticles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 14 + 10,
        life: 1.0,
        decay: 0.04
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles
      if (fireHealth > 0) {
        for (let i = 0; i < 3; i++) createFireParticle();
      }

      if (isSpraying && fireHealth > 0) {
        for (let i = 0; i < 5; i++) createFoamParticle();
      }

      // 1. Draw Smoke Particles
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.4;
        p.life -= p.decay;

        if (p.life <= 0) {
          smokeParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(100, 116, 139, ${p.life * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Fire Base Glow
      if (fireHealth > 0) {
        const glowRadius = 70 * (fireHealth / 100);
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height * 0.65, 5,
          canvas.width / 2, canvas.height * 0.65, glowRadius
        );
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height * 0.65, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Fire Particles
      for (let i = fireParticles.length - 1; i >= 0; i--) {
        const p = fireParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.96;
        p.life -= p.decay;

        if (p.life <= 0 || p.size < 1) {
          fireParticles.splice(i, 1);
          continue;
        }

        let r = 245, g = 158, b = 11; // amber
        if (p.colorType > 0.6) { r = 239; g = 68; b = 68; } // red
        else if (p.colorType < 0.25) { r = 254; g = 240; b = 138; } // bright yellow

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life * 0.85})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Draw White Chemical Powder (Foam) Spray Particles
      for (let i = foamParticles.length - 1; i >= 0; i--) {
        const p = foamParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.3;
        p.life -= p.decay;

        if (p.life <= 0) {
          foamParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(248, 250, 252, ${p.life * 0.9})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. Draw Laser Aim Reticle on Base
      if (currentStep >= 2 && fireHealth > 0) {
        const targetX = canvas.width / 2;
        const targetY = canvas.height * 0.65;

        ctx.strokeStyle = aimLocked ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(targetX, targetY, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(targetX - 28, targetY);
        ctx.lineTo(targetX + 28, targetY);
        ctx.moveTo(targetX, targetY - 28);
        ctx.lineTo(targetX, targetY + 28);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpraying, fireHealth, currentStep, aimLocked]);

  // Handle Spray Action Holding
  useEffect(() => {
    let sprayInterval = null;
    if (isSpraying && currentStep === 3) {
      sprayInterval = setInterval(() => {
        setSprayProgress(prev => {
          const next = prev + 4;
          if (next >= 100) {
            setFireHealth(0);
            setCurrentStep(4);
            setIsSpraying(false);
            setIsTimerRunning(false);
            if (onModuleComplete) {
              onModuleComplete({
                moduleId: 'MOD-01-FIRE',
                accuracy: 96,
                reactionTime: parseFloat(reactionTimer.toFixed(1)),
                completed: true
              });
            }
          } else {
            setFireHealth(Math.max(0, 100 - next));
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(sprayInterval);
  }, [isSpraying, currentStep, reactionTimer]);

  const handlePullPin = () => {
    playIndustrialBeep(880, 120);
    setPinPulled(true);
    setTimeout(() => setCurrentStep(2), 600);
  };

  const handleLockAim = () => {
    playIndustrialBeep(920, 150);
    setAimLocked(true);
    setTimeout(() => setCurrentStep(3), 600);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden text-slate-100 select-none">
      
      {/* TOP TACTICAL HUD */}
      <div className="z-20 flex items-center justify-between p-3 bg-black/80 backdrop-blur border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            DRILL 01 • PASS PROTOCOL
          </span>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            PRESSURE: <span className="text-emerald-400 font-bold">{pressurePSI} PSI</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            TIME: <span className="text-amber-400 font-bold">{reactionTimer.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* CENTER INTERACTIVE CANVAS (Fire, Smoke & Spray Particle Simulator) */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />

        {/* Spatial Distance Readout */}
        <div className="absolute top-4 left-4 z-20 font-mono text-[10px] text-slate-400 bg-black/60 px-2 py-1 rounded border border-slate-800">
          RANGE TO FLAME: <span className="text-emerald-400 font-bold">2.4 METERS (SAFE)</span>
        </div>

        {/* Fire Extinguished Success Message */}
        {fireHealth <= 0 && (
          <div className="z-30 flex flex-col items-center text-center p-6 bg-black/85 rounded-2xl border-2 border-emerald-500 shadow-2xl backdrop-blur animate-fade-in max-w-xs">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-2" />
            <h3 className="text-base font-black text-emerald-300 uppercase tracking-wide">
              {t.fireExtinguished}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t.evacuatePath}
            </p>

            <div className="mt-4 flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold bg-emerald-950/70 px-4 py-2 rounded-lg border border-emerald-500/40">
              <span>VENTILATION SHAFT 04B</span>
              <ArrowRight className="w-4 h-4 animate-bounce" />
            </div>

            <div className="mt-3 text-[11px] text-slate-400 font-mono">
              Reaction Latency: <span className="text-amber-400 font-bold">{reactionTimer.toFixed(1)}s</span> (Pass &lt;15s)
            </div>
          </div>
        )}

        {/* 3D Simulated Extinguisher Nozzle Position (Bottom-Right) */}
        {currentStep === 3 && fireHealth > 0 && (
          <div className="absolute bottom-2 right-4 z-20 flex flex-col items-end pointer-events-none animate-pulse">
            <div className="text-[9px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded border border-cyan-500/40 mb-1">
              DCP NOZZLE CHARGED
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center bg-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION CONTROL DECK */}
      <div className="z-30 p-3 bg-[#0d131d]/95 backdrop-blur border-t border-slate-800 space-y-2">
        {/* Progress Bar for Step */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span className="font-bold text-amber-400">P-A-S-S METHOD SEQUENCE:</span>
          <span>FLAME SUPPRESSION: {100 - fireHealth}%</span>
        </div>

        {/* Visual Step Tabs */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold font-mono">
          <div className={`py-1 rounded border transition ${currentStep === 1 ? 'bg-amber-500 text-black border-amber-300 font-black' : currentStep > 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
            1. PULL
          </div>
          <div className={`py-1 rounded border transition ${currentStep === 2 ? 'bg-amber-500 text-black border-amber-300 font-black' : currentStep > 2 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
            2. AIM
          </div>
          <div className={`py-1 rounded border transition ${currentStep === 3 ? 'bg-amber-500 text-black border-amber-300 font-black' : currentStep > 3 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
            3. SQUEEZE
          </div>
          <div className={`py-1 rounded border transition ${currentStep === 4 ? 'bg-emerald-500 text-black border-emerald-300 font-black' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
            4. CLEAR ✓
          </div>
        </div>

        {/* DYNAMIC ACTION BUTTONS */}
        {currentStep === 1 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-amber-200 text-center font-medium">
              {lang === 'sat' ? 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱯᱤᱱ ᱚᱨ ᱚᱰᱚᱠ ᱢᱮ (Pull locking pin to unlock extinguisher)' : 'अग्निशामक की सुरक्षा सील और पिन खींचें (Pull Pin)'}
            </p>
            <button
              onClick={handlePullPin}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm tracking-wider uppercase shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>🧷 {t.passSteps.p.title}</span>
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-amber-200 text-center font-medium">
              {lang === 'sat' ? 'ᱥᱮᱸᱜᱮᱞ ᱵᱩᱴᱟᱹ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱢᱮ (Aim at burning fuel base, NOT flames)' : 'आग की लपटों पर नहीं, आग की जड़ (Base) पर निशाना लॉक करें'}
            </p>
            <button
              onClick={handleLockAim}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black rounded-xl text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Crosshair className="w-5 h-5" />
              <span>🎯 {lang === 'sat' ? 'ᱵᱩᱴᱟᱹ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱞᱚᱠ ᱢᱮ (LOCK TARGET ON BASE)' : 'आग की जड़ पर निशाना लॉक करें (LOCK AIM)'}</span>
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-cyan-200 text-center font-medium">
              {lang === 'sat' ? 'ᱞᱤᱵᱷᱟᱨ ᱫᱟᱵᱟᱣ ᱠᱟᱛᱮ ᱫᱚᱦᱚᱭ ᱢᱮ ᱟᱨ ᱟᱹᱪᱩᱨ ᱢᱮ (HOLD BUTTON TO SPRAY & SWEEP)' : 'बटन दबाकर रखें — केमिकल स्प्रे से आग बुझाएं (HOLD TO SPRAY)'}
            </p>
            <button
              onMouseDown={() => setIsSpraying(true)}
              onMouseUp={() => setIsSpraying(false)}
              onTouchStart={() => setIsSpraying(true)}
              onTouchEnd={() => setIsSpraying(false)}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition flex items-center justify-center gap-2 shadow-xl ${
                isSpraying
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 ring-4 ring-cyan-400/50 scale-[0.99]'
                  : 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white animate-pulse'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>
                {isSpraying
                  ? (lang === 'sat' ? '💨 ᱥᱯᱨᱮ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ... (SPRAYING FOAM...)' : '💨 केमिकल स्प्रे सक्रिय... (SPRAYING...)')
                  : (lang === 'sat' ? 'ᱫᱟᱵᱟᱣ ᱠᱟᱛᱮ ᱫᱚᱦᱚᱭ ᱢᱮ (HOLD TO SPRAY & SWEEP)' : 'दबाकर रखें: केमिकल स्प्रे शुरू करें (HOLD TO SPRAY)')}
              </span>
            </button>

            {/* Spray Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-100"
                style={{ width: `${sprayProgress}%` }}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="pt-1">
            <button
              onClick={() => {
                setCurrentStep(1);
                setPinPulled(false);
                setAimLocked(false);
                setFireHealth(100);
                setSprayProgress(0);
                setReactionTimer(0);
                setIsTimerRunning(true);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>{t.retake}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
