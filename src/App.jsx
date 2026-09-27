import React, { useState } from 'react';
import Header from './components/Header';
import LanguageSelection from './components/auth/LanguageSelection';
import PitHeadLogin from './components/auth/PitHeadLogin';
import HealthCheckup from './components/health/HealthCheckup';
import ARCameraViewport from './components/ar/ARCameraViewport';
import CertificateCard from './components/assessment/CertificateCard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { translations } from './data/translations';
import { Flame, Wind, Award, LogOut } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('worker'); // 'worker' | 'admin'
  const [workerStep, setWorkerStep] = useState('language'); // 'language' | 'login' | 'health' | 'training'
  const [currentWorker, setCurrentWorker] = useState(null);
  const [lang, setLang] = useState('hi'); // 'hi' | 'sat' | 'en'
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Worker Module States
  const [selectedModule, setSelectedModule] = useState(1); // 1 = Fire PASS, 2 = Gas Leak
  const [completedModules, setCompletedModules] = useState({});
  const [showCertificate, setShowCertificate] = useState(false);

  const t = translations[lang] || translations.hi;

  // 1. Language Selected -> Move to Login Screen
  const handleLanguageSelect = (selectedLang) => {
    setLang(selectedLang);
    setWorkerStep('login');
  };

  // 2. Login Succeeded -> Move to Pre-Shift Health Check Screen
  const handleLoginSuccess = (workerData) => {
    setCurrentWorker(workerData);
    setWorkerStep('health');
  };

  // 3. Health Check Cleared -> Move to AR Vocational Training
  const handleHealthCleared = (healthData) => {
    setCurrentWorker(prev => ({
      ...prev,
      vitals: healthData
    }));
    setWorkerStep('training');
  };

  // Switch back to Language selection from Login
  const handleBackToLanguage = () => {
    setWorkerStep('language');
  };


  // Logout
  const handleLogout = () => {
    setCurrentWorker(null);
    setWorkerStep('language');
    setShowCertificate(false);
    setCompletedModules({});
  };

  const handleModuleComplete = (result) => {
    setCompletedModules(prev => ({
      ...prev,
      [result.moduleId]: result
    }));
  };

  const handleResetTraining = () => {
    setShowCertificate(false);
    setCompletedModules({});
    setSelectedModule(1);
  };

  const workerCertificationData = {
    id: currentWorker?.id || 'JH-MIN-9901',
    name: currentWorker?.name || (lang === 'sat' ? 'ᱥᱳᱢᱨᱟ ᱢᱟᱨᱟᱱᱰᱤ (Somra Marandi)' : 'सोमरा मरांडी (Somra Marandi)'),
    mine: currentWorker?.colliery || 'BCCL Jharia Underground Seam 4',
    language: lang === 'sat' ? 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)' : lang === 'hi' ? 'Hindi (हिन्दी)' : 'English',
    casScore: 94,
    reactionTimeSec: 4.8,
    certHash: currentWorker?.vitals?.certHash || 'f49a8820c7104b901235ea19',
    dgmsOfficer: 'Er. R. K. Soren, Dhanbad',
    vitals: currentWorker?.vitals
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col font-sans">
      {/* Universal Header with Lang & Mode Switcher */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentWorker={currentWorker}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col items-center justify-center">
        {activeView === 'admin' ? (
          /* DGMS Mine Compliance Dashboard View */
          <AdminDashboard lang={lang} />
        ) : (
          /* Worker Flow: Step 1: Language -> Step 2: Login -> Step 3: AR Training */
          <div className="w-full flex flex-col items-center">
            {workerStep === 'language' && (
              <LanguageSelection 
                initialLang={lang}
                onSelectLanguage={handleLanguageSelect} 
              />
            )}

            {workerStep === 'login' && (
              <PitHeadLogin 
                lang={lang}
                onLoginSuccess={handleLoginSuccess}
                onBackToLanguage={handleBackToLanguage}
              />
            )}

            {workerStep === 'health' && (
              <HealthCheckup
                lang={lang}
                worker={currentWorker}
                onHealthCleared={handleHealthCleared}
                onBackToLogin={() => setWorkerStep('login')}
              />
            )}

            {workerStep === 'training' && (
              <div className="w-full max-w-lg flex flex-col items-center animate-fade-in">
                {/* Active Worker Status Ribbon with Health Clearance */}
                {currentWorker && (
                  <div className="w-full mb-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white truncate">{currentWorker.name}</span>
                      <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {currentWorker.id}
                      </span>
                      {currentWorker.vitals && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 hidden sm:inline">
                          ✓ SpO2 {currentWorker.vitals.spo2}% • {currentWorker.vitals.heartRate} BPM
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
                      title="लॉगआउट करें (Switch Miner)"
                    >
                      <LogOut className="w-3 h-3" />
                      <span className="hidden sm:inline">लॉगआउट</span>
                    </button>
                  </div>
                )}


                {/* Title / Guidance Banner */}
                <div className="text-center mb-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {t.tagline}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                    {t.modulesTitle}
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-0.5">
                    {t.subtitle}
                  </p>
                </div>

                {/* Module Selector Tabs */}
                {!showCertificate && (
                  <div className="grid grid-cols-2 gap-2 w-full mb-3">
                    {/* Module 1 Tab */}
                    <button
                      onClick={() => setSelectedModule(1)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        selectedModule === 1
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-[#101622] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedModule === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate">{t.module1Title}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {completedModules['MOD-01-FIRE'] ? '✓ Verified (96%)' : 'P-A-S-S Drill'}
                        </div>
                      </div>
                    </button>

                    {/* Module 2 Tab */}
                    <button
                      onClick={() => setSelectedModule(2)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        selectedModule === 2
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-[#101622] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedModule === 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Wind className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate">{t.module2Title}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {completedModules['MOD-02-GAS'] ? '✓ Verified (94%)' : 'CH₄ & SCSR'}
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Mobile AR Viewport or Certificate Display */}
                {showCertificate ? (
                  <CertificateCard 
                    workerData={workerCertificationData}
                    lang={lang}
                    onReset={handleResetTraining}
                  />
                ) : (
                  <div className="w-full flex flex-col items-center">
                    {/* Simulated Android Smartphone Container */}
                    <div className="w-full relative rounded-3xl p-1 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl">
                      {/* Smartphone Top Speaker Notch */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-950 rounded-full z-40" />

                      {/* AR Viewport Component */}
                      <ARCameraViewport
                        activeModule={selectedModule}
                        lang={lang}
                        soundEnabled={soundEnabled}
                        onModuleComplete={handleModuleComplete}
                        onNextModule={() => setSelectedModule(2)}
                        onViewCertificate={() => setShowCertificate(true)}
                      />
                    </div>

                    {/* Bottom Assessment Bar / Certification Unlock */}
                    <div className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-[#101622] border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-white">
                            {t.assessmentTitle}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {completedModules['MOD-01-FIRE'] && completedModules['MOD-02-GAS']
                              ? 'All Modules Verified (94% CAS)'
                              : 'Complete Fire & Gas drills to unlock'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowCertificate(true)}
                        className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md active:scale-95 transition"
                      >
                        {t.downloadCert} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Industrial Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#06080D] py-3 px-4 text-center text-[10px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KHAN-SURAKSHA AR • SIH 2026 PS ID: SIH26041</span>
          <span>COMPLIANCE: MINES ACT 1952 § 22A • FACTORIES ACT 1948</span>
          <span>OFFLINE CACHE: 100% EMBEDDED</span>
        </div>
      </footer>
    </div>
  );
}
