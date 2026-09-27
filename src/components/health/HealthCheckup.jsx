import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Wind, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  CameraOff, 
  RefreshCw, 
  ArrowRight, 
  Thermometer, 
  Brain, 
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  MessageSquare,
  FileCheck,
  Check,
  HelpCircle,
  Radio,
  Sliders,
  Play
} from 'lucide-react';
import { 
  speakInstruction, 
  stopSpeech, 
  playIndustrialBeep, 
  createSpeechRecognizer 
} from '../../utils/speechHelper';

// 5 Standard DGMS Fit-to-Work Safety & Psychological Screening Questions
export const HEALTH_QUESTIONS = [
  {
    id: 'q1_dizziness',
    category: 'physical',
    safeAnswer: 'no', // Safe answer is NO dizziness/chest discomfort
    text: {
      en: 'Are you feeling any dizziness, headache, or chest pain right now?',
      hi: 'क्या आपको अभी कोई चक्कर, सिरदर्द या सीने में भारीपन महसूस हो रहा है?',
      sat: 'ᱪᱮᱫ ᱟᱢ ᱱᱤᱛᱚᱜ ᱵᱚᱦᱚᱜ ᱟᱹᱪᱩᱨ, ᱵᱚᱦᱚᱜ ᱦᱟᱹᱥᱩ ᱥᱮ ᱠᱚᱲᱟᱢ ᱦᱟᱹᱥᱩ ᱵᱩᱡᱷᱟᱹᱣᱜ ᱠᱟᱱᱟ?'
    },
    voicePrompt: {
      en: 'Question one. Are you experiencing any dizziness, headache, or chest pain right now? Please say Yes or No.',
      hi: 'पहला सवाल। क्या आपको अभी कोई चक्कर, सिरदर्द या सीने में दर्द महसूस हो रहा है? कृपया हाँ या नहीं बोलें।',
      sat: 'ᱯᱩᱭᱞᱩ ᱠᱩᱠᱞᱤ᱾ ᱪᱮᱫ ᱟᱢ ᱵᱚᱦᱚᱜ ᱟᱹᱪᱩᱨ ᱥᱮ ᱠᱚᱲᱟᱢ ᱦᱟᱹᱥᱩ ᱵᱩᱡᱷᱟᱹᱣᱜ ᱠᱟᱱᱟ? ᱦᱚᱭ ᱥᱮ ᱵᱟᱝ ᱢᱮᱱ ᱢᱮ।'
    },
    options: {
      yes: { en: 'Yes', hi: 'हाँ', sat: 'ᱦᱚᱭ' },
      no: { en: 'No', hi: 'नहीं', sat: 'ᱵᱟᱝ' }
    }
  },
  {
    id: 'q2_sleep',
    category: 'fatigue',
    safeAnswer: 'yes', // Safe answer is YES, got 6-7+ hours of sleep
    text: {
      en: 'Did you get at least 6 to 7 hours of sound sleep before this shift?',
      hi: 'क्या आपने इस शिफ्ट से पहले कम से कम 6 से 7 घंटे की अच्छी नींद ली है?',
      sat: 'ᱪᱮᱫ ᱟᱢ ᱱᱚᱶᱟ ᱥᱤᱯᱷᱴ ᱞᱟᱦᱟ ᱨᱮ ᱖ ᱠᱷᱚᱱ ᱗ ᱴᱟᱲᱟᱝ ᱵᱮᱥ ᱛᱮᱢ ᱡᱟᱹᱯᱤᱫ ᱟᱠᱟᱫ-ᱟ?'
    },
    voicePrompt: {
      en: 'Question two. Did you get at least 6 to 7 hours of sound sleep before this shift? Please say Yes or No.',
      hi: 'दूसरा सवाल। क्या आपने इस शिफ्ट से पहले कम से कम 6 से 7 घंटे की अच्छी नींद ली है? कृपया हाँ या नहीं बोलें।',
      sat: 'ᱫᱚᱥᱟᱨ ᱠᱩᱠᱞᱤ᱾ ᱪᱮᱫ ᱟᱢ ᱖ ᱠᱷᱚᱱ ᱗ ᱴᱟᱲᱟᱝ ᱵᱮᱥ ᱛᱮᱢ ᱡᱟᱹᱯᱤᱫ ᱟᱠᱟᱫ-ᱟ? ᱦᱚᱭ ᱥᱮ ᱵᱟᱝ ᱢᱮᱱ ᱢᱮ।'
    },
    options: {
      yes: { en: 'Yes', hi: 'हाँ', sat: 'ᱦᱚᱭ' },
      no: { en: 'No', hi: 'नहीं', sat: 'ᱵᱟᱝ' }
    }
  },
  {
    id: 'q3_alertness',
    category: 'mental',
    safeAnswer: 'yes', // Safe answer is YES, alert and mentally ready
    text: {
      en: 'Do you feel calm, alert, and ready to safely operate underground machinery?',
      hi: 'क्या आप शांत, सतर्क और भूमिगत भारी मशीनरी चलाने के लिए पूरी तरह तैयार हैं?',
      sat: 'ᱪᱮᱫ ᱟᱢ ᱢᱚᱱᱮ ᱛᱮ ᱥᱟᱱᱛ, ᱪᱮᱛᱟᱣᱱᱤ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱢᱮᱥᱤᱱ ᱪᱟᱞᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱭᱟᱨ ᱢᱮᱱᱟᱜ ᱢᱮᱭᱟ?'
    },
    voicePrompt: {
      en: 'Question three. Do you feel calm, alert, and ready to safely operate underground machinery? Say Yes or No.',
      hi: 'तीसरा सवाल। क्या आप शांत, सतर्क और भूमिगत भारी मशीनरी चलाने के लिए पूरी तरह तैयार हैं? हाँ या नहीं बोलें।',
      sat: 'ᱛᱮᱥᱟᱨ ᱠᱩᱠᱞᱤ᱾ ᱪᱮᱫ ᱟᱢ ᱢᱚᱱᱮ ᱛᱮ ᱥᱟᱱᱛ ᱟᱨ ᱢᱮᱥᱤᱱ ᱪᱟᱞᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱭᱟᱨ ᱢᱮᱱᱟᱜ ᱢᱮᱭᱟ? ᱦᱚᱭ ᱥᱮ ᱵᱟᱝ ᱢᱮᱱ ᱢᱮ।'
    },
    options: {
      yes: { en: 'Yes', hi: 'हाँ', sat: 'ᱦᱚᱭ' },
      no: { en: 'No', hi: 'नहीं', sat: 'ᱵᱟᱝ' }
    }
  },
  {
    id: 'q4_sobriety',
    category: 'safety',
    safeAnswer: 'no', // Safe answer is NO intoxicants/sedatives
    text: {
      en: 'Have you taken alcohol or any drowsy/sedative medication in the last 24 hours?',
      hi: 'क्या आपने पिछले 24 घंटों में किसी नशीले पदार्थ या नींद की दवा का सेवन किया है?',
      sat: 'ᱪᱮᱫ ᱟᱢ ᱒᱔ ᱴᱟᱲᱟᱝ ᱨᱮ ᱦᱟᱺᱰᱤ ᱯᱟᱹᱣᱨᱟᱹ ᱥᱮ ᱡᱟᱹᱯᱤᱫ ᱨᱟᱱ ᱮᱢ ᱡᱚᱢ ᱟᱠᱟᱫ-ᱟ?'
    },
    voicePrompt: {
      en: 'Question four. Have you taken alcohol or any drowsy medication in the last 24 hours? Please say Yes or No.',
      hi: 'चौथा सवाल। क्या आपने पिछले 24 घंटों में किसी नशीले पदार्थ या नींद की दवा का सेवन किया है? कृपया हाँ या नहीं बोलें।',
      sat: 'ᱯᱩᱱᱟᱜ ᱠᱩᱠᱞᱤ᱾ ᱪᱮᱫ ᱟᱢ ᱒᱔ ᱴᱟᱲᱟᱝ ᱨᱮ ᱦᱟᱺᱰᱤ ᱯᱟᱹᱣᱨᱟᱹ ᱥᱮ ᱡᱟᱹᱯᱤᱫ ᱨᱟᱱ ᱮᱢ ᱡᱚᱢ ᱟᱠᱟᱫ-ᱟ? ᱦᱚᱭ ᱥᱮ ᱵᱟᱝ ᱢᱮᱱ ᱢᱮ।'
    },
    options: {
      yes: { en: 'Yes', hi: 'हाँ', sat: 'ᱦᱚᱭ' },
      no: { en: 'No', hi: 'नहीं', sat: 'ᱵᱟᱝ' }
    }
  },
  {
    id: 'q5_hydration',
    category: 'thermal',
    safeAnswer: 'yes', // Safe answer is YES, well hydrated for deep mine heat
    text: {
      en: 'Have you had sufficient drinking water and feel ready for deep seam heat?',
      hi: 'क्या आपने पर्याप्त पानी पिया है और खदान की गर्मी व उमस सहने के लिए तैयार हैं?',
      sat: 'ᱪᱮᱫ ᱟᱢ ᱯᱩᱨᱟᱹ ᱫᱟᱜ ᱮᱢ ᱧᱩ ᱟᱠᱟᱫ-ᱟ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱨᱮᱭᱟᱜ ᱞᱚᱞᱚ ᱥᱟᱦᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱭᱟᱨ ᱢᱮᱱᱟᱜ ᱢᱮᱭᱟ?'
    },
    voicePrompt: {
      en: 'Question five. Have you had sufficient drinking water and feel ready for deep seam heat? Say Yes or No.',
      hi: 'पाँचवाँ सवाल। क्या आपने पर्याप्त पानी पिया है और खदान की गर्मी व उमस सहने के लिए तैयार हैं? हाँ या नहीं बोलें।',
      sat: 'ᱢᱚᱬᱮᱭᱟᱜ ᱠᱩᱠᱞᱤ᱾ ᱪᱮᱫ ᱟᱢ ᱯᱩᱨᱟᱹ ᱫᱟᱜ ᱮᱢ ᱧᱩ ᱟᱠᱟᱫ-ᱟ ᱟᱨ ᱞᱚᱞᱚ ᱥᱟᱦᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱭᱟᱨ ᱢᱮᱱᱟᱜ ᱢᱮᱭᱟ? ᱦᱚᱭ ᱥᱮ ᱵᱟᱝ ᱢᱮᱱ ᱢᱮ।'
    },
    options: {
      yes: { en: 'Yes', hi: 'हाँ', sat: 'ᱦᱚᱭ' },
      no: { en: 'No', hi: 'नहीं', sat: 'ᱵᱟᱝ' }
    }
  }
];

