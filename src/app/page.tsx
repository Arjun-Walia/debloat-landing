"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TextType } from "@/components/TextType";
import { PixelTransition } from "@/components/PixelTransition";
import { CryptoReveal } from "@/components/CryptoReveal";
import { 
  Zap, 
  Shield, 
  Cpu, 
  Trash2, 
  MessageSquare, 
  Lock, 
  RefreshCw, 
  Terminal,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  Usb,
  Bot,
  Server,
  MonitorSmartphone,
  Github,
  Star,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// Boot sequence messages
const bootMessages = [
  "INITIALIZING ADB DAEMON v3.1.0...",
  "LOADING OPENCLAW NLP ENGINE... OK",
  "ESTABLISHING PERPLEXITY API LINK... OK",
  "SCANNING USB DEVICES... OK",
  "ANDROID DEVICE DETECTED... OK",
  "LOADING PACKAGE DATABASE... OK",
  "INITIALIZING CHAT INTERFACE... OK",
  "AWAITING COMMAND.",
];

// Boot Sequence Component
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < bootMessages.length) {
        setMessages(prev => [...prev, bootMessages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowFlash(true);
          setTimeout(() => {
            onComplete();
          }, 50);
        }, 300);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <>
      <div className="boot-screen">
        <div className="max-w-2xl">
          {messages.map((msg, i) => (
            <div key={i} className="boot-text">{msg}</div>
          ))}
          <span className="boot-text animate-pulse">█</span>
        </div>
      </div>
      {showFlash && <div className="boot-flash" />}
    </>
  );
}

// Custom HUD Cursor Component
function HUDCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.brutal-cell') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`crosshair ${isHovering ? 'hover' : ''}`}
    >
      {!isHovering && (
        <>
          <div className="crosshair-line crosshair-h" />
          <div className="crosshair-line crosshair-v" />
        </>
      )}
    </div>
  );
}

// Marquee Ticker Component
function MarqueeTicker() {
  const text = "> remove facebook and instagram // > scan for tracking apps // > what is com.miui.analytics // > backup everything // > list disabled packages // > show system bloat on Pixel 7 // ";
  
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span className="marquee-text">{text}{text}</span>
      </div>
    </div>
  );
}

// BRUTAL Animation variants - Fast & Snappy
const snapIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "circOut" as const,
    },
  }),
};

const slideSnap = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "circOut" as const,
    },
  },
};

// Feature data
const features = [
  { id: "001", icon: MessageSquare, title: "NATURAL_LANGUAGE", desc: "Type commands like 'remove facebook' — no manual package hunting", hoverInfo: "Examples: 'remove all meta apps', 'what does this package do?', 'show battery drainers'", hasToggle: false },
  { id: "002", icon: Shield, title: "AI_SAFETY_ANALYSIS", desc: "Perplexity rates package risk levels before you nuke anything", hoverInfo: "Risk levels: SAFE / CAUTION / DANGER — AI explains what breaks if removed", hasToggle: false },
  { id: "003", icon: Zap, title: "ACTION_MODE", desc: "Toggle between Advisor Mode and direct ADB execution", hoverInfo: "Advisor = suggestions only. Lethal = executes ADB commands directly", hasToggle: true },
  { id: "004", icon: Lock, title: "SMART_BACKUP", desc: "Creates secure package vaults before destructive ops", hoverInfo: "Auto-restore available. Backups stored in /debloat/vaults/ with timestamps", hasToggle: false },
  { id: "005", icon: MonitorSmartphone, title: "CROSS_PLATFORM", desc: "Electron shell runs on Windows, Mac, and Linux", hoverInfo: "Same UI everywhere. ADB drivers bundled. No manual setup required", hasToggle: false },
  { id: "006", icon: Usb, title: "REALTIME_ADB", desc: "Auto-detects any connected Android device over USB", hoverInfo: "Plug in any Android. USB debugging required. Works with all manufacturers", hasToggle: false },
];

