import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Award, ShieldCheck, Download, Printer, CheckCircle2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../../data/translations';

export default function CertificateCard({ workerData, lang, onReset }) {
  const t = translations[lang] || translations.hi;

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

  const qrPayload = JSON.stringify({
    id: workerData.id,
    name: workerData.name,
    score: workerData.casScore,
    status: 'VERIFIED_DGMS_COMPLIANT',
    act: 'Mines Act 1952 / DGMS Dhanbad',
    validUntil: '2027-09-26',
    hash: workerData.certHash
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

        {/* QR Code & Tamper-Proof Cryptographic Hash */}
        <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-slate-800 gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-md">
            <QRCodeSVG 
              value={qrPayload} 
              size={68} 
              level="M" 
              includeMargin={false} 
            />
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>HMAC-SHA256 SIGNED</span>
            </div>
            <div className="text-[8px] font-mono text-slate-500 break-all leading-tight mt-1">
              HASH: {workerData.certHash}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              Scan with DGMS Inspector Portal to verify offline.
            </div>
          </div>
        </div>

        {/* Footer Mandate Note */}
        <div className="mt-3 pt-2 border-t border-slate-800 text-[8px] font-mono text-slate-500 flex justify-between">
          <span>MINES ACT, 1952 § 22A</span>
          <span>VOCATIONAL TRAINING RULES 1966</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex gap-2 mt-4">
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
    </div>
  );
}