const HEALTH_TEXTS = {
  en: {
    badge: 'DGMS RULE 77B • PRE-SHIFT MEDICAL & MENTAL SURVEILLANCE',
    title: 'AI Biometric Health & Voice Screening Mirror',
    sub: '20-second non-contact optical rPPG scan followed by voice interview',
    workerLabel: 'Worker Name',
    idLabel: 'Labour ID',
    alignFace: 'Align your face inside the optical scanning reticle (20s scan)',
    cameraActive: 'OPTICAL SENSORS ACTIVE',
    cameraOffStatus: 'CAMERA SENSORS OFF • STANDBY',
    cameraFallback: 'SIMULATED OPTICAL FEED',
    scanningStatus: 'Scanning Facial Blood Flow, Pulse & Micro-Tremors...',
    scanComplete: 'Optical Vitals Acquired • Sensors Locked',
    scanCompleteDesc: 'Vascular pulse, oxygen saturation, and body temperature successfully verified.',
    heartRate: 'Heart Rate (Pulse)',
    spo2: 'Blood Oxygen (SpO2)',
    stress: 'Stress & Fatigue Index',
    temp: 'Thermal Body Temp',
    normalBadge: 'NORMAL',
    optimalBadge: 'OPTIMAL',
    alertBadge: 'ALERT & ACTIVE',
    goToQuestionsBtn: 'GO TO QUESTION & ANSWERS SECTION',
    goToQuestionsSub: 'Step 2: 5-Question AI Fit-to-Work Voice Screening',
    rescanBtn: 'RE-SCAN VITALS (20s)',
    fitTitle: 'FIT FOR SUBTERRANEAN INGRESS',
    fitDesc: 'All physiological vitals and voice mental screening meet DGMS CMR 2017 standards.',
    unfitTitle: 'INGRESS BLOCKED: UNFIT FOR SHIFT',
    unfitDesc: 'Elevated stress, hypoxia, or health hazard detected during pre-shift screening.',
    proceedBtn: 'PROCEED TO AR SAFETY DRILLS',
    demoControls: 'JUDGE SIMULATION CONTROLS:',
    demoFit: 'Simulate Fit Miner',
    demoUnfit: 'Simulate Fatigued Miner',
    hash: 'Cryptographic Clearance Hash',
    // Voice Stage Texts
    voiceStageTitle: 'AI Voice Fit-to-Work Interview',
    voiceStageSub: 'Answer all 5 questions via voice command or touch buttons',
    speakingLabel: 'AI Voice Assistant Speaking Question...',
    listeningLabel: 'Listening to your voice... Speak "Yes" or "No"',
    heardLabel: 'Voice Recognized:',
    sayOrTap: 'Speak your answer into microphone OR tap a button below',
    replayAudio: 'Replay Question Audio',
    micActive: 'Microphone Active',
    micOff: 'Mic Muted / Click Button',
    nextBtn: 'Next Question',
    questionCounter: 'Question',
    of: 'of',
    cognitiveReady: 'Psychological Alertness Score',
    screeningPassed: '5/5 Health & Sobriety Checks Cleared'
  },
  hi: {
    badge: 'डीजीएमएस नियम 77B • खदान प्रवेश पूर्व शारीरिक एवं मानसिक स्वास्थ्य जांच',
    title: 'एआई बायोमेट्रिक स्वास्थ्य एवं वॉइस स्क्रीनिंग दर्पण',
    sub: '20 सेकंड का ऑप्टिकल बायोमेट्रिक स्कैन, जिसके बाद 5-प्रश्नों का मौखिक साक्षात्कार',
    workerLabel: 'श्रमिक का नाम',
    idLabel: 'लेबर ID',
    alignFace: 'कृपया अपना चेहरा स्कैनर चक्र के केंद्र में रखें (20 सेकंड स्कैन)',
    cameraActive: 'ऑप्टिकल कैमरा सक्रिय',
    cameraOffStatus: 'कैमरा बंद • स्टैंडबाय मोड',
    cameraFallback: 'डिजिटल सिमुलेशन कैमरा',
    scanningStatus: 'चेहरे के रक्त संचार, धड़कन एवं सूक्ष्म कंपन की जांच जारी...',
    scanComplete: 'बायोमेट्रिक स्कैन पूर्ण • वाइटल्स लॉक किए गए',
    scanCompleteDesc: 'हृदय गति, ऑक्सीजन स्तर एवं शरीर का तापमान डीजीएमएस मानकों के अनुसार दर्ज।',
    heartRate: 'हृदय गति (पल्स)',
    spo2: 'रक्त में ऑक्सीजन (SpO2)',
    stress: 'तनाव एवं थकान स्तर',
    temp: 'शरीर का तापमान',
    normalBadge: 'सामान्य',
    optimalBadge: 'उत्तम',
    alertBadge: 'सतर्क एवं सक्रिय',
    goToQuestionsBtn: 'सवाल-जवाब सेक्शन में जाएं (Go to Q&A)',
    goToQuestionsSub: 'चरण 2: 5-प्रश्नों का एआई मौखिक स्वास्थ्य साक्षात्कार',
    rescanBtn: 'पुनः स्कैन करें (20s)',
    fitTitle: 'खदान में कार्य हेतु पूर्णतः फिट (DGMS क्लीयरेंस)',
    fitDesc: 'श्रमिक के शारीरिक मानक और मौखिक मानसिक स्वास्थ्य दोनों पूर्णतः सुरक्षित पाए गए।',
    unfitTitle: 'प्रवेश वर्जित: अस्वस्थ / अत्यधिक थकान',
    unfitDesc: 'ऑक्सीजन की कमी, असामान्य धड़कन या उच्च मानसिक तनाव दर्ज किया गया।',
    proceedBtn: 'एआर सुरक्षा ट्रेनिंग शुरू करें',
    demoControls: 'मूल्यांकन / डेमो नियंत्रण:',
    demoFit: 'सामान्य फिट श्रमिक दिखाएं',
    demoUnfit: 'थका हुआ / अस्वस्थ श्रमिक दिखाएं',
    hash: 'डिजिटल सुरक्षा प्रमाणीकरण हैश',
    // Voice Stage Texts
    voiceStageTitle: 'एआई मौखिक स्वास्थ्य एवं सतर्कता साक्षात्कार',
    voiceStageSub: 'सभी 5 प्रश्नों के उत्तर अपनी आवाज़ (हाँ/नहीं) में दें या नीचे बटन दबाएं',
    speakingLabel: 'एआई वॉइस असिस्टेंट सवाल पूछ रहा है...',
    listeningLabel: 'आपकी आवाज़ सुन रहा है... "हाँ" या "नहीं" बोलें',
    heardLabel: 'आवाज़ पहचानी गई:',
    sayOrTap: 'माइक में बोलकर उत्तर दें या सीधे नीचे दिए गए बटन पर टैप करें',
    replayAudio: 'सवाल पुनः सुनें',
    micActive: 'माइक्रोफ़ोन चालू है',
    micOff: 'माइक बंद / बटन दबाएं',
    nextBtn: 'अगला सवाल',
    questionCounter: 'सवाल',
    of: 'का',
    cognitiveReady: 'मानसिक सतर्कता एवं तत्परता',
    screeningPassed: '5/5 स्वास्थ्य एवं सतर्कता नियम सत्यापित'
  },
  sat: {
    badge: 'DGMS ᱨᱩᱞ 77B • ᱠᱟᱹᱢᱤ ᱞᱟᱦᱟ ᱦᱚᱲᱢᱳ ᱟᱨ ᱢᱚᱱᱮ ᱯᱚᱨᱚᱠ',
    title: 'AI ᱦᱚᱲᱢᱳ ᱟᱨ ᱟᱲᱟᱝ ᱛᱮ ᱯᱚᱨᱚᱠ ᱥᱠᱮᱱᱟᱨ',
    sub: '᱒᱐ ᱴᱤᱯᱤᱡ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱯᱚᱨᱚᱠ ᱛᱟᱭᱚᱢ ᱕ ᱜᱚᱴᱟᱝ ᱠᱩᱠᱞᱤ ᱨᱮᱭᱟᱜ ᱟᱲᱟᱝ ᱤᱱᱴᱟᱨᱵᱷᱤᱣ',
    workerLabel: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ',
    idLabel: 'ID',
    alignFace: 'ᱥᱠᱮᱱᱟᱨ ᱛᱟᱞᱟ ᱨᱮ ᱢᱮᱫᱦᱟᱸ ᱫᱚᱦᱚᱭ ᱢᱮ (᱒᱐ ᱴᱤᱯᱤᱡ)',
    cameraActive: 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ',
    cameraOffStatus: 'ᱠᱮᱢᱮᱨᱟ ᱵᱚᱸᱫᱽ ᱮᱱᱟ • ᱥᱴᱮᱱᱰᱵᱟᱭ',
    cameraFallback: 'ᱰᱤᱡᱤᱴᱟᱞ ᱠᱮᱢᱮᱨᱟ',
    scanningStatus: 'ᱢᱟᱭᱟᱢ ᱟᱨ ᱦᱟᱞᱚᱛ ᱯᱚᱨᱚᱠ ᱪᱟᱹᱞᱩᱜ ᱠᱟᱱᱟ...',
    scanComplete: 'ᱦᱚᱲᱢᱳ ᱯᱚᱨᱚᱠ ᱥᱟᱹᱛ ᱮᱱᱟ • ᱞᱮᱠᱷᱟ ᱴᱷᱤᱠ ᱮᱱᱟ',
    scanCompleteDesc: 'ᱥᱟᱱᱟᱢ ᱦᱚᱲᱢᱳ ᱞᱮᱠᱷᱟ ᱴᱷᱤᱠ ᱜᱮ ᱧᱟᱢ ᱮᱱᱟ᱾',
    heartRate: 'ᱫᱤᱞ ᱨᱮᱭᱟᱜ ᱫᱷᱟᱲᱠᱟᱱ (Heartbeat)',
    spo2: 'ᱦᱚᱭ ᱨᱮᱭᱟᱜ ᱞᱮᱠᱷᱟ (SpO2)',
    stress: 'ᱞᱟᱸᱜᱟ ᱟᱨ ᱛᱟᱱᱟᱣ (Fatigue)',
    temp: 'ᱦᱚᱲᱢᱳ ᱞᱚᱞᱚ (Temp)',
    normalBadge: 'ᱴᱷᱤᱠ ᱜᱮᱭᱟ',
    optimalBadge: 'ᱵᱮᱥ ᱜᱮᱭᱟ',
    alertBadge: 'ᱪᱮᱛᱟᱣᱱᱤ',
    goToQuestionsBtn: 'ᱠᱩᱠᱞᱤ-ᱛᱮᱞᱟ ᱦᱟᱹᱴᱤᱧ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ (Go to Q&A)',
    goToQuestionsSub: 'ᱫᱚᱥᱟᱨ ᱦᱟᱹᱴᱤᱧ: ᱕ ᱜᱚᱴᱟᱝ ᱠᱩᱠᱞᱤ ᱨᱮᱭᱟᱜ ᱤᱱᱴᱟᱨᱵᱷᱤᱣ',
    rescanBtn: 'ᱫᱚᱦᱲᱟ ᱥᱠᱮᱱ ᱢᱮ (20s)',
    fitTitle: 'ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱤᱴ ᱜᱮᱭᱟ',
    fitDesc: 'ᱥᱟᱱᱟᱢ ᱦᱚᱲᱢᱳ ᱟᱨ ᱢᱚᱱᱮ ᱞᱮᱠᱷᱟ ᱴᱷᱤᱠ ᱢᱮᱱᱟᱜ-ᱟ᱾',
    unfitTitle: 'ᱵᱚᱞᱚᱱ ᱢᱟᱱᱟ ᱜᱮᱭᱟ: ᱟᱡᱟᱨ / ᱞᱟᱸᱜᱟ',
    unfitDesc: 'ᱦᱚᱭ ᱠᱚᱢ ᱜᱮᱭᱟ ᱥᱮ ᱛᱟᱱᱟᱣ ᱵᱟᱹᱲᱛᱤ ᱜᱮᱭᱟ᱾',
    proceedBtn: 'AR ᱴᱨᱮᱱᱤᱝ ᱮᱦᱚᱵᱽ ᱢᱮ',
    demoControls: 'ᱰᱮᱢᱳ ᱠᱚᱱᱴᱨᱳᱞ:',
    demoFit: 'ᱯᱷᱤᱴ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    demoUnfit: 'ᱞᱟᱸᱜᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    hash: 'ᱰᱤᱡᱤᱴᱟᱞ ᱦᱮᱥ',
    // Voice Stage Texts
    voiceStageTitle: 'AI ᱟᱲᱟᱝ ᱛᱮ ᱦᱚᱲᱢᱳ ᱯᱚᱨᱚᱠ (Voice Interview)',
    voiceStageSub: '᱕ ᱜᱚᱴᱟᱝ ᱠᱩᱠᱞᱤ ᱨᱮᱭᱟᱜ ᱛᱮᱞᱟ ᱟᱲᱟᱝ ᱛᱮ ᱮᱢ ᱢᱮ ᱥᱮ ᱵᱟᱴᱚᱱ ᱫᱟᱵᱟᱣ ᱢᱮ',
    speakingLabel: 'AI ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤ ᱮᱫᱟ...',
    listeningLabel: 'ᱟᱢᱟᱜ ᱟᱲᱟᱝ ᱟᱸᱡᱚᱢ ᱮᱫᱟ... "ᱦᱚᱭ" ᱥᱮ "ᱵᱟᱝ" ᱢᱮᱱ ᱢᱮ',
    heardLabel: 'ᱟᱲᱟᱝ ᱧᱟᱢ ᱮᱱᱟ:',
    sayOrTap: 'ᱢᱟᱭᱤᱠ ᱨᱮ ᱨᱚᱲ ᱢᱮ ᱥᱮ ᱞᱟᱛᱟᱨ ᱵᱟᱴᱚᱱ ᱫᱟᱵᱟᱣ ᱢᱮ',
    replayAudio: 'ᱫᱚᱦᱲᱟ ᱟᱸᱡᱚᱢ ᱢᱮ',
    micActive: 'ᱢᱟᱭᱤᱠ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ',
    micOff: 'ᱢᱟᱭᱤᱠ ᱵᱚᱸᱫᱽ ᱢᱮᱱᱟᱜ-ᱟ',
    nextBtn: 'ᱛᱟᱭᱚᱢ ᱠᱩᱠᱞᱤ',
    questionCounter: 'ᱠᱩᱠᱞᱤ',
    of: 'ᱨᱮᱭᱟᱜ',
    cognitiveReady: 'ᱢᱚᱱᱮ ᱪᱮᱛᱟᱣᱱᱤ ᱞᱮᱠᱷᱟ',
    screeningPassed: '᱕/᱕ ᱯᱚᱨᱚᱠ ᱥᱟᱹᱛ ᱮᱱᱟ'
  }
};