// Simulated hex data stream
const generateHexLine = () => {
  const chars = "0123456789ABCDEF";
  return Array(32).fill(0).map(() => chars[Math.floor(Math.random() * 16)]).join("");
};

// Data stream component
function DataStream() {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const initial = Array(8).fill(0).map(() => generateHexLine());
    setLines(initial);
    
    const interval = setInterval(() => {
      setLines(prev => [...prev.slice(1), generateHexLine()]);
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="hex-display overflow-hidden h-full">
      {lines.map((line, i) => (
        <div key={i} className="opacity-30">{line}</div>
      ))}
    </div>
  );
}

// Chat messages for terminal
const chatMessages = [
  { role: "USER", text: "> scan for bloatware" },
  { role: "SYSTEM", text: "Analyzing connected device (Pixel 7)..." },
  { role: "AI", text: "Found 12 tracking apps and 4 manufacturer bloatware packages. Action Mode is ON. Awaiting confirmation to purge." },
  { role: "USER", text: "> what is com.miui.analytics" },
  { role: "AI", text: "Xiaomi telemetry service. Risk: HIGH. Sends device usage data to Chinese servers. Safe to remove on non-MIUI ROMs." },
  { role: "USER", text: "> remove it" },
  { role: "SYSTEM", text: "Executing: adb shell pm uninstall -k --user 0 com.miui.analytics" },
  { role: "AI", text: "Package disabled successfully. Backup created at /debloat/vaults/2026-02-28/" },
];

// Chat Terminal Component
function ChatTerminal() {
  const [visibleMessages, setVisibleMessages] = useState<typeof chatMessages>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < chatMessages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, chatMessages[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? 500 : 1200);
      return () => clearTimeout(timer);
    } else {
      // Loop back
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex]);
  
  return (
    <div className="font-mono text-sm space-y-3 h-[280px] overflow-hidden">
      {visibleMessages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex gap-3"
        >
          <span className={`flex-shrink-0 font-bold ${
            msg.role === "USER" ? "text-[#71A1A1]" : 
            msg.role === "SYSTEM" ? "text-[#f97316]" : 
            "text-[#D33C34]"
          }`}>
            {msg.role}
          </span>
          <span className="text-[#888]">{msg.text}</span>
        </motion.div>
      ))}
      <span className="text-[#71A1A1] animate-pulse">█</span>
    </div>
  );
}

