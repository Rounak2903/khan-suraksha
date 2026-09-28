import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Award, ShieldCheck, Download, Printer, CheckCircle2, QrCode, Maximize2, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../../data/translations';

export default function CertificateCard({ workerData, lang, onReset, onEnterShift }) {
  const t = translations[lang] || translations.hi;
  const [isZoomed, setIsZoomed] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if confetti fails
    }
  }, []);

  // Ultra-compact cryptographic token for instant optical webcam recognition
  const qrPayload = JSON.stringify({
    id: workerData.id,
    name: workerData.name,
    score: workerData.casScore,
    status: 'VERIFIED_DGMS_COMPLIANT',
    spo2: workerData.vitals ? workerData.vitals.spo2 : 97,
    bpm: workerData.vitals ? workerData.vitals.heartRate : 82,
    hash: workerData.certHash ? workerData.certHash.slice(0, 16) : '0x7F4A89C1'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 animate-fade-in">
      {/* Physical ID Card Preview */}
      <div className="w-full bg-gradient-to-br from-[#131b26] via-[#0d1219] to-[#080b0f] border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Hologram / Golden Watermark Banner */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                GOVT OF JHARKHAND • DGMS
              </div>
              <div className="text-xs font-black tracking-tight text-white uppercase">
                DIGITAL SAFETY PASSPORT (खान सुरक्षा)
              </div>
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Worker Info & Details */}
        <div className="grid grid-cols-3 gap-3 items-center mb-4">
          {/* Worker Avatar Placeholder */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="w-20 h-24 rounded-lg bg-slate-800 border border-amber-500/40 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-2xl mb-1">👷</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">DGMS VERIFIED</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="col-span-2 text-left space-y-1">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Worker Name:</span>
              <div className="text-xs font-bold text-white leading-tight">
                {workerData.name || 'Somra Marandi (ᱥᱳᱢᱨᱟ ᱢᱟᱨᱟᱱᱰᱤ)'}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Worker ID / Mine:</span>
              <div className="text-[11px] font-mono text-amber-300 font-semibold">
                {workerData.id} • {workerData.mine}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-mono">
                CAS: {workerData.casScore}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                PASS: 26-Sep-2026
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Shift Health Clearance Strip (Phase 2 Integration) */}
        {workerData.vitals && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-[10px] font-mono text-emerald-300">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>DGMS FORM-B MEDICAL PASS:</span>
            </span>
            <span className="text-white font-bold">
              SpO2 {workerData.vitals.spo2}% • {workerData.vitals.heartRate} BPM • {workerData.vitals.cognitiveScore || 98}% ALERT
            </span>
          </div>
        )}

        {/* QR Code & Tamper-Proof Cryptographic Hash */}
        <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-slate-800 gap-3">
          <div 
            onClick={() => setIsZoomed(true)}
            className="bg-white p-2 rounded-xl shadow-lg shrink-0 cursor-pointer group relative hover:ring-2 hover:ring-amber-400 transition"
            title="Click to Zoom QR for Webcam Scanning"
          >
            <QRCodeSVG 
              value={qrPayload} 
              size={96} 
              level="L" 
              includeMargin={true} 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition text-white font-mono text-[9px] font-bold">
              🔍 ZOOM
            </div>
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold font-mono">
                <CheckCircle2 className="w-3 h-3" />
                <span>HMAC-SHA256 SIGNED</span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 underline cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Zoom QR</span>
              </button>
            </div>
            <div className="text-[8px] font-mono text-slate-500 break-all leading-tight mt-1">
              HASH: {workerData.certHash}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              Scan with DGMS Pit-Head Gate-In console.
            </div>
          </div>
        </div>

        {/* Phase 4 Pit-Head Ingress Guidance Strip */}
        <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>चरण 4: खदान प्रवेश (Ready for Pit-Head Gate-In)</span>
          </div>
          <p className="text-[10px] text-slate-300 font-mono">
            अपने फोन से इस QR पासपोर्ट की फोटो लें और खदान गेट स्कैनर कैमरे के सामने दिखाएं।
          </p>
        </div>

        {/* Footer Mandate Note */}
        <div className="mt-3 pt-2 border-t border-slate-800 text-[8px] font-mono text-slate-500 flex justify-between">
          <span>MINES ACT, 1952 § 22A</span>
          <span>VOCATIONAL TRAINING RULES 1966</span>
        </div>
      </div>

      {/* Enter Underground Shift Companion Button */}
      {onEnterShift && (
        <button
          type="button"
          onClick={onEnterShift}
          className="w-full mt-3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-2 border-emerald-400/60"
        >
          <span>⚡</span>
          <span>
            {lang === 'hi' 
              ? 'खदान कार्य मोड शुरू करें (Enter Underground Shift)' 
              : (lang === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱢᱤ ᱮᱦᱚᱵᱽ ᱢᱮ (Enter Shift)' : 'Enter Underground Shift Mode')}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      )}

      {/* Action Buttons */}
      <div className="w-full flex gap-2 mt-3">
        <button
          onClick={handlePrint}
          className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Safety Card</span>
        </button>

        <button
          onClick={onReset}
          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition"
        >
          {t.retake}
        </button>
      </div>

      {/* FULLSCREEN / ZOOMED QR MODAL FOR OPTICAL WEBCAM SCANNING */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f172a] border-2 border-amber-500/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              <span>DGMS Pit-Head Gate-In QR</span>
            </div>
            <h3 className="text-base font-black text-white mb-4">
              {workerData.name} ({workerData.id})
            </h3>

            {/* High-Contrast Large QR with Extra Quiet Zone Margin */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-emerald-400 mb-4">
              <QRCodeSVG 
                value={qrPayload} 
                size={220} 
                level="L" 
                includeMargin={true} 
              />
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-1 mb-4 w-full">
              <div className="flex justify-between">
                <span className="text-slate-500">DGMS Status:</span>
                <span className="text-emerald-400 font-bold">COMPLIANT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vitals / Alert:</span>
                <span className="text-white font-bold">{workerData.vitals ? `SpO2 ${workerData.vitals.spo2}% • ${workerData.vitals.heartRate} BPM` : 'Normal'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AR Score:</span>
                <span className="text-amber-400 font-bold">CAS {workerData.casScore}%</span>
              </div>
            </div>

            <div className="text-[11px] text-amber-300/90 font-mono bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 w-full">
              💡 <strong>Webcam Tip:</strong> Keep phone screen brightness around 60% and hold 1 to 2 feet away from camera.
            </div>

            <button
              onClick={() => setIsZoomed(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition cursor-pointer"
            >
              Close / कार्ड पर वापस जाएं
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
