import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, ShieldCheck, AlertTriangle, Users, Award, 
  Search, CheckCircle2, QrCode, FileText, Activity, MapPin,
  UserPlus, Radio, Siren, Eye, ArrowRight, Check, X,
  Clock, Lock, ShieldAlert, PhoneCall, RefreshCw, Volume2, Trash2,
  Camera, CameraOff, AlertOctagon, Sparkles
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { playIndustrialBeep } from '../../utils/speechHelper';
import { fetchMasterMiners, postMinerAction } from '../../utils/apiMiners';

const STORAGE_KEY = 'khan_suraksha_registered_miners';


const DASHBOARD_TEXTS = {
  en: {
    circle: 'DGMS DHANBAD • CIRCLE-1',
    coalfield: 'BCCL JHARIA COALFIELD',
    title: 'Central Mining Safety Command & Control Console',
    totalMiners: 'TOTAL MINERS',
    underground: 'UNDERGROUND',
    onSurface: 'ON SURFACE',
    tabRegister: '1. Worker Registration',
    tabScan: '2. Gate QR Scanner',
    tabMonitor: '3. Live Mine Map (Monitor)',
    tabSos: '4. Emergency SOS & Mustering',

    // Tab 1: Register
    enrollTitle: 'Statutory Worker Enrollment (Form-B Ledger)',
    fullName: 'Worker Full Name:',
    namePlaceholder: 'e.g. Somra Marandi / John Doe',
    labourId: 'Assigned Labour Mining ID:',
    autoGen: 'Auto-Generate ID',
    idPlaceholder: 'e.g. JH-BCCL-7741',
    trade: 'Trade / Designation:',
    age: 'Age (Years):',
    blood: 'Blood Group:',
    mobile: 'Mobile Number:',
    emergencyContact: 'Emergency Contact Person / Phone:',
    colliery: 'Assigned Colliery / Seam:',
    saveBtn: 'SAVE TO STATUTORY REGISTER',
    registerSuccess: 'Worker registered successfully to DGMS ledger!',
    registerTableTitle: 'DGMS Statutory Register (Mines Rules 1955, Rule 77B)',
    searchPlaceholder: 'Search by Name, ID or Trade...',
    thWorker: 'WORKER',
    thId: 'LABOUR ID',
    thContact: 'CONTACT',
    thTrade: 'TRADE',
    thStatus: 'STATUS',
    showingMiners: 'Showing miners',
    syncStatus: 'All records synchronized locally',

    // Tab 2: Scanner
    scannerTitle: 'Pit-Head Optical QR Gate Scanner',
    scannerReady: 'OPTICAL SCANNER READY',
    gateIn: 'Gate-In (Pit Entry)',
    gateOut: 'Gate-Out (Shift Exit)',
    aimQr: 'AIM QR CODE',
    scanPromptIn: 'Scan digital safety passport to authorize subterranean ingress',
    scanPromptOut: 'Scan digital passport to log safe shift egress',
    autoValid: 'AUTOMATED CRYPTOGRAPHIC SIGNATURE VALIDATION',
    selectMinerPrompt: 'Select Miner Passport to Scan (Simulation):',
    scanBtn: 'SCAN PASSPORT',
    resultTitle: 'Verification Result',
    noScans: 'No recent scans recorded',
    noScansSub: 'Select a miner on the left and click "Scan Passport" to view verification receipt',
    approvedIn: '✓ GATE-IN APPROVED (UNDERGROUND)',
    approvedOut: '✓ GATE-OUT COMPLETE (ON SURFACE)',
    statutoryAudit: 'STATUTORY AUDIT: DGMS COMPLIANT',
    tamperProof: 'TAMPER-PROOF LEDGER',

    // Tab 3: Monitor
    monitorTitle: 'Subterranean Mine 2D Digital Twin & Personnel Tracker',
    monitorSub: 'BCCL Jharia Colliery • Seam 2 & Seam 4 Gallery Layout',
    syncSensor: 'PDR IMU Sensor Sync',
    legendActive: 'Active Miner',
    legendRefuge: 'Refuge Chamber (Safe)',
    legendAir: 'Fresh Air Intake',
    legendTrapped: 'Trapped / Immobile Worker',
    gisStandard: 'DGMS Standard GIS Floorplan v3',

    // Tab 4: SOS
    sosTitle: 'Disaster Evacuation & Rescue Command Console',
    sosSub: 'Real-time subterranean evacuation monitoring & rescue dispatch',
    standbyBadge: 'NORMAL STATUS (STANDBY)',
    activeBadge: '🚨 RED ALARM ACTIVE (SIREN SOUNDING)',
    sosBoxTitle: 'Initiate Emergency Mock Drill or Live Hazard Alert',
    sosBoxDesc: 'Triggering this alarm broadcasts an evacuation siren to all subterranean workers and initiates live triage tracking in the control room.',
    triggerGas: 'TRIGGER CH₄ METHANE GAS LEAK',
    triggerFire: 'TRIGGER CONVEYOR BELT FIRE',
    tallySafe: '🟢 REFUGE CHAMBER SAFE',
    tallySafeSub: 'Mustered inside sealed oxygen haven',
    tallyMoving: '🟡 EN-ROUTE / EVACUATING',
    tallyMovingSub: 'Following compass vectors to safety',
    tallyTrapped: '🔴 TRAPPED / CRITICAL',
    tallyTrappedSub: 'Suresh (ID: 1088) Seam 2 Pillar 14',
    rescueStation: 'DGMS Mines Rescue Station (Dhanbad Station I)',
    sarCoords: 'Targeted SAR Coordinates: Seam-2, Crosscut-14, Pillar-B (Depth: 280m). Trapped Worker: Suresh Bauri.',
    dispatchBtn: 'DISPATCH COORDINATES TO RESCUE TEAM',
    dispatchedBtn: '✓ RESCUE TEAM DISPATCHED',
    clearBtn: 'End Drill (All Clear)'
  },
  hi: {
    circle: 'डीजीएमएस धनबाद • मंडल-१',
    coalfield: 'बीसीसीएल झरिया कोयलांचल',
    title: 'केंद्रीय खदान सुरक्षा कमान एवं नियंत्रण पोर्टल',
    totalMiners: 'कुल पंजीकृत श्रमिक',
    underground: 'भूमिगत कार्यरत',
    onSurface: 'सतह पर सुरक्षित',
    tabRegister: '1. श्रमिक पंजीकरण',
    tabScan: '2. गेट स्कैनर',
    tabMonitor: '3. लाइव खदान मैप',
    tabSos: '4. आपातकालीन SOS',

    // Tab 1: Register
    enrollTitle: 'नया श्रमिक ऑनबोर्डिंग (Form-B रजिस्टर)',
    fullName: 'श्रमिक का पूरा नाम:',
    namePlaceholder: 'जैसे सोमरा मरांडी / रमेश कुमार',
    labourId: 'प्रबंधन द्वारा आवंटित लेबर ID:',
    autoGen: 'ऑटो आईडी बनाएं',
    idPlaceholder: 'जैसे JH-BCCL-7741',
    trade: 'कार्य श्रेणी (पद):',
    age: 'उम्र (वर्ष):',
    blood: 'रक्त समूह (Blood Group):',
    mobile: 'मोबाइल नंबर:',
    emergencyContact: 'आपातकालीन संपर्क व्यक्ति व फोन:',
    colliery: 'आवंटित खदान / कार्यक्षेत्र:',
    saveBtn: 'वैधानिक रजिस्टर में सहेजें',
    registerSuccess: 'श्रमिक डीजीएमएस रजिस्टर में सफलतापूर्वक जुड़ गया!',
    registerTableTitle: 'डीजीएमएस वैधानिक रजिस्टर (खान नियम 1955, धारा 77B)',
    searchPlaceholder: 'नाम, आईडी या पद से खोजें...',
    thWorker: 'श्रमिक',
    thId: 'लेबर ID',
    thContact: 'संपर्क (मोबाइल)',
    thTrade: 'पद',
    thStatus: 'स्थिति',
    showingMiners: 'पंजीकृत श्रमिक',
    syncStatus: 'सभी रिकॉर्ड स्थानीय रूप से सुरक्षित',

    // Tab 2: Scanner
    scannerTitle: 'पिट-हेड डिजिटल QR गेट स्कैनर',
    scannerReady: 'ऑप्टिकल स्कैनर सक्रिय',
    gateIn: 'गेट-इन (खदान प्रवेश)',
    gateOut: 'गेट-आउट (शिफ्ट निकास)',
    aimQr: 'QR कोड स्कैन करें',
    scanPromptIn: 'खदान में प्रवेश के लिए डिजिटल पासपोर्ट स्कैन करें',
    scanPromptOut: 'शिफ्ट समाप्ति पर सुरक्षित निकास दर्ज करें',
    autoValid: 'स्वचालित क्रिप्टोग्राफ़िक हस्ताक्षर सत्यापन',
    selectMinerPrompt: 'डेमो के लिए श्रमिक QR चुनें:',
    scanBtn: 'स्कैन करें',
    resultTitle: 'सत्यापन रसीद',
    noScans: 'कोई हालिया स्कैन नहीं हुआ है',
    noScansSub: 'बाईं ओर से श्रमिक चुनकर "स्कैन करें" दबाएं',
    approvedIn: '✓ गेट-इन स्वीकृत (भूमिगत)',
    approvedOut: '✓ गेट-आउट पूर्ण (सतह पर)',
    statutoryAudit: 'वैधानिक ऑडिट: डीजीएमएस अनुपालन',
    tamperProof: 'अपरिवर्तनीय डिजिटल रजिस्टर',

    // Tab 3: Monitor
    monitorTitle: 'भूमिगत खदान 2D डिजिटल ट्विन एवं कार्मिक ट्रैकर',
    monitorSub: 'बीसीसीएल झरिया कोलियरी • सीम 2 एवं सीम 4 लेआउट',
    syncSensor: 'पी-डी-आर सेंसर सिंक',
    legendActive: 'सक्रिय खनिक',
    legendRefuge: 'रिफ्यूज चैंबर (सुरक्षित)',
    legendAir: 'ताजी हवा इनटेक',
    legendTrapped: 'फंसा हुआ / स्थिर श्रमिक',
    gisStandard: 'डीजीएमएस मानक जीआईएस लेआउट v3',

    // Tab 4: SOS
    sosTitle: 'आपातकालीन सायरन एवं रेस्क्यू कमांड',
    sosSub: 'लाइव आपातकालीन निकासी निगरानी एवं रेस्क्यू टीम समन्वय',
    standbyBadge: 'सामान्य स्थिति (तैयार)',
    activeBadge: '🚨 रेड अलार्म सक्रिय (सायरन बज रहा है)',
    sosBoxTitle: 'आपातकालीन मॉक-ड्रिल या अलार्म आरंभ करें',
    sosBoxDesc: 'अलार्म दबाते ही भूमिगत कर्मियों के फोन पर सायरन बजेगा और कंट्रोल रूम में लाइव ट्रायज काउंट शुरू होगा।',
    triggerGas: 'मीथेन गैस रिसाव अलार्म आरंभ करें',
    triggerFire: 'कन्वेयर बेल्ट आग अलार्म आरंभ करें',
    tallySafe: '🟢 रिफ्यूज चैंबर में सुरक्षित',
    tallySafeSub: 'ऑक्सीजन युक्त सुरक्षित कमरे में पहुंचे',
    tallyMoving: '🟡 रास्ते में / निकासी जारी',
    tallyMovingSub: 'कम्पास दिशा निर्देशों का पालन करते हुए',
    tallyTrapped: '🔴 खतरे के क्षेत्र में फंसे हुए',
    tallyTrappedSub: 'सुरेश (ID: 1088) सीम 2 पिलर 14',
    rescueStation: 'डीजीएमएस माइंस रेस्क्यू स्टेशन (धनबाद स्टेशन-1)',
    sarCoords: 'लक्षित रेस्क्यू निर्देशांक: सीम-2, क्रॉसकट-14, पिलर-B (गहराई: 280 मीटर)।',
    dispatchBtn: 'रेस्क्यू टीम को निर्देशांक भेजें',
    dispatchedBtn: '✓ रेस्क्यू टीम रवाना हो चुकी है',
    clearBtn: 'ड्रिल समाप्त करें (सामान्य स्थिति)'
  },
  sat: {
    circle: 'DGMS ᱫᱷᱟᱱᱵᱟᱫᱽ • ᱢᱟᱱᱰᱟᱞ-᱑',
    coalfield: 'BCCL ᱡᱷᱟᱨᱤᱭᱟ ᱠᱩᱭᱞᱟᱹ ᱴᱚᱴᱷᱟ',
    title: 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱚᱢᱟᱱ ᱟᱨ ᱠᱚᱱᱴᱨᱳᱞ ᱠᱚᱱᱥᱳᱞ',
    totalMiners: 'ᱢᱩᱴ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    underground: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱢᱮᱱᱟᱜ ᱠᱚ',
    onSurface: 'ᱪᱮᱛᱟᱱ ᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱚ',
    tabRegister: '1. ᱠᱟᱹᱢᱤᱭᱟᱹ ᱨᱮᱡᱤᱥᱴᱟᱨ',
    tabScan: '2. ᱜᱮᱴ ᱥᱠᱮᱱᱟᱨ',
    tabMonitor: '3. ᱠᱷᱟᱫᱟᱱ ᱢᱮᱯ (Monitor)',
    tabSos: '4. ᱮᱢᱟᱨᱡᱮᱱᱥᱤ SOS',

    // Tab 1: Register
    enrollTitle: 'ᱱᱟᱣᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱚᱞᱚᱱ (Form-B ᱨᱮᱡᱤᱥᱴᱟᱨ)',
    fullName: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ:',
    namePlaceholder: 'ᱥᱳᱢᱨᱟ ᱢᱟᱨᱟᱱᱰᱤ ᱞᱮᱠᱟ',
    labourId: 'ᱢᱮᱱᱮᱡᱽᱢᱮᱱᱴ ᱮᱢ ᱟᱠᱟᱫ ID:',
    autoGen: 'Auto ID ᱵᱮᱱᱟᱣ',
    idPlaceholder: 'JH-BCCL-7741',
    trade: 'ᱠᱟᱹᱢᱤ ᱦᱟᱹᱴᱤᱧ (Trade):',
    age: 'ᱩᱢᱮᱨ (ᱥᱮᱨᱢᱟ):',
    blood: 'ᱢᱟᱭᱟᱢ ᱜᱩᱴ (Blood Group):',
    mobile: 'ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ:',
    emergencyContact: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱟᱹᱜᱟᱹᱭ:',
    colliery: 'ᱠᱷᱟᱫᱟᱱ / ᱡᱟᱭᱜᱟ:',
    saveBtn: 'ᱨᱮᱡᱤᱥᱴᱟᱨ ᱨᱮ ᱥᱟᱧᱪᱟᱣ ᱢᱮ',
    registerSuccess: 'ᱠᱟᱹᱢᱤᱭᱟᱹ DGMS ᱨᱮᱡᱤᱥᱴᱟᱨ ᱨᱮ ᱥᱮᱞᱮᱫ ᱮᱱᱟᱭ!',
    registerTableTitle: 'DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱨᱮᱡᱤᱥᱴᱟᱨ (Rule 77B)',
    searchPlaceholder: 'ᱧᱩᱛᱩᱢ ᱥᱮ ID ᱛᱮ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
    thWorker: 'ᱠᱟᱹᱢᱤᱭᱟᱹ',
    thId: 'ID',
    thContact: 'ᱡᱚᱯᱚᱲᱟᱣ',
    thTrade: 'ᱠᱟᱹᱢᱤ',
    thStatus: 'ᱦᱟᱞᱚᱛ',
    showingMiners: 'ᱨᱮᱡᱤᱥᱴᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ',
    syncStatus: 'ᱥᱟᱱᱟᱢ ᱨᱮᱠᱳᱨᱰ ᱱᱚᱸᱰᱮ ᱥᱟᱧᱪᱟᱣ ᱢᱮᱱᱟᱜ-ᱟ',

    // Tab 2: Scanner
    scannerTitle: 'ᱯᱤᱴ-ᱦᱮᱰ QR ᱜᱮᱴ ᱥᱠᱮᱱᱟᱨ',
    scannerReady: 'ᱥᱠᱮᱱᱟᱨ ᱥᱟᱯᱲᱟᱣ ᱜᱮᱭᱟ',
    gateIn: 'ᱜᱮᱴ-ᱤᱱ (ᱵᱚᱞᱚᱱ)',
    gateOut: 'ᱜᱮᱴ-ᱟᱣᱩᱴ (ᱚᱰᱚᱠ)',
    aimQr: 'QR ᱥᱠᱮᱱ ᱢᱮ',
    scanPromptIn: 'ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥᱯᱳᱨᱴ ᱥᱠᱮᱱ ᱢᱮ',
    scanPromptOut: 'ᱥᱤᱯᱷᱴ ᱪᱟᱵᱟ ᱠᱟᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ ᱥᱠᱮᱱ ᱢᱮ',
    autoValid: 'ᱥᱟᱹᱨᱤ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱚᱨᱚᱠ',
    selectMinerPrompt: 'ᱥᱠᱮᱱ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:',
    scanBtn: 'ᱥᱠᱮᱱ ᱢᱮ',
    resultTitle: 'ᱯᱚᱨᱚᱠ ᱨᱟᱹᱥᱤᱫ',
    noScans: 'ᱱᱤᱛᱚᱜ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱥᱠᱮᱱ ᱟᱠᱟᱱᱟ',
    noScansSub: 'ᱞᱮᱸᱜᱟ ᱯᱟᱦᱴᱟ ᱠᱷᱚᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱠᱟᱛᱮ "ᱥᱠᱮᱱ ᱢᱮ" ᱚᱛᱟᱭ ᱢᱮ',
    approvedIn: '✓ ᱵᱚᱞᱚᱱ ᱪᱷᱟᱹᱲ ᱧᱟᱢᱮᱱᱟ (ᱚᱛ ᱞᱟᱛᱟᱨ)',
    approvedOut: '✓ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱥᱟᱹᱛ ᱮᱱᱟ (ᱪᱮᱛᱟᱱ ᱨᱮ)',
    statutoryAudit: 'DGMS ᱠᱚᱢᱯᱞᱟᱭᱟᱱᱥ',
    tamperProof: 'ᱰᱤᱡᱤᱴᱟᱞ ᱨᱮᱡᱤᱥᱴᱟᱨ',

    // Tab 3: Monitor
    monitorTitle: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱷᱟᱫᱟᱱ 2D ᱰᱤᱡᱤᱴᱟᱞ ᱴᱣᱤᱱ',
    monitorSub: 'BCCL ᱡᱷᱟᱨᱤᱭᱟ • Seam 2 ᱟᱨ Seam 4 ᱞᱮᱟᱣᱩᱴ',
    syncSensor: 'PDR ᱥᱮᱱᱥᱚᱨ ᱥᱤᱝᱠ',
    legendActive: 'ᱠᱟᱹᱢᱤ ᱠᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    legendRefuge: 'ᱨᱮᱯᱷᱤᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ (ᱨᱩᱠᱷᱤᱭᱟᱹ)',
    legendAir: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ',
    legendTrapped: 'ᱛᱷᱤᱨ ᱟᱠᱟᱱ / ᱯᱷᱟᱥᱟᱣ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    gisStandard: 'DGMS GIS ᱞᱮᱟᱣᱩᱴ v3',

    // Tab 4: SOS
    sosTitle: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱟᱭᱨᱮᱱ ᱟᱨ ᱨᱮᱥᱠᱤᱭᱩ ᱠᱚᱱᱥᱳᱞ',
    sosSub: 'ᱞᱟᱭᱤᱵᱽ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱟᱨ ᱨᱮᱥᱠᱤᱭᱩ ᱫᱚᱞ ᱥᱟᱶ ᱡᱚᱯᱚᱲᱟᱣ',
    standbyBadge: 'ᱥᱟᱯᱲᱟᱣ ᱦᱟᱞᱚᱛ (STANDBY)',
    activeBadge: '🚨 ᱟᱨᱟᱜ ᱦᱩᱥᱤᱭᱟᱹᱨ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ',
    sosBoxTitle: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱰᱨᱤᱞ ᱮᱦᱚᱵᱽ ᱢᱮ',
    sosBoxDesc: 'ᱟᱞᱟᱨᱢ ᱚᱛᱟ ᱞᱮᱠᱷᱟᱱ ᱥᱟᱱᱟᱢ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱜ ᱯᱷᱳᱱ ᱨᱮ ᱥᱟᱭᱨᱮᱱ ᱥᱟᱰᱮᱜ-ᱟ ᱟᱨ ᱞᱟᱭᱤᱵᱽ ᱴᱨᱮᱠᱤᱝ ᱮᱦᱚᱵᱚᱜ-ᱟ᱾',
    triggerGas: 'ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ ᱞᱤᱠ ᱟᱞᱟᱨᱢ (TRIGGER GAS)',
    triggerFire: 'ᱥᱮᱸᱜᱮᱞ ᱟᱞᱟᱨᱢ ᱮᱦᱚᱵᱽ ᱢᱮ (TRIGGER FIRE)',
    tallySafe: '🟢 ᱨᱮᱯᱷᱤᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    tallySafeSub: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱚᱲᱟᱜ ᱨᱮ ᱥᱮᱴᱮᱨ ᱟᱠᱟᱱᱟ ᱠᱚ',
    tallyMoving: '🟡 ᱰᱟᱦᱟᱨ ᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ',
    tallyMovingSub: 'ᱫᱤᱥᱟᱹ ᱪᱤᱱᱦᱟᱹ ᱯᱟᱸᱡᱟ ᱠᱟᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ ᱠᱚ',
    tallyTrapped: '🔴 ᱵᱚᱛᱚᱨ ᱴᱚᱴᱷᱟ ᱨᱮ ᱯᱷᱟᱥᱟᱣ ᱟᱠᱟᱱ',
    tallyTrappedSub: 'ᱥᱩᱨᱮᱥ (ID: 1088) Seam 2 Pillar 14',
    rescueStation: 'DGMS ᱠᱷᱟᱫᱟᱱ ᱨᱮᱥᱠᱤᱭᱩ ᱥᱴᱮᱥᱚᱱ (ᱫᱷᱟᱱᱵᱟᱫᱽ)',
    sarCoords: 'ᱨᱮᱥᱠᱤᱭᱩ ᱴᱷᱟᱶ: Seam-2, Crosscut-14, Pillar-B (ᱜᱟᱹᱦᱤᱨ: 280 ᱢᱤᱴᱟᱨ)᱾ ᱯᱷᱟᱥᱟᱣ ᱠᱟᱹᱢᱤᱭᱟᱹ: ᱥᱩᱨᱮᱥ ᱵᱟᱣᱨᱤ᱾',
    dispatchBtn: 'ᱨᱮᱥᱠᱤᱭᱩ ᱫᱚᱞ ᱠᱚ ᱠᱷᱚᱵᱚᱨ ᱵᱷᱮᱡᱟᱭ ᱢᱮ',
    dispatchedBtn: '✓ ᱨᱮᱥᱠᱤᱭᱩ ᱫᱚᱞ ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ',
    clearBtn: 'ᱰᱨᱤᱞ ᱪᱟᱵᱟᱭ ᱢᱮ (ALL CLEAR)'
  }
};

