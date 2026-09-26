// Speech Synthesizer for Hindi and Santali Audio Guidance
export const speakInstruction = (text, lang = 'hi') => {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for clear instruction
    utterance.pitch = 1.0;

    // Pick best available voice (Hindi or fallback)
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
    
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis warning:', err);
  }
};

// Play a short simulated industrial alert beep
export const playIndustrialBeep = (freq = 880, duration = 150) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration / 1000);
  } catch {
    // AudioContext not allowed before user gesture
  }
};