// Action Mode Toggle Component
function ActionModeToggle({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <div className="mt-4">
      <button 
        onClick={onToggle}
        className={`relative w-14 h-7 border transition-all duration-200 ${
          isOn ? 'border-[#D33C34] bg-[#D33C34]/20' : 'border-[#333] bg-[#111]'
        }`}
      >
        <div className={`absolute top-1 w-5 h-5 transition-all duration-200 ${
          isOn ? 'left-7 bg-[#D33C34]' : 'left-1 bg-[#333]'
        }`} />
      </button>
      <div className={`mt-2 font-mono text-xs transition-colors duration-200 ${
        isOn ? 'text-[#D33C34]' : 'text-[#555]'
      }`}>
        {isOn 
          ? 'MODE: LETHAL // READY TO PURGE PACKAGES' 
          : 'MODE: ADVISORY_ONLY // NO SYSTEM CHANGES'
        }
      </div>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBooted, setIsBooted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [actionModeOn, setActionModeOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Boot sequence completion handler
  const handleBootComplete = useCallback(() => {
    setIsBooted(true);
  }, []);

  // Initialize click audio
  useEffect(() => {
    // Create audio element for click sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToFAACAf4B/gH+Af4B/gH9+gH+Bfn+Af39/gYB/f4CAf3+AgH9/gIB/f4CAf3+AgICAfn+BgH5/gYB+f4KAfX+CgH1/g4B8foSAe36FgHt9hoB6fYeAeX2IgHh9iYB3fYqAdn2LgHV9jIB0fY2Ac32OgHJ9j4BxfZCAcH2RgG99koBuffKAb33ygG598oBvffGAcH3wgHF974ByfO6Ac3ztgHR87IB1fOuAeHzpgHl86IB6fOeAfHzmgH185YB+fOSAgHzjgIF844CDfOKAhXzhgIZ84ICIfN+AinzegIt83YCNfNyAjnzbgJB82oCRfNmAk3zYgJR814CWfNaAmHzVgJl81ICbfNOAnHzSgJ5814CffNeAoHzWgKF81oCjfNWApHzVgKZ81ICnfNSAqXzTgKp804CsfNKArXzSgK5804CwfNKAsXzSgLN80oC0fNKAtnzSgLd80oC5fNKAunzSgLx80oC9fNKAv3zSgMF80oDCfNKAxHzSgMV80oDHfNKAyHzSgMl80oDKfNKAy3zTgM180oDOfNOA0HzTgNF804DTfNOA1XzTgNZ804DXfNOA2XzTgNp804DbfNOA3XzUgN5814DgfNeA4nzXgON814DlfNiA5nzZgOd82oDofNuA6XzcgOp83YDtfN6A7nzfgO9844DxfOSA83zmgPV86ID3fOqA+XzsgPt87oD9fPCA/Xz');
  }, []);

  // Play click sound
  const playClickSound = () => {
    if (hasInteracted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  };

  // Track user interaction for audio
  useEffect(() => {
    const handleInteraction = () => setHasInteracted(true);
    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  return (
    <>
      {/* Boot Sequence */}
      <AnimatePresence>
        {!isBooted && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* Custom HUD Cursor */}
      {isBooted && <HUDCursor />}

      <main className={`min-h-screen bg-[#030303] overflow-x-hidden ${isBooted ? 'cursor-hud' : ''}`}>
      {/* Navigation - Brutal, No Blur */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 nav-brutal"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2, ease: "circOut" }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-center border-b border-[#1a1a1a]">
            {/* Logo */}
            <div className="flex items-center gap-4 px-6 py-4 border-r border-[#1a1a1a]">
              <div className="w-8 h-8 bg-[#D33C34] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#030303]" />
              </div>
              <span className="font-mono text-white text-sm font-bold tracking-tight">DEBLOAT_AI</span>
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center">
              {["FEATURES", "SYSTEM", "SUPPORT"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="docs-nav-link px-6 py-4 border-r border-[#1a1a1a] text-[#555] hover:text-[#D33C34] hover:bg-[#050505] transition-all duration-100 font-mono text-xs tracking-widest"
                >
                  {item}
                </a>
              ))}
              <a 
                href="/docs"
                className="docs-nav-link px-6 py-4 border-r border-[#1a1a1a] text-[#555] hover:text-[#D33C34] hover:bg-[#050505] transition-all duration-100 font-mono text-xs tracking-widest"
              >
                DOCS
              </a>
              <button className="btn-brutal terminal-focus ml-4 mr-6" data-text="DOWNLOAD" onClick={playClickSound}>
                DOWNLOAD
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-4 text-white border-l border-[#1a1a1a]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-[#030303] border-b border-[#1a1a1a]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.15 }}
          >
            {["FEATURES", "SYSTEM", "SUPPORT"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="block px-6 py-4 border-b border-[#1a1a1a] text-[#555] hover:text-[#D33C34] font-mono text-xs tracking-widest"
              >
                {item}
              </a>
            ))}
            <a 
              href="/docs"
              className="block px-6 py-4 border-b border-[#1a1a1a] text-[#555] hover:text-[#D33C34] font-mono text-xs tracking-widest"
            >
              DOCS
            </a>
            <div className="p-6">
              <button className="btn-brutal w-full" data-text="DOWNLOAD" onClick={playClickSound}>DOWNLOAD</button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ========================================
          HERO SECTION - COMPACT VIEWPORT FIT
          ======================================== */}
      <section className="h-screen pt-16 relative overflow-hidden">
        {/* Background Grid */}
        <div className="hero-grid-bg" />
        
        <div className="max-w-[1440px] mx-auto h-full relative">
          {/* Status Bar */}
          <div className="border-b border-[#1a1a1a] flex">
            <div className="px-4 py-2 border-r border-[#1a1a1a] flex items-center gap-2">
              <span className="status-dot" />
              <span className="status-healthy">ADB_CONNECTED</span>
            </div>
            <div className="px-4 py-2 border-r border-[#1a1a1a] flex items-center gap-2">
              <Smartphone className="w-3 h-3 text-[#71A1A1]" />
              <span className="terminal-text">PIXEL_7</span>
            </div>
            <div className="px-4 py-2 border-r border-[#1a1a1a] flex items-center gap-2">
              <Bot className="w-3 h-3 text-[#D33C34]" />
              <span className="terminal-text">PERPLEXITY_ONLINE</span>
            </div>
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="terminal-text">v3.1.0</span>
            </div>
          </div>

          {/* Two Column Hero Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100%-40px)]">
            {/* Left - Content */}
            <div className="flex flex-col justify-center p-6 lg:p-12 border-r border-[#1a1a1a]">
              {/* GitHub Badge */}
              <motion.a
                href="https://github.com/abhishek112007/debloat-ai"
                target="_blank"
                rel="noopener noreferrer"
                variants={snapIn}
                custom={0}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-3 border border-[#1a1a1a] px-4 py-2 mb-6 w-fit hover:bg-white hover:text-[#030303] transition-colors duration-100 group"
              >
                <Github className="w-4 h-4" />
                <span className="label-mono group-hover:text-[#030303]">OPEN_SOURCE_REPOSITORY</span>
                <div className="flex items-center gap-1 border-l border-[#1a1a1a] pl-3 group-hover:border-[#030303]">
                  <Star className="w-3 h-3 text-[#f97316]" />
                  <span className="font-mono text-xs text-[#f97316] group-hover:text-[#030303]">1.2K</span>
                </div>
              </motion.a>

              <motion.span 
                variants={snapIn}
                custom={1}
                initial="hidden"
                animate="visible"
                className="label-mono text-[#D33C34] mb-4"
              >
                DESKTOP → ANDROID_VIA_ADB
              </motion.span>

              <motion.div
                variants={snapIn}
                custom={2}
                initial="hidden"
                animate="visible"
              >
                <CryptoReveal
                  text="TALK TO"
                  as="h1"
                  className="font-mono text-5xl lg:text-7xl font-bold text-white mb-1 tracking-tight"
                  duration={600}
                />
              </motion.div>
              
              <motion.div
                variants={snapIn}
                custom={3}
                initial="hidden"
                animate="visible"
              >
                <CryptoReveal
                  text="YOUR PHONE"
                  as="h1"
                  className="font-mono text-5xl lg:text-7xl font-bold text-gradient-brutal mb-6"
                  delay={300}
                  duration={800}
                />
              </motion.div>

              <motion.div
                variants={snapIn}
                custom={4}
                initial="hidden"
                animate="visible"
                className="text-[#555] text-sm lg:text-base max-w-md mb-6 font-mono leading-relaxed min-h-[4rem]"
              >
                <TextType
                  text={[
                    "The first AI-powered Android debloater.",
                    "Connect via USB.",
                    "Chat with Perplexity.",
                    "Nuke bloatware with plain English."
                  ]}
                  typingSpeed={50}
                  pauseDuration={1500}
                  deletingSpeed={30}
                  showCursor
                  cursorCharacter="_"
                  cursorBlinkDuration={0.5}
                  loop
                />
              </motion.div>

              <motion.div
                variants={snapIn}
                custom={5}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <button className="btn-brutal flex items-center justify-center gap-2 group" data-text="STAR_ON_GITHUB" onClick={playClickSound}>
                  <Star className="w-4 h-4" />
                  STAR_ON_GITHUB
                </button>
                <button className="btn-outline-brutal" onClick={playClickSound}>
                  v3.1.0_RELEASE
                </button>
              </motion.div>

              {/* Compact Stats */}
              <motion.div
                variants={snapIn}
                custom={6}
                initial="hidden"
                animate="visible"
                className="flex gap-6 border-t border-[#1a1a1a] pt-6"
              >
                {[
                  { label: "DEVICES", value: "50K+" },
                  { label: "NUKED", value: "2.1M" },
                  { label: "PLATFORMS", value: "3" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="label-mono block">{stat.label}</span>
                    <span className="font-mono text-xl text-white font-bold">{stat.value}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Chat Terminal */}
            <div className="hidden lg:flex flex-col justify-center p-8 relative">
              <motion.div
                variants={snapIn}
                custom={3}
                initial="hidden"
                animate="visible"
                className="border border-[#1a1a1a] bg-[#050505]"
              >
                <div className="border-b border-[#1a1a1a] px-4 py-2 flex items-center gap-4">
                  <Terminal className="w-3 h-3 text-[#D33C34]" />
                  <span className="label-mono">CHAT_TERMINAL</span>
                  <div className="flex gap-2 ml-auto">
                    <span className="w-2 h-2 bg-[#333]" />
                    <span className="w-2 h-2 bg-[#333]" />
                    <span className="w-2 h-2 bg-[#D33C34]" />
                  </div>
                </div>
                <div className="p-6">
                  <ChatTerminal />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Kinetic Marquee Ticker */}
      <MarqueeTicker />

      {/* ========================================
          FEATURES - BRUTALIST GRID TABLE
          ======================================== */}
      <section id="features" className="py-0">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Header */}
          <div className="grid grid-cols-12 border-b border-[#1a1a1a]">
            <div className="col-span-12 md:col-span-4 p-8 border-r border-[#1a1a1a]">
              <span className="label-mono text-[#D33C34] block mb-4">CORE_MODULES</span>
              <h2 className="font-mono text-4xl md:text-5xl font-bold text-white tracking-brutal leading-brutal">
                <CryptoReveal text="FEATURE" as="span" className="block" duration={500} />
                <CryptoReveal text="MATRIX" as="span" className="block" delay={200} duration={500} />
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 p-8 flex items-end">
              <p className="text-[#555] font-mono text-sm max-w-xl">
                Chat-first Android debloater powered by Perplexity AI. 
                Natural language commands over ADB. No manual package hunting.
              </p>
            </div>
          </div>

          {/* Feature Grid - Table Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={snapIn}
                custom={i}
                className={`brutal-cell scanline-sweep cursor-pointer group transition-all duration-200 ${
                  feature.hasToggle && actionModeOn ? 'border-[#D33C34] border-2' : ''
                } ${feature.hasToggle && !actionModeOn ? 'opacity-60' : ''}`}
              >
                <PixelTransition
                  gridSize={12}
                  pixelColor="#D33C34"
                  animationStepDuration={0.6}
                  aspectRatio="55%"
                  style={{ backgroundColor: '#030303' }}
                  firstContent={
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <feature.icon className={`w-5 h-5 ${feature.hasToggle && actionModeOn ? 'text-[#D33C34]' : 'text-[#D33C34]'}`} />
                        <span className="label-mono text-[#333]">{feature.id}</span>
                      </div>
                      <h3 className="font-mono text-base text-white font-bold mb-2 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-[#555] text-xs font-mono flex-grow">
                        {feature.desc}
                      </p>
                      {feature.hasToggle && (
                        <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
                          <ActionModeToggle 
                            isOn={actionModeOn} 
                            onToggle={() => setActionModeOn(!actionModeOn)} 
                          />
                        </div>
                      )}
                    </div>
                  }
                  secondContent={
                    <div className="p-6 h-full flex flex-col bg-[#0a0a0a]">
                      <div className="flex items-start justify-between mb-3">
                        <feature.icon className="w-5 h-5 text-[#D33C34]" />
                        <span className="label-mono text-[#71A1A1]">MORE_INFO</span>
                      </div>
                      <h3 className="font-mono text-base text-white font-bold mb-2 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-[#71A1A1] text-xs font-mono mb-3 leading-relaxed">
                        {feature.hoverInfo}
                      </p>
                      {feature.hasToggle && (
                        <div className="mt-auto relative z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          <ActionModeToggle 
                            isOn={actionModeOn} 
                            onToggle={() => setActionModeOn(!actionModeOn)} 
                          />
                        </div>
                      )}
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ========================================
          APP PREVIEW - FLAT MINIMALIST INTERFACE
          ======================================== */}
      <section id="system" className="py-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12">
            {/* Left - Image */}
            <div className="col-span-12 lg:col-span-7 border-r border-[#1a1a1a] p-8 lg:p-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideSnap}
                className="border border-[#1a1a1a] bg-[#050505]"
              >
                <div className="border-b border-[#1a1a1a] px-4 py-2 flex items-center gap-4">
                  <span className="label-mono">INTERFACE_PREVIEW</span>
                  <div className="flex gap-2 ml-auto">
                    <span className="w-2 h-2 bg-[#333]" />
                    <span className="w-2 h-2 bg-[#333]" />
                    <span className="w-2 h-2 bg-[#D33C34]" />
                  </div>
                </div>
                <div className="p-1">
                  <Image
                    src="/desktop.png"
                    alt="Debloat AI Interface"
                    width={800}
                    height={500}
                    className="w-full"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right - Content */}
            <div className="col-span-12 lg:col-span-5 flex flex-col">
              <div className="p-8 lg:p-12 border-b border-[#1a1a1a]">
                <span className="label-mono text-[#D33C34] block mb-4">ARCHITECTURE</span>
                <h2 className="font-mono text-3xl md:text-4xl font-bold text-white tracking-brutal leading-brutal mb-6">
                  ELECTRON →<br />
                  <span className="text-[#D33C34]">ADB → ANDROID</span>
                </h2>
                <p className="text-[#555] font-mono text-sm leading-relaxed">
                  Desktop shell routes commands through OpenClaw NLP 
                  to Python backend → ADB → your connected device.
                </p>
              </div>

              {/* Feature List */}
              <div className="flex-1">
                {[
                  "Perplexity AI explains every package",
                  "Action Mode for direct ADB execution", 
                  "Automatic backup vaults before removal",
                  "Works with any Android device via USB"
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="px-8 py-4 border-b border-[#1a1a1a] flex items-center gap-4 hover:bg-[#050505] transition-colors duration-100"
                  >
                    <span className="status-dot" />
                    <span className="text-[#71A1A1] font-mono text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-8 lg:p-12">
                <button className="btn-brutal w-full flex items-center justify-center gap-2 group" data-text="GET_STARTED" onClick={playClickSound}>
                  GET_STARTED
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ========================================
          SUPPORT SECTION
          ======================================== */}
      <section id="support" className="py-0">
        <div className="max-w-[1440px] mx-auto">
          {/* API Key Warning Banner */}
          <div className="bg-[#f97316] p-4 flex items-center gap-4">
            <AlertTriangle className="w-5 h-5 text-[#030303] flex-shrink-0" />
            <p className="font-mono text-xs text-[#030303] font-bold">
              WARNING: DEBLOAT_AI REQUIRES A PERPLEXITY API KEY FOR NATURAL LANGUAGE PROCESSING. ADB CORE FUNCTIONS REMAIN AVAILABLE OFFLINE.
            </p>
          </div>

          <div className="grid grid-cols-12">
            {/* Left Content */}
            <div className="col-span-12 lg:col-span-6 p-8 lg:p-16 border-r border-[#1a1a1a]">
              <span className="label-mono text-[#D33C34] block mb-4">COMMUNITY</span>
              <h2 className="font-mono text-4xl md:text-5xl font-bold text-white tracking-brutal leading-brutal mb-8">
                <CryptoReveal text="RECLAIM" as="span" className="block" duration={600} />
                <CryptoReveal text="YOUR PHONE" as="span" className="block" delay={250} duration={700} />
              </h2>
              <p className="text-[#555] font-mono text-sm leading-relaxed mb-8 max-w-md">
                Join Android power users removing manufacturer 
                bloatware and tracking apps. Get support. Share configs.
              </p>

              {/* OS-Specific Download Buttons */}
              <div className="mb-8">
                <span className="label-mono block mb-4">DOWNLOAD_FOR_YOUR_PLATFORM</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="btn-brutal terminal-focus flex-1" data-text="WIN_.EXE" onClick={playClickSound}>
                    WIN .EXE
                  </button>
                  <button className="btn-brutal terminal-focus flex-1" data-text="LINUX_.APPIMAGE" onClick={playClickSound}>
                    LINUX .APPIMAGE
                  </button>
                  <button className="btn-brutal terminal-focus flex-1" data-text="MAC_.DMG" onClick={playClickSound}>
                    MAC .DMG
                  </button>
                </div>
              </div>
              
              <button className="btn-outline-brutal" onClick={playClickSound}>JOIN_DISCORD</button>
            </div>

            {/* Right - Support Cards */}
            <div className="col-span-12 lg:col-span-6">
              {[
                { icon: Terminal, title: "DOCUMENTATION", desc: "ADB commands, package lists, safety guides" },
                { icon: Shield, title: "AI_ASSISTANCE", desc: "Perplexity answers your Android questions" },
                { icon: RefreshCw, title: "REGULAR_UPDATES", desc: "New bloatware signatures and device support" },
              ].map((item, i) => (
                <div 
                  key={item.title}
                  className="brutal-cell p-8 flex items-start gap-6"
                >
                  <item.icon className="w-6 h-6 text-[#D33C34] flex-shrink-0" />
                  <div>
                    <h3 className="font-mono text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-[#555] font-mono text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ========================================
          FOOTER - MINIMAL BRUTAL
          ======================================== */}
      <footer className="py-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 border-b border-[#1a1a1a]">
            {/* Logo */}
            <div className="col-span-12 md:col-span-3 p-8 border-r border-[#1a1a1a]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#D33C34] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#030303]" />
                </div>
                <span className="font-mono text-white text-sm font-bold">DEBLOAT_AI</span>
              </div>
              <p className="text-[#333] font-mono text-xs">
                © 2026 DEBLOAT INC<br />
                ALL RIGHTS RESERVED
              </p>
            </div>

            {/* Links */}
            {[
              { title: "RESOURCES", links: ["Documentation", "Installation", "API", "GitHub"] },
              { title: "COMMUNITY", links: ["Discord", "Twitter", "Reddit", "Blog"] },
              { title: "LEGAL", links: ["Privacy", "Terms", "License", "Security"] },
            ].map((section) => (
              <div key={section.title} className="col-span-6 md:col-span-3 p-8 border-r border-[#1a1a1a] last:border-r-0">
                <span className="label-mono block mb-4">{section.title}</span>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#555] hover:text-[#D33C34] font-mono text-xs transition-colors duration-100">
                        {link.toUpperCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-4">
            <span className="text-[#333] font-mono text-xs">DESKTOP_TO_ANDROID_AI_DEBLOATER</span>
            <div className="flex items-center gap-6">
              {["STATUS", "HELP", "CONTACT"].map((item) => (
                <a key={item} href="#" className="text-[#333] hover:text-white font-mono text-xs transition-colors duration-100">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
