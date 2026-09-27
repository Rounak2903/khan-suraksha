import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Sparkles, AlertCircle } from 'lucide-react';
import Module1FirePass from './Module1FirePass';
import Module2GasConfined from './Module2GasConfined';

export default function ARCameraViewport({ activeModule, lang, soundEnabled, onModuleComplete, onNextModule, onViewCertificate }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Initialize phone/laptop camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Rear camera preferred on mobile
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera stream unavailable, switching to photorealistic simulation:', err);
      setCameraError('Camera access unavailable. Operating in high-fidelity simulated AR environment.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  useEffect(() => {
    // Attempt camera auto-start
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black shadow-2xl flex flex-col">
      {/* Background: Live Camera Stream or Simulated Mine Gallery */}
      {cameraActive ? (
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : (
        /* Photorealistic Simulated Underground Mine Shaft */
        <div className="absolute inset-0 w-full h-full bg-[#0a0f16] z-0 overflow-hidden">
          {/* Subtle industrial grid and lighting */}
          <div className="absolute inset-0 industrial-grid opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Virtual Mine Tunnel Silhouette */}
          <div className="absolute bottom-0 w-full h-44 bg-gradient-to-t from-[#06080d] to-transparent flex items-end justify-center pb-2 opacity-60">
            <span className="text-[10px] font-mono text-slate-500">
              SIMULATED GALLERY 4B • BOKARO SEAM
            </span>
          </div>
        </div>
      )}

      {/* AR Camera Toggle Header Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-full border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AR SPATIAL TRACKING ACTIVE</span>
        </div>

        <button
          onClick={cameraActive ? stopCamera : startCamera}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium transition backdrop-blur shadow-md"
        >
          {cameraActive ? (
            <>
              <CameraOff className="w-3 h-3 text-red-400" />
              <span>Disable Cam</span>
            </>
          ) : (
            <>
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>Enable Real Cam</span>
            </>
          )}
        </button>
      </div>

      {/* AR Module Layer Overlay */}
      <div className="relative z-10 w-full h-full p-2 pt-12 flex flex-col">
        {activeModule === 1 && (
          <Module1FirePass
            lang={lang}
            soundEnabled={soundEnabled}
            onModuleComplete={onModuleComplete}
            onNextModule={onNextModule}
          />
        )}
        {activeModule === 2 && (
          <Module2GasConfined
            lang={lang}
            soundEnabled={soundEnabled}
            onModuleComplete={onModuleComplete}
            onViewCertificate={onViewCertificate}
          />
        )}
      </div>
    </div>
  );
}
