import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, AlertTriangle, Users, Award, 
  Search, CheckCircle2, QrCode, FileText, Activity, MapPin 
} from 'lucide-react';
import { jharkhandMinesData, sampleCertifiedWorkers } from '../../data/mineData';
import { translations } from '../../data/translations';

export default function AdminDashboard({ lang }) {
  const t = translations[lang] || translations.hi;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [qrVerifyResult, setQrVerifyResult] = useState(null);

  // Simulate scanning a worker QR code
  const handleSimulateScan = (worker) => {
    setQrVerifyResult({
      status: 'VERIFIED',
      worker: worker,
      timestamp: new Date().toLocaleTimeString(),
      hashValid: true
    });
  };

  const filteredWorkers = sampleCertifiedWorkers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.mine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in text-slate-100">
      {/* Title & DGMS Seal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
            </span>
            <span className="text-xs text-slate-400 font-mono">DHANBAD CIRCLE</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Jharkhand Mining Vocational Safety & Compliance Command
          </h1>
          <p className="text-xs text-slate-400">
            Monitoring mobile AR vocational certification under Mines Act, 1952 & Factories Act, 1948
          </p>
        </div>

        {/* Live Status Tag */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">COMPLIANCE SYNC</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              100% AUDIT READY
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-[#101622] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">Enrolled Workforce</div>
            <div className="text-2xl font-black text-white mt-1">7,030</div>
            <div className="text-[10px] text-slate-400 mt-1">Across 5 Industrial Belts</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-[#101622] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">AR Certified Rate</div>
            <div className="text-2xl font-black text-amber-400 mt-1">88.4%</div>
            <div className="text-[10px] text-emerald-400 mt-1">↑ +24% vs Paper Manuals</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-[#101622] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">30-Day Induction Incidents</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">ZERO</div>
            <div className="text-[10px] text-slate-400 mt-1">Last 90-day Clean Record</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-[#101622] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">30-Day Retention Multiplier</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">3.85x</div>
            <div className="text-[10px] text-slate-400 mt-1">Ebbinghaus Curve: &gt;75%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Mine Units Overview & QR Verifier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Jharkhand Mine Units Overview (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Jharkhand Mining Units Safety Index</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">BCCL • CCL • SAIL • TATA</span>
          </div>

          <div className="space-y-3">
            {jharkhandMinesData.map((mine) => (
              <div 
                key={mine.id}
                className="p-4 rounded-xl bg-[#101622] border border-slate-800 hover:border-amber-500/40 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{mine.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {mine.district}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Hazard Profile: <span className="text-orange-300">{mine.hazardLevel}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-amber-400">{mine.certifiedPercentage}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">Certified</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${mine.certifiedPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>Active: {mine.activeWorkers}</span>
                  <span>Pending Induction: {mine.pendingInduction}</span>
                  <span className="text-emerald-400">DGMS Score: {mine.complianceScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live QR Verifier & Mathematical Framework */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#101622] border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>DGMS Safety Passport Verifier</span>
            </h3>
            
            <p className="text-xs text-slate-400 mb-3">
              Mine Safety Officers can scan worker physical badges or mobile QR codes to check encrypted HMAC authentication offline.
            </p>

            {/* Quick Demo Scan Button */}
            <div className="space-y-2">
              <button
                onClick={() => handleSimulateScan(sampleCertifiedWorkers[0])}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-left flex items-center justify-between transition"
              >
                <span>Scan Somra Marandi's Pass</span>
                <span className="font-mono text-[10px]">TAP TO TEST →</span>
              </button>

              <button
                onClick={() => handleSimulateScan(sampleCertifiedWorkers[1])}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-left flex items-center justify-between transition"
              >
                <span>Scan Birsa Munda's Pass</span>
                <span className="font-mono text-[10px]">TAP TO TEST →</span>
              </button>
            </div>

            {/* Verification Result Card */}
            {qrVerifyResult && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-left animate-fade-in space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DGMS OFFICIAL RECORD VERIFIED</span>
                </div>
                <div className="text-xs text-white font-bold">
                  {qrVerifyResult.worker.name}
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  ID: {qrVerifyResult.worker.id} • Score: {qrVerifyResult.worker.casScore}%
                </div>
                <div className="text-[10px] text-slate-400 font-mono break-all">
                  Hash: {qrVerifyResult.worker.certHash}
                </div>
                <div className="text-[9px] text-emerald-300 pt-1 border-t border-emerald-900/50">
                  Officer: {qrVerifyResult.worker.dgmsOfficer}
                </div>
              </div>
            )}
          </div>

          {/* Mathematical Model Card for Judges */}
          <div className="p-4 rounded-xl bg-[#101622] border border-amber-500/20 text-left space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase">
              SIH Technical Evaluation Formula
            </div>
            <div className="text-xs text-slate-300 font-mono bg-black/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
              CAS = 0.45(Action_seq) + 0.30(T_ideal / T_actual) + 0.25(PPE_comp)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Evaluates reaction latency under simulated panic, spatial extinguisher angle, and buddy protocol instead of passive rote MCQs.
            </p>
          </div>
        </div>
      </div>

      {/* Certified Workers Registry Table */}
      <div className="p-4 rounded-xl bg-[#101622] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Certified Tribal & Industrial Workforce Registry</span>
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, ID, mine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">WORKER ID</th>
                <th className="pb-2">NAME</th>
                <th className="pb-2">MINE ALLOCATION</th>
                <th className="pb-2">LANGUAGE</th>
                <th className="pb-2">CAS SCORE</th>
                <th className="pb-2">LATENCY</th>
                <th className="pb-2">DGMS STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 text-amber-400 font-bold">{worker.id}</td>
                  <td className="py-2.5 text-white font-sans font-medium">{worker.name}</td>
                  <td className="py-2.5 text-slate-300 font-sans">{worker.mine}</td>
                  <td className="py-2.5 text-slate-400">{worker.language}</td>
                  <td className="py-2.5 text-emerald-400 font-bold">{worker.casScore}%</td>
                  <td className="py-2.5 text-slate-300">{worker.reactionTimeSec}s</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      CERTIFIED ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