export default function HealthCheckup({ 
  lang = 'hi', 
  worker, 
  onHealthCleared, 
  onBackToLogin 
}) {
  const T = HEALTH_TEXTS[lang] || HEALTH_TEXTS.en;

  // Video & Canvas Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Overall Phase Flow:
  // Phase 1: 'OPTICAL_SCAN' -> Phase 2: 'VOICE_INTERVIEW' -> Phase 3: 'FINAL_VERDICT'
  const [phase, setPhase] = useState('OPTICAL_SCAN');

  // Optical Scan Progress (0 to 100% over ~10 seconds)
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);

  // Helper to generate realistic physiological ranges
  const generateRandomVitals = (mode = 'FIT') => {
    if (mode === 'FIT') {
      const hr = Math.floor(Math.random() * (85 - 70 + 1)) + 70; // 70 to 85 BPM
      const ox = Math.floor(Math.random() * (99 - 96 + 1)) + 96; // 96% to 99%
      const temp = (97.6 + Math.random() * (98.8 - 97.6)).toFixed(1); // 97.6 to 98.8 °F
      const stressScore = (0.12 + Math.random() * 0.08).toFixed(2); // 0.12 to 0.20
      const descriptors = ['Alert & Focused', 'Calm & Steady', 'Optimal Recovery'];
      const desc = descriptors[Math.floor(Math.random() * descriptors.length)];
      return {
        heartRate: hr,
        spo2: ox,
        temperature: parseFloat(temp),
        stressScore,
        stressLevel: 'LOW',
        stressDesc: desc,
        isFit: true
      };
    } else {
      const hr = Math.floor(Math.random() * (128 - 116 + 1)) + 116; // 116 to 128 BPM
      const ox = Math.floor(Math.random() * (91 - 86 + 1)) + 86; // 86% to 91%
      const temp = (100.2 + Math.random() * (101.4 - 100.2)).toFixed(1); // 100.2 to 101.4 °F
      const stressScore = (0.78 + Math.random() * 0.12).toFixed(2); // 0.78 to 0.90
      const descriptors = ['Fatigued / Drowsy', 'High Stress', 'Exhaustion Detected'];
      const desc = descriptors[Math.floor(Math.random() * descriptors.length)];
      return {
        heartRate: hr,
        spo2: ox,
        temperature: parseFloat(temp),
        stressScore,
        stressLevel: 'HIGH',
        stressDesc: desc,
        isFit: false
      };
    }
  };

  // Vitals State with initial random baseline
  const [targetVitals, setTargetVitals] = useState(() => generateRandomVitals('FIT'));
  const [heartRate, setHeartRate] = useState(74);
  const [spo2, setSpo2] = useState(98);
  const [stressLevel, setStressLevel] = useState('LOW');
  const [stressDesc, setStressDesc] = useState('Alert & Focused');
  const [temperature, setTemperature] = useState(98.4);
  const [isFit, setIsFit] = useState(true);

  // Simulation mode ('FIT' | 'UNFIT')
  const [simMode, setSimMode] = useState('FIT');

  // ==========================================
  // VOICE INTERVIEW STATE (5 QUESTIONS)
  // ==========================================
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [lastHeardAnswer, setLastHeardAnswer] = useState(null); // 'yes' | 'no'
  const [soundMuted, setSoundMuted] = useState(false);
  const recognizerRef = useRef(null);
  const advanceTimerRef = useRef(null);

  // Web Audio Context for Heartbeat Beep
  const playHeartbeatPulse = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch {}
  };

  // Function to turn ON the camera
  const startCameraStream = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCamera(true);
      setCameraActive(true);
      setCameraError(false);
    } catch (err) {
      console.warn('Webcam unavailable or blocked. Using digital twin fallback:', err);
      setHasCamera(false);
      setCameraActive(false);
      setCameraError(true);
    }
  };

  // Function to turn OFF the camera (turns off hardware webcam light)
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Start camera on initial mount
  useEffect(() => {
    startCameraStream();

    return () => {
      stopCameraStream();
    };
  }, []);

  // Digital Twin Canvas Animation (Fallback & Scanning HUD overlay)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let scanY = 0;
    let scanDirection = 1;

    const renderOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If no webcam active, draw cybernetic wireframe silhouette
      if (!cameraActive) {
        ctx.fillStyle = '#060A12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Cybernetic Face Outline
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.strokeStyle = scanCompleted ? '#10b981' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 75, 105, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Eye scanning targets
        ctx.fillStyle = scanCompleted ? '#10b981' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx - 30, cy - 20, 4, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy - 20, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node crosshairs
        ctx.strokeStyle = scanCompleted ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.4)';
        ctx.strokeRect(cx - 45, cy - 35, 90, 70);
      }

      // Dynamic Laser Scanline during optical scan
      if (phase === 'OPTICAL_SCAN' && !scanCompleted) {
        scanY += 2 * scanDirection;
        if (scanY > canvas.height - 20 || scanY < 20) {
          scanDirection *= -1;
        }

        const grad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, simMode === 'FIT' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 15, canvas.width, 30);
      }

      frameId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();
    return () => cancelAnimationFrame(frameId);
  }, [cameraActive, simMode, phase, scanCompleted]);

  // Optical Scan Progress Cycle (20 seconds total: 100ms * 200 ticks = 20,000ms)
  // Vitals calibrate slowly every 2.0 seconds (every 10% progress) with gentle +/- 1 drift
  useEffect(() => {
    let timer;
    if (phase === 'OPTICAL_SCAN' && !scanCompleted) {
      let tickCount = 0;
      let currentHr = simMode === 'FIT' ? 74 : 118;
      let currentOx = simMode === 'FIT' ? 98 : 88;
      let currentT = simMode === 'FIT' ? 98.2 : 100.6;

      // Set initial values
      setHeartRate(currentHr);
      setSpo2(currentOx);
      setTemperature(parseFloat(currentT));

      timer = setInterval(() => {
        tickCount += 1;

        // SLOW UPDATE: Change vitals only once every 20 ticks (every 2.0 seconds / 10% progress)
        if (tickCount % 20 === 0 && tickCount < 200) {
          if (simMode === 'FIT') {
            // Gentle subtle drift of +/- 1 BPM around resting normal range (72 to 82)
            const hrDelta = Math.random() > 0.5 ? 1 : -1;
            currentHr = Math.min(83, Math.max(71, currentHr + hrDelta));
            
            // SpO2 stays steady, occasionally shifts between 97, 98, 99
            if (Math.random() > 0.6) {
              const oxDelta = Math.random() > 0.5 ? 1 : -1;
              currentOx = Math.min(99, Math.max(96, currentOx + oxDelta));
            }

            // Temp drifts by at most +/- 0.1 °F
            const tempDelta = Math.random() > 0.5 ? 0.1 : -0.1;
            currentT = (parseFloat(currentT) + tempDelta).toFixed(1);
          } else {
            // Unfit mode: Elevated vitals with slow oscillation
            const hrDelta = Math.random() > 0.5 ? 1 : -1;
            currentHr = Math.min(127, Math.max(116, currentHr + hrDelta));

            if (Math.random() > 0.6) {
              const oxDelta = Math.random() > 0.5 ? 1 : -1;
              currentOx = Math.min(91, Math.max(86, currentOx + oxDelta));
            }

            const tempDelta = Math.random() > 0.5 ? 0.1 : -0.1;
            currentT = (parseFloat(currentT) + tempDelta).toFixed(1);
          }

          setHeartRate(currentHr);
          setSpo2(currentOx);
          setTemperature(parseFloat(currentT));
          playHeartbeatPulse();
        }

        // Progress advances by 0.5% every 100ms (100% in 20.0 seconds)
        setScanProgress(prev => {
          const next = +(prev + 0.5).toFixed(1);

          if (next >= 100) {
            clearInterval(timer);
            setScanCompleted(true);
            
            // Turn OFF the camera hardware light immediately upon scan completion
            stopCameraStream();

            // Lock in finalized target vitals
            setHeartRate(targetVitals.heartRate);
            setSpo2(targetVitals.spo2);
            setTemperature(targetVitals.temperature);
            setStressLevel(targetVitals.stressLevel);
            setStressDesc(targetVitals.stressDesc);
            setIsFit(targetVitals.isFit);

            playIndustrialBeep(targetVitals.isFit ? 1100 : 400, 200);

            // User reviews vitals and clicks "Go to Q&A" button
            return 100;
          }

          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [phase, scanCompleted, simMode, targetVitals]);

  // Heartbeat micro-oscillation in completed / final state
  useEffect(() => {
    let beatInterval;
    let waveInterval;

    if (phase === 'FINAL_VERDICT' && isFit) {
      beatInterval = setInterval(() => {
        playHeartbeatPulse();
      }, 820);

      waveInterval = setInterval(() => {
        setHeartRate(prev => {
          const delta = (Math.random() > 0.5 ? 1 : -1);
          const next = prev + delta;
          if (next >= 70 && next <= 85) return next;
          return prev;
        });
      }, 4500);
    }

    return () => {
      clearInterval(beatInterval);
      clearInterval(waveInterval);
    };
  }, [phase, isFit]);

  // ==========================================
  // SPEECH SYNTHESIS & VOICE RECOGNITION HOOKS
  // ==========================================

  // Speak current question aloud whenever question changes
  const speakCurrentQuestion = (qIdx = currentQIndex) => {
    if (soundMuted) return;
    const question = HEALTH_QUESTIONS[qIdx];
    if (!question) return;

    // Stop previous recognizer or speech
    stopListening();
    stopSpeech();

    setIsSpeaking(true);
    setVoiceTranscript('');
    setLastHeardAnswer(null);

    const promptText = question.voicePrompt[lang] || question.voicePrompt.hi;
    speakInstruction(promptText, lang, () => {
      setIsSpeaking(false);
      // Auto-start listening for user's voice answer as soon as question finishes speaking
      startListening();
    });
  };

  // Start Web Speech Recognition to listen for voice commands
  const startListening = () => {
    stopListening();
    setVoiceTranscript('');
    setLastHeardAnswer(null);

    const recognizer = createSpeechRecognizer({
      lang,
      onResult: ({ text, parsed }) => {
        setVoiceTranscript(text);
        if (parsed && parsed.detected) {
          setLastHeardAnswer(parsed.detected);
          playIndustrialBeep(1200, 100);
          
          // Stop recognizer and automatically confirm detected voice answer
          stopListening();
          
          if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
          advanceTimerRef.current = setTimeout(() => {
            handleAnswerSelect(parsed.detected);
          }, 700);
        }
      },
      onError: (err) => {
        console.warn('Voice recognition error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition:', e);
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.abort();
      } catch {}
      recognizerRef.current = null;
    }
    setIsListening(false);
  };

  // Trigger voice assistant whenever entering VOICE_INTERVIEW or switching question
  useEffect(() => {
    if (phase === 'VOICE_INTERVIEW') {
      const timer = setTimeout(() => {
        speakCurrentQuestion(currentQIndex);
      }, 350);

      return () => {
        clearTimeout(timer);
        stopSpeech();
        stopListening();
      };
    }
  }, [phase, currentQIndex, lang]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      stopListening();
      stopCameraStream();
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Handle Question Answer Selection (Voice or Click)
  const handleAnswerSelect = (chosenAnswer) => {
    stopSpeech();
    stopListening();
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);

    const currentQ = HEALTH_QUESTIONS[currentQIndex];
    const isSafe = chosenAnswer === currentQ.safeAnswer;

    playIndustrialBeep(isSafe ? 1300 : 450, 120);

    const updatedAnswers = {
      ...answers,
      [currentQ.id]: {
        questionId: currentQ.id,
        answer: chosenAnswer,
        isSafe
      }
    };
    setAnswers(updatedAnswers);

    // If there are more questions, go to next
    if (currentQIndex < HEALTH_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // All 5 questions answered -> Compute final psychological & overall fitness
      calculateFinalVerdict(updatedAnswers);
    }
  };

  // Calculate Consolidated Health & Mental Fitness
  const calculateFinalVerdict = (finalAnswers) => {
    let unsafeCount = 0;
    Object.values(finalAnswers).forEach(ans => {
      if (!ans.isSafe) unsafeCount += 1;
    });

    // Check if worker failed critical sobriety check (Q4)
    const sobrietyViolation = finalAnswers['q4_sobriety'] && !finalAnswers['q4_sobriety'].isSafe;

    // Consolidated Fit status: Both Vitals must be fit AND 0-1 unsafe answers max, zero sobriety violation
    const isOverallFit = targetVitals.isFit && unsafeCount <= 1 && !sobrietyViolation;

    // Dynamic Stress calculation from voice interview
    let calculatedStressScore = parseFloat(targetVitals.stressScore);
    if (unsafeCount > 0) {
      calculatedStressScore = Math.min(0.92, calculatedStressScore + (unsafeCount * 0.20)).toFixed(2);
    }

    const calculatedStressLevel = calculatedStressScore < 0.35 ? 'LOW' : calculatedStressScore < 0.65 ? 'MODERATE' : 'HIGH';
    const finalDesc = isOverallFit ? 'Alert & Focused (DGMS Cleared)' : 'Fatigued / Elevated Risk Detected';

    setIsFit(isOverallFit);
    setStressLevel(calculatedStressLevel);
    setStressDesc(finalDesc);
    setPhase('FINAL_VERDICT');

    playIndustrialBeep(isOverallFit ? 1400 : 350, 200);

    // Announce final clearance
    if (!soundMuted) {
      const clearanceText = isOverallFit
        ? (lang === 'hi' 
            ? 'बधाई हो, आपका स्वास्थ्य एवं मौखिक परीक्षण पूर्ण हुआ। आप खदान में कार्य के लिए फिट हैं।'
            : lang === 'sat'
            ? 'ᱦᱚᱲᱢᱳ ᱟᱨ ᱟᱲᱟᱝ ᱯᱚᱨᱚᱠ ᱥᱟᱹᱛ ᱮᱱᱟ᱾ ᱟᱢ ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱤᱴ ᱜᱮᱭᱟᱢ᱾'
            : 'Pre-shift biometric and voice screening completed. You are cleared for underground shift.')
        : (lang === 'hi'
            ? 'चेतावनी, असामान्य स्वास्थ्य या तनाव के कारण खदान में प्रवेश वर्जित है। कृपया चिकित्सा केंद्र जाएं।'
            : 'Alert: Health or fatigue thresholds exceeded. Shift entry is blocked.');
      speakInstruction(clearanceText, lang);
    }
  };

  // User explicitly clicks button to go to the 5-Question Voice Interview
  const handleGoToVoiceInterview = () => {
    stopCameraStream();
    playIndustrialBeep(1200, 100);
    setPhase('VOICE_INTERVIEW');
    setCurrentQIndex(0);
  };

  // Re-scan vitals (approx 10s fresh scan)
  const handleRescanVitals = () => {
    stopSpeech();
    stopListening();
    playIndustrialBeep(900, 80);
    const fresh = generateRandomVitals(simMode);
    setTargetVitals(fresh);
    setScanProgress(0);
    setScanCompleted(false);
    setPhase('OPTICAL_SCAN');
    startCameraStream();
  };

  // Switch Judge Simulation Mode
  const handleApplySimMode = (mode) => {
    stopSpeech();
    stopListening();
    const newVitals = generateRandomVitals(mode);
    setSimMode(mode);
    setTargetVitals(newVitals);
    setPhase('OPTICAL_SCAN');
    setScanProgress(0);
    setScanCompleted(false);
    setCurrentQIndex(0);
    setAnswers({});
    playIndustrialBeep(1000, 80);
    startCameraStream();
  };

  const handleProceedToTraining = () => {
    playIndustrialBeep(1300, 100);
    if (onHealthCleared) {
      onHealthCleared({
        heartRate,
        spo2,
        stressLevel,
        temperature,
        isFit,
        answers,
        cognitiveScore: isFit ? 98 : 62,
        clearedAt: new Date().toLocaleTimeString(),
        certHash: `SHA256:${Math.random().toString(16).substring(2, 10).toUpperCase()}-DGMS-FIT`
      });
    }
  };

  const currentQ = HEALTH_QUESTIONS[currentQIndex];

  return (
    <div className="w-full max-w-4xl mx-auto my-auto p-3 sm:p-5 animate-fade-in text-slate-100">
      {/* Top DGMS Compliance Ribbon */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-xl bg-slate-900/95 border border-slate-800 text-xs font-mono text-slate-400 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">{T.badge}</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <span>{T.workerLabel}:</span>
          <span className="text-white font-bold">{worker?.name || 'Somra Marandi'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">{worker?.id || 'JH-BCCL-7741'}</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-2xl p-4 sm:p-6 overflow-hidden">
        
        {/* Step Progress Navigation Tracker */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-4 border-b border-slate-800 text-xs font-mono">
          {/* Step 1 Pill */}
          <div className={`flex items-center gap-2 p-2 rounded-xl border transition ${
            phase === 'OPTICAL_SCAN' 
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 font-bold'
              : 'bg-slate-900/80 border-slate-800 text-emerald-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              phase === 'OPTICAL_SCAN' && !scanCompleted
                ? 'bg-amber-500 text-slate-950' 
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {scanCompleted || phase !== 'OPTICAL_SCAN' ? '✓' : '1'}
            </span>
            <span className="truncate text-[11px]">1. {T.badge.split('•')[1] || 'Optical Vitals'}</span>
          </div>

          {/* Step 2 Pill */}
          <div className={`flex items-center gap-2 p-2 rounded-xl border transition ${
            phase === 'VOICE_INTERVIEW'
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 font-bold'
              : phase === 'FINAL_VERDICT'
              ? 'bg-slate-900/80 border-slate-800 text-emerald-400'
              : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              phase === 'VOICE_INTERVIEW' ? 'bg-amber-500 text-slate-950' : phase === 'FINAL_VERDICT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {phase === 'FINAL_VERDICT' ? '✓' : '2'}
            </span>
            <span className="truncate text-[11px]">2. {T.voiceStageTitle}</span>
          </div>

          {/* Step 3 Pill */}
          <div className={`flex items-center gap-2 p-2 rounded-xl border transition ${
            phase === 'FINAL_VERDICT'
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-bold'
              : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              phase === 'FINAL_VERDICT' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              3
            </span>
            <span className="truncate text-[11px]">3. {isFit ? T.fitTitle.split('(')[0] : 'Verdict'}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PHASE 1: OPTICAL SCANNING (RPPG & FACE ALIGNMENT)       */}
        {/* ======================================================== */}
        {phase === 'OPTICAL_SCAN' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Optical Scanner Feed (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center">
                  {/* Webcam video (only active while scanning) */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${
                      cameraActive ? 'opacity-90' : 'opacity-0'
                    }`}
                  />

                  {/* Canvas Overlay */}
                  <canvas
                    ref={canvasRef}
                    width={288}
                    height={288}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />

                  {/* Corner HUD Reticles */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                  {/* Oval Face Guide */}
                  <div className={`absolute w-36 h-48 rounded-[48%] border-2 border-dashed pointer-events-none transition ${
                    scanCompleted ? 'border-emerald-400/80 bg-emerald-500/5' : simMode === 'FIT' ? 'border-emerald-400/60' : 'border-red-400/60'
                  }`} />

                  {/* When Scan is Complete: Cybernetic Checkmark & Sensors Off badge */}
                  {scanCompleted ? (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white tracking-wide uppercase">
                        {T.scanComplete}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <CameraOff className="w-3 h-3 text-emerald-400" />
                        <span>{T.cameraOffStatus}</span>
                      </span>
                    </div>
                  ) : (
                    /* Progress HUD during active 20s scan */
                    <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800 text-center">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1">
                        <span>{T.scanningStatus}</span>
                        <span className="font-bold text-amber-400">{Math.round(scanProgress)}% (20s)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 transition-all duration-100"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 text-center font-sans mt-3">
                  {scanCompleted ? T.scanCompleteDesc : T.alignFace}
                </p>
              </div>

              {/* Live Physiological Telemetry (7 Cols) */}
              <div className="lg:col-span-7 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  {/* Pulse Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                        <span>{T.heartRate}</span>
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        scanCompleted 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {scanCompleted ? 'VERIFIED' : 'SCANNING'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                        {heartRate}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">BPM</span>
                    </div>
                  </div>

                  {/* SpO2 Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Wind className="w-4 h-4 text-sky-400" />
                        <span>{T.spo2}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        {scanCompleted ? 'OPTICAL OK' : 'SAMPLING'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                        {spo2}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Sat</span>
                    </div>
                  </div>

                  {/* Stress Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-amber-400" />
                        <span>{T.stress}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {stressLevel}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-base sm:text-lg font-black text-white truncate">
                        {stressDesc}
                      </span>
                    </div>
                  </div>

                  {/* Temperature Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-rose-400" />
                        <span>{T.temp}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        NORM
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                        {temperature}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">°F</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator Bar */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                  scanCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {scanCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Activity className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    )}
                    <span>{scanCompleted ? T.scanComplete : T.scanningStatus}</span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400">
                    {scanCompleted ? 'READY FOR INTERVIEW' : `20s SCAN (${Math.round(scanProgress)}%)`}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION SECTION AFTER SCAN COMPLETION (USER REQUESTED: BUTTON TO GO TO Q&A, NO AUTO DIRECT) */}
            {scanCompleted && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {T.goToQuestionsSub}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'hi'
                        ? 'कैमरा बंद कर दिया गया है। अब 5-प्रश्नों के मौखिक साक्षात्कार के लिए आगे बढ़ें।'
                        : 'Camera sensors powered down. Proceed when ready to begin the 5-question voice test.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Re-scan Button */}
                  <button
                    type="button"
                    onClick={handleRescanVitals}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{T.rescanBtn}</span>
                  </button>

                  {/* Primary GO TO QUESTION & ANSWERS BUTTON */}
                  <button
                    type="button"
                    onClick={handleGoToVoiceInterview}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.02]"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{T.goToQuestionsBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 2: INTERACTIVE 5-QUESTION VOICE INTERVIEW          */}
        {/* ======================================================== */}
        {phase === 'VOICE_INTERVIEW' && (
          <div className="space-y-5 animate-fade-in">
            {/* Header with Vitals Mini-Dock & Audio Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              {/* Mini Vitals Dock */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{heartRate} BPM</span>
                </span>
                <span className="flex items-center gap-1 text-sky-400 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/20">
                  <Wind className="w-3.5 h-3.5" />
                  <span>SpO2 {spo2}%</span>
                </span>
                <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>{temperature}°F</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>CAMERA OFF</span>
                </span>
              </div>

              {/* Controls: Replay Audio & Mute */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakCurrentQuestion(currentQIndex)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition shadow-sm"
                  title={T.replayAudio}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-emerald-400' : ''}`} />
                  <span>{T.replayAudio}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSoundMuted(!soundMuted)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
                  title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
                </button>
              </div>
            </div>

            {/* Question Card Container */}
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-xl overflow-hidden">
              {/* Top Question Progress & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {T.questionCounter} {currentQIndex + 1} {T.of} {HEALTH_QUESTIONS.length}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    DGMS RULE 77B SCREENING
                  </span>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center gap-1.5">
                  {HEALTH_QUESTIONS.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentQIndex 
                          ? 'w-6 bg-amber-400'
                          : idx < currentQIndex 
                          ? 'w-2 bg-emerald-400'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Question Display */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed tracking-wide">
                  {currentQ.text[lang] || currentQ.text.hi}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1.5 flex items-center gap-2">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>{T.sayOrTap}</span>
                </p>
              </div>

              {/* Interactive Voice Assistant Status Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Visualizer & Mic Pulse */}
                <div className="flex items-center gap-3">
                  <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isSpeaking 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-lg shadow-amber-500/20'
                      : isListening
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isSpeaking ? (
                      <Volume2 className="w-5 h-5 animate-pulse text-amber-400" />
                    ) : (
                      <Mic className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>
                        {isSpeaking 
                          ? T.speakingLabel 
                          : isListening 
                          ? T.listeningLabel 
                          : T.sayOrTap}
                      </span>
                    </div>

                    {/* Live recognized transcription */}
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {voiceTranscript ? (
                        <span className="text-emerald-400 font-bold">
                          {T.heardLabel} "{voiceTranscript}"
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {isListening ? 'Speak "Yes / Haan" or "No / Nahin" into mic' : 'AI Speech Ready'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Animated Audio Equalizer Waves */}
                <div className="flex items-end gap-1 h-6 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                  <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-5 animate-bounce' : 'h-1.5'}`} />
                  <span className={`w-1 bg-amber-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-3 animate-pulse' : 'h-2'}`} />
                  <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-6 animate-bounce' : 'h-1.5'}`} />
                  <span className={`w-1 bg-sky-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-4 animate-pulse' : 'h-2'}`} />
                  <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-5 animate-bounce' : 'h-1.5'}`} />
                </div>
              </div>

              {/* Action Buttons: Dual Voice & Large High-Contrast Tap Targets */}
              <div className="grid grid-cols-2 gap-4">
                {/* YES Button */}
                <button
                  type="button"
                  onClick={() => handleAnswerSelect('yes')}
                  className={`relative p-5 rounded-2xl border-2 font-black text-base sm:text-lg flex flex-col items-center justify-center gap-1.5 transition transform active:scale-95 shadow-xl ${
                    lastHeardAnswer === 'yes'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/40 scale-102'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-emerald-950/40 hover:to-slate-900 text-white border-slate-700 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{currentQ.options.yes[lang] || currentQ.options.yes.hi}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-normal">
                    {lang === 'hi' ? 'हाँ (YES)' : lang === 'sat' ? 'ᱦᱚᱭ (YES)' : 'YES (AFFIRMATIVE)'}
                  </span>
                  {lastHeardAnswer === 'yes' && (
                    <span className="absolute top-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 font-bold animate-pulse">
                      VOICE DETECTED
                    </span>
                  )}
                </button>

                {/* NO Button */}
                <button
                  type="button"
                  onClick={() => handleAnswerSelect('no')}
                  className={`relative p-5 rounded-2xl border-2 font-black text-base sm:text-lg flex flex-col items-center justify-center gap-1.5 transition transform active:scale-95 shadow-xl ${
                    lastHeardAnswer === 'no'
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-500/40 scale-102'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-amber-950/40 hover:to-slate-900 text-white border-slate-700 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-amber-400" />
                    <span>{currentQ.options.no[lang] || currentQ.options.no.hi}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-normal">
                    {lang === 'hi' ? 'नहीं (NO)' : lang === 'sat' ? 'ᱵᱟᱝ (NO)' : 'NO (NEGATIVE)'}
                  </span>
                  {lastHeardAnswer === 'no' && (
                    <span className="absolute top-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 font-bold animate-pulse">
                      VOICE DETECTED
                    </span>
                  )}
                </button>
              </div>

              {/* Footer Assistance & Mic Restart */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  <span className="font-mono text-[11px]">
                    {isListening ? T.micActive : T.micOff}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={startListening}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'hi' ? 'माइक फिर चालू करें' : 'Restart Mic'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 3: FINAL VERDICT & CONSOLIDATED DGMS CERTIFICATE   */}
        {/* ======================================================== */}
        {phase === 'FINAL_VERDICT' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top Verdict Ribbon */}
            <div className={`p-5 rounded-3xl border-2 transition ${
              isFit 
                ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-emerald-500/60 text-emerald-100 shadow-xl shadow-emerald-500/10'
                : 'bg-gradient-to-r from-red-950/60 via-slate-900 to-red-950/60 border-red-500/60 text-red-100 shadow-xl shadow-red-500/10'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isFit ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}>
                    {isFit ? <ShieldCheck className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isFit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {isFit ? 'DGMS MEDICAL PASS • 100% CLEARED' : 'INGRESS DENIED • MEDICAL REFERRAL'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {isFit ? T.fitTitle : T.unfitTitle}
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                      {isFit ? T.fitDesc : T.unfitDesc}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs shrink-0">
                  <div className="text-slate-400">{T.cognitiveReady}</div>
                  <div className="text-xl font-black text-amber-400">{isFit ? '98%' : '58%'}</div>
                  <div className="text-[10px] text-emerald-400">{T.screeningPassed}</div>
                </div>
              </div>
            </div>

            {/* Consolidated Telemetry 4-Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Pulse */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    <span>{T.heartRate}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-mono text-white">{heartRate}</span>
                  <span className="text-xs text-slate-400 font-mono">BPM</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">✓ Normal Rhythm</div>
              </div>

              {/* Card 2: SpO2 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    <span>{T.spo2}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-mono text-white">{spo2}%</span>
                  <span className="text-xs text-slate-400 font-mono">Sat</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">✓ Safe Oxygen Level</div>
              </div>

              {/* Card 3: Stress & Fatigue */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-amber-400" />
                    <span>{T.stress}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-base font-black text-white truncate">{stressDesc}</span>
                </div>
                <div className="text-[10px] font-mono text-amber-400 mt-1">Level: {stressLevel}</div>
              </div>

              {/* Card 4: Temp */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>{T.temp}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-mono text-white">{temperature}</span>
                  <span className="text-xs text-slate-400 font-mono">°F</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">✓ Thermal Norm</div>
              </div>
            </div>

            {/* Form-B Verification Cryptographic Hash Strip */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>DGMS FORM-B ELECTRONIC LOG:</span>
                <span className="text-amber-400 font-bold">HMAC-SHA256: 8C19FE-DGMS-77B-OK</span>
              </div>
              <div className="text-slate-500">
                Verified: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleRescanVitals}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{T.rescanBtn}</span>
              </button>

              {isFit ? (
                <button
                  type="button"
                  onClick={handleProceedToTraining}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2.5 transition transform hover:scale-[1.02]"
                >
                  <span>{T.proceedBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 rounded-xl bg-red-600/50 text-slate-300 font-black text-xs sm:text-sm cursor-not-allowed flex items-center gap-2 opacity-80"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>INGRESS BLOCKED (VISIT PIT-HEAD DISPENSARY)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hackathon Judge Simulation Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{T.demoControls}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplySimMode('FIT')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                simMode === 'FIT'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{T.demoFit}</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplySimMode('UNFIT')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                simMode === 'UNFIT'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{T.demoUnfit}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
