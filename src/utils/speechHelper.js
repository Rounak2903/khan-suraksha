// Speech Synthesizer and Voice Recognition Helper for Khan-Suraksha AR
// Supports Trilingual: Hindi (hi-IN), English (en-IN/en-US), and Santali

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Speech cancellation warning:', err);
    }
  }
};

export const speakInstruction = (text, lang = 'hi', onEnd = null) => {
  if (!('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, 300);
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Slightly measured rate for industrial clarity
    utterance.pitch = 1.0;

    // Pick best available voice matching language
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'hi' || lang === 'sat') {
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
      if (hiVoice) utterance.voice = hiVoice;
    } else {
      const enVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis warning:', err);
    if (onEnd) onEnd();
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

// Keyword matcher for Voice Command Recognition (Yes / No)
export const parseVoiceAnswer = (transcript) => {
  if (!transcript) return null;
  const clean = transcript.toLowerCase().trim();

  // Affirmative / Yes keywords (English, Hindi transliteration & Devanagari, Santali)
  const yesRegex = /(haan|ha|haa|yes|yeah|yep|theek|thik|theek hai|sahi|bilkul|hoy|ho|ji haan|ji|one|ek|पक्का|हाँ|हा|ह|हां|ठीक|बिल्कुल|सही|ᱦᱚᱭ)/i;

  // Negative / No keywords (English, Hindi transliteration & Devanagari, Santali)
  const noRegex = /(nahi|nahin|na|no|nope|not|bang|kuch nahi|bilkul nahi|zero|two|do|नहीं|ना|नही|बिल्कुल नहीं|ᱵᱟᱝ)/i;

  if (yesRegex.test(clean)) {
    return { detected: 'yes', raw: transcript };
  }
  if (noRegex.test(clean)) {
    return { detected: 'no', raw: transcript };
  }

  return null;
};

// Safe Web Speech API SpeechRecognition wrapper
export const createSpeechRecognizer = ({ lang = 'hi', onResult, onError, onEnd }) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Set recognition language
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'sat' ? 'hi-IN' : 'en-IN';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const spokenText = finalTranscript || interimTranscript;
      const parsed = parseVoiceAnswer(spokenText);

      if (onResult) {
        onResult({
          text: spokenText,
          isFinal: Boolean(finalTranscript),
          parsed
        });
      }
    };

    recognition.onerror = (event) => {
      if (onError) onError(event);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    return recognition;
  } catch (err) {
    console.warn('SpeechRecognition initialization error:', err);
    return null;
  }
};