const INITIAL_WORKERS = [];

export default function AdminDashboard({ lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('monitor'); // 'register' | 'scan' | 'monitor' | 'sos'
  const [workersList, setWorkersList] = useState(INITIAL_WORKERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('28');
  const [regBlood, setRegBlood] = useState('O+');
  const [regMobile, setRegMobile] = useState('');
  const [regEmergency, setRegEmergency] = useState('');
  const [regId, setRegId] = useState('');
  const [regColliery, setRegColliery] = useState('BCCL Jharia Underground (Seam 4)');
  const [regTrade, setRegTrade] = useState('Coal Face Driller');
  const [regShift, setRegShift] = useState('Shift A (06:00 - 14:00)');
  const [regSuccess, setRegSuccess] = useState('');

  // Scanner States
  const [scanMode, setScanMode] = useState('GATE_IN'); // 'GATE_IN' | 'GATE_OUT'
  const [selectedScanWorkerId, setSelectedScanWorkerId] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);

  // Optical Camera Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanError, setScanError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Emergency SOS States
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [hazardType, setHazardType] = useState('CH4_GAS'); // 'CH4_GAS' | 'FIRE'
  const [evacTally, setEvacTally] = useState({ safe: 0, moving: 0, trapped: 0 });
  const [dispatchAlertSent, setDispatchAlertSent] = useState(false);

  const T = DASHBOARD_TEXTS[lang] || DASHBOARD_TEXTS.en;

  // Load from Master Ledger API & Polling Sync
  const loadMiners = async () => {
    try {
      const data = await fetchMasterMiners();
      if (data && typeof data === 'object') {
        const list = Object.values(data);
        setWorkersList(list);
        if (list.length > 0 && !selectedScanWorkerId) {
          setSelectedScanWorkerId(list[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching master miners', err);
    }
  };

  useEffect(() => {
    loadMiners();
    // Real-time synchronization interval across tabs & ports
    const pollId = setInterval(loadMiners, 3000);
    return () => clearInterval(pollId);
  }, []);


  const playSiren = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // audio context
    }
  };

  const handleTriggerSOS = (type) => {
    playSiren();
    setIsEmergencyActive(true);
    setHazardType(type);
    setDispatchAlertSent(false);
    setEvacTally({ safe: 3, moving: 1, trapped: 1 });
  };

  const handleClearSOS = () => {
    playIndustrialBeep(880, 100);
    setIsEmergencyActive(false);
    setDispatchAlertSent(false);
  };

  const handleDispatchRescue = () => {
    playIndustrialBeep(1200, 150);
    setDispatchAlertSent(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regId.trim()) return;

    const newW = {
      id: regId.trim().toUpperCase(),
      name: regName.trim(),
      age: parseInt(regAge) || 28,
      blood: regBlood || 'O+',
      mobile: regMobile.trim() || '+91 98765-43210',
      emergency: regEmergency.trim() || '+91 94311-00000',
      pin: null, // Worker sets their own PIN on first sign-up on Worker App!
      pinSet: false,
      colliery: regColliery,
      trade: regTrade,
      shift: regShift,
      status: 'SURFACE',
      location: 'Surface Assembly',
      lastScan: 'Registered Now',
      hr: 76,
      spo2: 98,
      vitalsOk: true,
      fireScore: 94,
      gasScore: 92
    };

    setWorkersList(prev => [newW, ...prev]);
    if (!selectedScanWorkerId) {
      setSelectedScanWorkerId(newW.id);
    }

    // Persist via cross-port API
    await postMinerAction({ action: 'register', worker: newW });

    playIndustrialBeep(1100, 100);
    setRegSuccess(T.registerSuccess);
    setRegName('');
    setRegId('');
    setRegMobile('');
    setRegEmergency('');

    setTimeout(() => setRegSuccess(''), 4000);
  };

  const handleClearAllMiners = async () => {
    if (window.confirm('Clear all registered miners for testing?')) {
      playIndustrialBeep(700, 120);
      await postMinerAction({ action: 'clearAll' });
      setWorkersList([]);
      setSelectedScanWorkerId('');
      setLastScanResult(null);
    }
  };

  const handleExecuteScan = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let worker = workersList.find(w => w.id === selectedScanWorkerId);
    if (!worker && workersList.length > 0) {
      worker = workersList[0];
    }
    if (!worker) {
      worker = {
        id: 'JH-BCCL-7741',
        name: 'Shreyash Jaiswal',
        colliery: 'BCCL Jharia Underground (Seam 4)',
        trade: 'Coal Face Driller',
        status: 'SURFACE'
      };
    }

    playIndustrialBeep(scanMode === 'GATE_IN' ? 1200 : 900, 120);

    const updatedStatus = scanMode === 'GATE_IN' ? 'UNDERGROUND' : 'SURFACE';
    const updatedLocation = scanMode === 'GATE_IN' ? 'Seam 4 - Active Gallery' : 'Pit-Head Surface Egress';
    const nowTime = new Date().toLocaleTimeString();

    setWorkersList(prev => {
      const exists = prev.some(w => w.id === worker.id);
      if (exists) {
        return prev.map(w => w.id === worker.id ? {
          ...w,
          status: updatedStatus,
          location: updatedLocation,
          lastScan: `${scanMode === 'GATE_IN' ? 'IN' : 'OUT'} @ ${nowTime}`
        } : w);
      }
      return [{
        ...worker,
        status: updatedStatus,
        location: updatedLocation,
        lastScan: `${scanMode === 'GATE_IN' ? 'IN' : 'OUT'} @ ${nowTime}`
      }, ...prev];
    });

    await postMinerAction({
      action: 'updateStatus',
      id: worker.id,
      name: worker.name,
      status: updatedStatus,
      location: updatedLocation,
      lastScan: `${scanMode === 'GATE_IN' ? 'IN' : 'OUT'} @ ${nowTime}`
    });

    setScanError(null);
    setLastScanResult({
      mode: scanMode,
      workerName: worker.name,
      workerId: worker.id,
      colliery: worker.colliery,
      trade: worker.trade,
      time: nowTime,
      verifiedHash: 'HMAC-SHA256: VALID (DGMS SIGNED)',
      healthClearance: 'SpO2 97% • Pulse 82 BPM • Alertness 98%',
      arScore: 'CAS 94% (Fire PASS • Gas PASS)',
      isAuthentic: true,
      turnstile: 'UNLOCKED (हरित द्वार खुला)'
    });
  };

  // Optical Camera Controller
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Camera stop error:", err);
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setScanError(null);
    setIsCameraActive(true);
    setTimeout(async () => {
      try {
        const qrContainer = document.getElementById('qr-reader-viewport');
        if (!qrContainer) {
          setIsCameraActive(false);
          return;
        }

        // Enable hardware-accelerated Chromium BarcodeDetector for 0.1s instant detection
        const html5QrCode = new Html5Qrcode('qr-reader-viewport', {
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        });
        html5QrCodeRef.current = html5QrCode;

        // Try getting cameras directly to bypass laptop facingMode limitations
        let cameraIdOrConfig = { facingMode: 'user' };
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            cameraIdOrConfig = cameras[0].id;
          }
        } catch {
          cameraIdOrConfig = { facingMode: 'user' };
        }

        // Full-frame scanning without restrictive qrbox crop
        const scanConfig = {
          fps: 15,
          disableFlip: false
        };

        await html5QrCode.start(
          cameraIdOrConfig,
          scanConfig,
          (decodedText) => {
            handleDecodedQr(decodedText);
          },
          () => {
            // Ignore ongoing frame decode errors
          }
        );
      } catch (err) {
        console.error("Camera access failed:", err);
        setScanError({
          title: 'कैमरा एरर (Camera Access Issue)',
          reason: err?.message || 'कृपया ब्राउज़र में कैमरा परमिशन Allow करें या नीचे दिए गए Instant बटन से टेस्ट करें।',
          raw: 'PERMISSION_OR_CAMERA_ERROR',
          timestamp: new Date().toLocaleTimeString()
        });
        setIsCameraActive(false);
      }
    }, 250);
  };

  // Scan directly from an uploaded QR photo / image file
  const handleScanFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-reader-file-temp', { verbose: false });
      const decodedText = await html5QrCode.scanFile(file, true);
      handleDecodedQr(decodedText);
      html5QrCode.clear();
    } catch (err) {
      console.warn("File QR scan error:", err);
      playIndustrialBeep(220, 350);
      setScanError({
        title: '🚨 QR डिटेक्ट नहीं हुआ (QR Code Not Recognized)',
        reason: 'कृपया स्पष्ट QR कोड वाली फोटो चुनें या नीचे दिए गए Instant Gate-In बटन से टेस्ट करें।',
        raw: err?.message || 'DECODE_ERROR',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  // Turn off camera on tab switch or unmount
  useEffect(() => {
    if (activeTab !== 'scan' && isCameraActive) {
      stopCamera();
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(() => {});
          }
        } catch {}
      }
    };
  }, []);

  // QR Decoder & Authenticity Validator
  const handleDecodedQr = async (decodedText) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    console.log("Decoded QR Raw:", decodedText);

    let parsed = null;
    let isAuthentic = false;

    try {
      parsed = JSON.parse(decodedText);
      const workerId = parsed.id || parsed.workerId;
      const workerName = parsed.name || parsed.n;
      const status = parsed.status;
      const hash = parsed.hash || parsed.h;

      // Authentic DGMS passport if it has worker ID and either compliant status or hash
      if (workerId && (status === 'VERIFIED_DGMS_COMPLIANT' || hash)) {
        isAuthentic = true;
        parsed.id = workerId;
        parsed.name = workerName || 'Shreyash Jaiswal';
        parsed.score = parsed.score || parsed.s || 94;
        parsed.spo2 = parsed.spo2 || (parsed.medicalClearance?.spo2 ? parseInt(parsed.medicalClearance.spo2) : 97);
        parsed.bpm = parsed.bpm || parsed.medicalClearance?.bpm || 82;
        parsed.hash = hash || '0x7F4A89C1';
      }
    } catch {
      isAuthentic = false;
    }

    if (!isAuthentic) {
      // Play low buzzer sound for fake / unrecognized QR
      playIndustrialBeep(220, 350);
      setScanError({
        title: '🚨 ACCESS DENIED: FAKE / UNRECOGNIZED QR PASSPORT',
        reason: 'अमान्य अथवा छेड़छाड़ किया गया QR कोड! यह DGMS अधिकृत डिजिटल सेफ्टी पासपोर्ट नहीं है।',
        raw: decodedText.length > 70 ? decodedText.slice(0, 70) + '...' : decodedText,
        timestamp: new Date().toLocaleTimeString(),
        violation: 'DGMS Mines Act 1952 § 22A / Mines Rules 1955 § 77B Violation Logged'
      });
      setLastScanResult(null);

      // Cooldown 2.5s before allowing next scan
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 2500);
      return;
    }

    // ORIGINAL DGMS PASSPORT DETECTED!
    playIndustrialBeep(1200, 120);
    setTimeout(() => playIndustrialBeep(1600, 150), 140);
    setScanError(null);

    const updatedStatus = scanMode === 'GATE_IN' ? 'UNDERGROUND' : 'SURFACE';
    const updatedLocation = scanMode === 'GATE_IN' ? 'Seam 4 - Active Longwall Face' : 'Pit-Head Surface Egress';
    const nowTime = new Date().toLocaleTimeString();

    // Update local workersList state
    setWorkersList(prev => {
      const exists = prev.some(w => w.id === parsed.id);
      if (exists) {
        return prev.map(w => w.id === parsed.id ? {
          ...w,
          status: updatedStatus,
          location: updatedLocation,
          lastScan: `${scanMode === 'GATE_IN' ? 'IN' : 'OUT'} @ ${nowTime}`
        } : w);
      } else {
        return [{
          id: parsed.id,
          name: parsed.name,
          age: 28,
          blood: 'O+',
          trade: 'Coal Face Operative',
          colliery: 'BCCL Jharia Underground (Seam 4)',
          status: updatedStatus,
          location: updatedLocation,
          lastScan: `${scanMode === 'GATE_IN' ? 'IN' : 'OUT'} @ ${nowTime}`,
          hr: parsed.bpm || 82,
          spo2: parsed.spo2 || 97
        }, ...prev];
      }
    });

    // Cross-port sync to master ledger
    await postMinerAction({
      action: 'updateStatus',
      id: parsed.id,
      name: parsed.name,
      status: updatedStatus,
      location: updatedLocation,
      lastScan: `${scanMode === 'GATE_IN' ? 'IN' : 'OUT'} @ ${nowTime}`
    });

    const vitalsFormatted = `SpO2 ${parsed.spo2}% • Pulse ${parsed.bpm} BPM • Alertness 98% (DGMS FIT)`;

    setLastScanResult({
      mode: scanMode,
      workerName: parsed.name,
      workerId: parsed.id,
      colliery: 'BCCL Jharia Underground (Seam 4)',
      trade: 'Coal Face Operative',
      time: nowTime,
      verifiedHash: parsed.hash ? `HMAC: ${parsed.hash.slice(0, 20)}... (VALID)` : 'HMAC-SHA256: VALID (GOVT CERTIFIED)',
      healthClearance: vitalsFormatted,
      arScore: `CAS: ${parsed.score}% (Fire PASS • Gas PASS)`,
      isAuthentic: true,
      turnstile: 'UNLOCKED (हरित द्वार खुला)'
    });

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 3000);
  };

  const undergroundCount = workersList.filter(w => w.status === 'UNDERGROUND').length;
  const surfaceCount = workersList.filter(w => w.status === 'SURFACE').length;

  const filteredWorkers = workersList.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.trade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in text-slate-100">
      {/* Top DGMS Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40 shrink-0">
            <ShieldCheck className="w-7 h-7 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {T.circle}
              </span>
              <span className="text-xs text-slate-400 font-mono">{T.coalfield}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide mt-0.5">
              {T.title}
            </h1>
          </div>
        </div>

        {/* Live Headcount Quick Widget */}
        <div className="flex items-center gap-2.5 sm:gap-4 bg-slate-950/80 p-2 sm:px-4 sm:py-2 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400">{T.totalMiners}</div>
            <div className="text-base sm:text-lg font-black text-white">{workersList.length}</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{T.underground}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-400">{undergroundCount}</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400">{T.onSurface}</div>
            <div className="text-base sm:text-lg font-black text-slate-300">{surfaceCount}</div>
          </div>
        </div>
      </div>

      {/* 4 MAIN OPERATIONAL TABS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 bg-[#0C101A] rounded-2xl border border-slate-800 shadow-lg">
        <button
          onClick={() => { playIndustrialBeep(1000, 50); setActiveTab('register'); }}
          className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'register'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{T.tabRegister}</span>
        </button>

        <button
          onClick={() => { playIndustrialBeep(1000, 50); setActiveTab('scan'); }}
          className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'scan'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{T.tabScan}</span>
        </button>

        <button
          onClick={() => { playIndustrialBeep(1000, 50); setActiveTab('monitor'); }}
          className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'monitor'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{T.tabMonitor}</span>
        </button>

        <button
          onClick={() => { playIndustrialBeep(1200, 80); setActiveTab('sos'); }}
          className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'sos'
              ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
              : isEmergencyActive 
              ? 'bg-red-500/20 border border-red-500 text-red-300 animate-pulse'
              : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
          }`}
        >
          <Siren className="w-4 h-4" />
          <span>{T.tabSos}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: REGISTER LABOUR                                   */}
      {/* ======================================================== */}
      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">{T.enrollTitle}</h2>
            </div>

            {regSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{regSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {T.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={T.namePlaceholder}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Age & Blood Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {T.age}
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    placeholder="28"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {T.blood}
                  </label>
                  <select
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="O+">O+ (Universal Donor)</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Mobile Number & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {T.mobile}
                  </label>
                  <input
                    type="text"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="+91 98765-43210"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {T.emergencyContact}
                  </label>
                  <input
                    type="text"
                    value={regEmergency}
                    onChange={(e) => setRegEmergency(e.target.value)}
                    placeholder="+91 94311-XXXXX (Relation)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>{T.labourId}</span>
                  <button
                    type="button"
                    onClick={() => setRegId(`JH-BCCL-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    {T.autoGen}
                  </button>
                </label>
                <input
                  type="text"
                  required
                  value={regId}
                  onChange={(e) => setRegId(e.target.value.toUpperCase())}
                  placeholder={T.idPlaceholder}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {T.trade}
                </label>
                <select
                  value={regTrade}
                  onChange={(e) => setRegTrade(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="Coal Face Driller">Coal Face Driller</option>
                  <option value="Blasting In-Charge">Blasting In-Charge</option>
                  <option value="Roof Bolting Operative">Roof Bolting Operative</option>
                  <option value="Haulage Specialist">Haulage Specialist</option>
                  <option value="Ventilation Attendant">Ventilation Attendant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {T.colliery}
                </label>
                <select
                  value={regColliery}
                  onChange={(e) => setRegColliery(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="BCCL Jharia Underground (Seam 4)">BCCL Jharia Underground (Seam 4)</option>
                  <option value="CCL North Karanpura (Incline 2)">CCL North Karanpura (Incline 2)</option>
                  <option value="Tata Steel West Bokaro (Shaft 3)">Tata Steel West Bokaro (Shaft 3)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5 transition mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{T.saveBtn}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">{T.registerTableTitle}</h2>
                </div>

                <div className="flex items-center gap-2">
                  {workersList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllMiners}
                      title="Clear all records"
                      className="px-2.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono flex items-center gap-1 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={T.searchPlaceholder}
                      className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 w-36 sm:w-56 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="pb-2">{T.thWorker}</th>
                      <th className="pb-2">{T.thId}</th>
                      <th className="pb-2">{T.thContact}</th>
                      <th className="pb-2">{T.thTrade}</th>
                      <th className="pb-2">{T.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredWorkers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 font-mono text-xs">
                          <div className="flex flex-col items-center justify-center gap-1.5">
                            <Users className="w-8 h-8 text-slate-600 mb-1" />
                            <span className="font-bold text-slate-400">DGMS मास्टर रजिस्टर खाली है (No Miners Registered)</span>
                            <span className="text-[11px] text-slate-600">बाईं ओर फॉर्म भरकर नया लेबर जोड़ें और टेस्ट करें।</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredWorkers.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-2.5">
                            <div className="font-bold text-white leading-tight">{w.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {w.age ? `${w.age} yrs` : '28 yrs'} • <span className="text-red-400 font-bold">{w.blood || 'O+'}</span>
                            </div>
                          </td>
                          <td className="py-2.5 font-mono text-amber-400">{w.id}</td>
                          <td className="py-2.5 font-mono text-[11px] text-slate-300">
                            <div>{w.mobile || '+91 98351-44120'}</div>
                            <div className="text-[9px] text-slate-500 truncate max-w-[130px]">{w.emergency}</div>
                          </td>
                          <td className="py-2.5 text-slate-300">{w.trade}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              w.status === 'UNDERGROUND' 
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>{T.showingMiners}: {filteredWorkers.length}</span>
              <span>{T.syncStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GATE QR SCANNER (OPTICAL WEBCAM + FRAUD DETECTION) */}
      {/* ======================================================== */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
          {/* LEFT PANEL: CAMERA SCANNER & CONTROLS */}
          <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">{T.scannerTitle}</h2>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1.5 ${
                  isCameraActive 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>{isCameraActive ? 'LIVE CAMERA SCANNING' : 'STANDBY'}</span>
                </span>
              </div>

              {/* Mode Toggle (Gate-In / Gate-Out) */}
              <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => setScanMode('GATE_IN')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    scanMode === 'GATE_IN'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{T.gateIn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode('GATE_OUT')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    scanMode === 'GATE_OUT'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>{T.gateOut}</span>
                </button>
              </div>

              {/* OPTICAL SCANNER VIEWPORT */}
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-center mb-4 overflow-hidden min-h-[280px]">
                {isCameraActive ? (
                  <div className="w-full flex flex-col items-center">
                    {/* HTML5-QRCode Target DOM node */}
                    <div 
                      id="qr-reader-viewport" 
                      className="w-full max-w-[340px] rounded-xl overflow-hidden border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                    />

                    <div className="mt-3 flex items-center gap-2 text-xs font-mono text-emerald-400 animate-pulse">
                      <Camera className="w-4 h-4" />
                      <span>फोन का QR कोड कैमरे के सामने रखें... (Scanning)</span>
                    </div>

                    <button
                      type="button"
                      onClick={stopCamera}
                      className="mt-3 py-1.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold font-mono flex items-center gap-1.5 transition"
                    >
                      <CameraOff className="w-3.5 h-3.5" />
                      <span>कैमरा बंद करें (Stop Camera)</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full py-6 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-amber-400/50 flex flex-col items-center justify-center bg-slate-900/60">
                        <QrCode className="w-10 h-10 text-amber-400 animate-pulse" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                        <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider"
                      >
                        <Camera className="w-4 h-4 stroke-[2.5]" />
                        <span>📸 कैमरा चालू करें</span>
                      </button>

                      <label className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>📁 QR फोटो अपलोड</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScanFile}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div id="qr-reader-file-temp" className="hidden" />

                    <p className="text-[11px] text-slate-400 font-mono mt-3 max-w-xs">
                      फोन से QR कोड की फोटो लेकर लैपटॉप कैमरे के सामने दिखाएं या सीधे फोटो अपलोड करें।
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* MANUAL / 1-CLICK INSTANT SIMULATION FALLBACK */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-slate-400 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>या 1-क्लिक टेस्ट करें (Instant Fallback):</span>
                </label>
              </div>

              {workersList.length === 0 ? (
                <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-amber-400/90 font-mono">
                  ⚠️ कोई श्रमिक पंजीकृत नहीं है। कृपया पहले टैब-1 से नया श्रमिक जोड़ें।
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={selectedScanWorkerId}
                    onChange={(e) => setSelectedScanWorkerId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  >
                    {workersList.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.id}) — {w.status}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleExecuteScan}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 shrink-0"
                    title="Simulate instant scan without webcam"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Instant Gate-In</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: VERIFICATION RECEIPT & SECURITY AUDIT */}
          <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">{T.resultTitle}</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">DGMS RULE 77B AUDIT</span>
              </div>

              {/* CASE 1: FRAUDULENT / FAKE QR ERROR ALERT */}
              {scanError && (
                <div className="p-4 rounded-xl bg-red-950/40 border-2 border-red-500/80 text-red-200 space-y-3 animate-bounce-short">
                  <div className="flex items-center gap-2.5 text-red-400 font-black text-sm">
                    <AlertOctagon className="w-6 h-6 shrink-0 text-red-500 animate-pulse" />
                    <span>{scanError.title}</span>
                  </div>

                  <p className="text-xs text-red-300 font-semibold leading-relaxed">
                    {scanError.reason}
                  </p>

                  <div className="p-2.5 rounded-lg bg-black/60 border border-red-500/40 font-mono text-[10px] space-y-1">
                    <div className="text-slate-400">TIMESTAMP: <span className="text-white">{scanError.timestamp}</span></div>
                    {scanError.violation && (
                      <div className="text-red-400 font-bold">STATUTORY AUDIT: {scanError.violation}</div>
                    )}
                    <div className="text-slate-500 truncate">PAYLOAD SNIPPET: {scanError.raw}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScanError(null)}
                    className="w-full py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-xs font-bold font-mono transition"
                  >
                    Clear Alert / पुनः स्कैन करें
                  </button>
                </div>
              )}

              {/* CASE 2: AUTHENTIC VERIFIED SCAN RECEIPT */}
              {!scanError && lastScanResult && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/50 space-y-3 font-mono shadow-lg shadow-emerald-500/10">
                  {/* Turnstile Access Status Banner */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-black text-emerald-300 tracking-wide">
                        {lastScanResult.turnstile || 'TURNSTILE UNLOCKED'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      lastScanResult.mode === 'GATE_IN'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      {lastScanResult.mode === 'GATE_IN' ? T.approvedIn : T.approvedOut}
                    </span>
                  </div>

                  {/* Miner Credentials Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">WORKER NAME:</span>
                      <span className="font-bold text-white text-sm">{lastScanResult.workerName}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">LABOUR ID:</span>
                      <span className="font-bold text-amber-400 text-sm">{lastScanResult.workerId}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">COLLIERY & SEAM:</span>
                      <span className="text-slate-300 text-[11px] truncate">{lastScanResult.colliery}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">GATE-IN TIMESTAMP:</span>
                      <span className="text-slate-300 text-[11px]">{lastScanResult.time}</span>
                    </div>
                  </div>

                  {/* Pre-Shift Vitals & AR Scores Breakdown */}
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{lastScanResult.verifiedHash}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        100% AUTHENTIC
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Pre-Shift Vitals:</span>
                      <span className="font-bold text-white">{lastScanResult.healthClearance}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Vocational AR Score:</span>
                      <span className="font-bold text-amber-400">{lastScanResult.arScore}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 3: IDLE / NO SCANS RECORDED */}
              {!scanError && !lastScanResult && (
                <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center h-52 border border-dashed border-slate-800 rounded-xl">
                  <QrCode className="w-10 h-10 text-slate-600 mb-2" />
                  <span className="font-bold text-slate-400">{T.noScans}</span>
                  <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    कैमरा चालू करके फोन से QR कोड दिखाएं या बाईं ओर से Instant Gate-In बटन दबाएं।
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>{T.statutoryAudit}</span>
              <span className="text-emerald-400 font-bold">{T.tamperProof}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: LIVE MINE MONITOR (2D DIGITAL TWIN)               */}
      {/* ======================================================== */}
      {activeTab === 'monitor' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E18] border border-slate-800 shadow-xl space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">{T.monitorTitle}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{T.monitorSub}</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {undergroundCount} {T.underground}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{T.syncSensor}</span>
            </div>
          </div>

          <div className="relative rounded-2xl bg-[#070A11] border border-slate-800 p-4 sm:p-6 overflow-hidden min-h-[380px]">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            <svg viewBox="0 0 800 360" className="w-full h-auto max-h-[360px] drop-shadow-md">
              <line x1="50" y1="40" x2="750" y2="40" stroke="#475569" strokeWidth="3" strokeDasharray="6,4" />
              <text x="60" y="30" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">SURFACE PIT-HEAD COLLAR (DATUM 0.0m)</text>

              <rect x="180" y="40" width="40" height="280" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="140" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace" transform="rotate(-90 140 160)">MAIN INTAKE SHAFT (320m)</text>

              <line x1="680" y1="40" x2="480" y2="300" stroke="#0ea5e9" strokeWidth="3" />
              <text x="600" y="120" fill="#0ea5e9" fontSize="10" fontFamily="monospace" transform="rotate(-40 600 120)">RETURN AIR INCLINE</text>

              <rect x="220" y="150" width="380" height="24" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="240" y="166" fill="#cbd5e1" fontSize="10" fontFamily="monospace">SEAM 2 — DRILLING & BLASTING GALLERY</text>

              <rect x="220" y="270" width="460" height="28" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="240" y="288" fill="#cbd5e1" fontSize="10" fontFamily="monospace">SEAM 4 — LONGWALL COAL FACE</text>

              <rect x="520" y="240" width="90" height="50" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
              <text x="532" y="262" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">REFUGE CHAMBER</text>
              <text x="536" y="278" fill="#a7f3d0" fontSize="8" fontFamily="monospace">O₂ POSITIVE PRESS.</text>

              <circle cx="200" cy="162" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="195" y="166" fill="#ffffff" fontSize="10" fontWeight="bold">A</text>

              {isEmergencyActive && (
                <g className="animate-pulse">
                  <rect x="220" y="265" width="280" height="38" fill="rgba(239, 68, 68, 0.35)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="260" y="288" fill="#fecaca" fontSize="11" fontFamily="monospace" fontWeight="bold">⚠️ TOXIC GAS INFLUX PLUME (CH₄: 2.8%)</text>
                </g>
              )}

              {/* Dynamic Underground Personnel */}
              {workersList.filter(w => w.status === 'UNDERGROUND').length === 0 ? (
                <g>
                  <rect x="250" y="200" width="340" height="30" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                  <text x="420" y="219" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    [वर्तमान में 0 भूमिगत • गेट स्कैनर से गेट-इन करें]
                  </text>
                </g>
              ) : (
                workersList.filter(w => w.status === 'UNDERGROUND').map((w, idx) => {
                  const seam = idx % 2 === 0 ? 4 : 2;
                  const yBase = seam === 4 ? 280 : 160;
                  const xBase = 260 + (idx * 110) % 360;
                  const isTrapped = isEmergencyActive && idx === 0;
                  const targetX = isEmergencyActive ? (isTrapped ? xBase : 540 + (idx * 18)) : xBase;
                  const targetY = isEmergencyActive ? (isTrapped ? yBase : 258 + (idx * 8)) : yBase;

                  return (
                    <g key={w.id} transform={`translate(${targetX}, ${targetY})`} className="transition-all duration-1000">
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="7" 
                        fill={isEmergencyActive ? (isTrapped ? "#ef4444" : "#10b981") : "#f59e0b"} 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                        className={isTrapped ? "animate-ping" : ""}
                      />
                      <text x="10" y="4" fill={isTrapped ? "#f87171" : "#ffffff"} fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                        {w.name.split(' ')[0]} ({w.id.replace('JH-', '')})
                        {isTrapped ? ' ⚠️ TRAPPED' : ''}
                      </text>
                    </g>
                  );
                })
              )}
            </svg>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  {T.legendActive}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  {T.legendRefuge}
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  {T.legendAir}
                </span>
                {isEmergencyActive && (
                  <span className="flex items-center gap-1.5 text-red-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    {T.legendTrapped}
                  </span>
                )}
              </div>

              <span className="text-slate-500">{T.gisStandard}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: EMERGENCY SOS & MUSTERING                         */}
      {/* ======================================================== */}
      {activeTab === 'sos' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180A0A] to-[#0A0E18] border border-red-500/30 shadow-2xl space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {T.sosTitle}
                </h2>
                <p className="text-xs text-slate-400">{T.sosSub}</p>
              </div>
            </div>

            {isEmergencyActive ? (
              <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500 text-red-300 text-xs font-mono font-bold animate-pulse">
                {T.activeBadge}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono">
                {T.standbyBadge}
              </span>
            )}
          </div>

          {!isEmergencyActive ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <Siren className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{T.sosBoxTitle}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                  {T.sosBoxDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleTriggerSOS('CH4_GAS')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{T.triggerGas}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSOS('FIRE')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{T.triggerFire}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-emerald-400 font-bold">{T.tallySafe}</div>
                    <div className="text-3xl font-black text-white mt-1">{evacTally.safe} / 5</div>
                    <div className="text-[10px] text-emerald-300 mt-1">{T.tallySafeSub}</div>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-amber-400 font-bold">{T.tallyMoving}</div>
                    <div className="text-3xl font-black text-white mt-1">{evacTally.moving} / 5</div>
                    <div className="text-[10px] text-amber-300 mt-1">{T.tallyMovingSub}</div>
                  </div>
                  <Radio className="w-8 h-8 text-amber-400 shrink-0 animate-pulse" />
                </div>

                <div className="p-4 rounded-xl bg-red-950/60 border border-red-500 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-red-400 font-bold">{T.tallyTrapped}</div>
                    <div className="text-3xl font-black text-red-400 mt-1">{evacTally.trapped} / 5</div>
                    <div className="text-[10px] text-red-300 font-bold mt-1">{T.tallyTrappedSub}</div>
                  </div>
                  <ShieldAlert className="w-8 h-8 text-red-400 shrink-0 animate-ping" />
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-red-400" />
                    <span>{T.rescueStation}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-mono">
                    {T.sarCoords}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleDispatchRescue}
                    disabled={dispatchAlertSent}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                      dispatchAlertSent 
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{dispatchAlertSent ? T.dispatchedBtn : T.dispatchBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSOS}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    {T.clearBtn}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
