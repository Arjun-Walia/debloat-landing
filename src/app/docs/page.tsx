'use client';

import { motion } from 'framer-motion';
import { CryptoReveal } from '@/components/CryptoReveal';
import { 
  Zap, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Menu, 
  X,
  Download,
  Usb,
  MessageSquare,
  Shield,
  RefreshCw,
  Server,
  Smartphone,
  Bot
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

// Animation variants
const snapIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1] as const, // circOut
    },
  }),
};

// OpenClaw Commands Data
const openclawCommands = [
  { cmd: 'remove facebook', desc: 'Uninstalls Facebook app and clears residual data', risk: 'SAFE' },
  { cmd: 'remove all meta apps', desc: 'Bulk removes Facebook, Instagram, WhatsApp', risk: 'SAFE' },
  { cmd: 'scan for bloatware', desc: 'Analyzes device for manufacturer junk apps', risk: 'SAFE' },
  { cmd: 'what is com.miui.analytics', desc: 'AI explains package purpose and risk level', risk: 'SAFE' },
  { cmd: 'show battery drainers', desc: 'Lists apps consuming excessive power', risk: 'SAFE' },
  { cmd: 'list disabled packages', desc: 'Shows all previously disabled system apps', risk: 'SAFE' },
  { cmd: 'backup everything', desc: 'Creates full package vault before operations', risk: 'SAFE' },
  { cmd: 'restore com.google.gms', desc: 'Reinstates a previously removed package', risk: 'CAUTION' },
  { cmd: 'enable lethal mode', desc: 'Switches from advisory to direct ADB execution', risk: 'DANGER' },
  { cmd: 'nuke xiaomi telemetry', desc: 'Force removes all tracking/analytics packages', risk: 'DANGER' },
];

// Quick Start Steps
const quickStartSteps = [
  { 
    step: '01', 
    title: 'ENABLE_USB_DEBUG', 
    desc: 'Settings → Developer Options → USB Debugging ON',
    cmd: null
  },
  { 
    step: '02', 
    title: 'CONNECT_DEVICE', 
    desc: 'Plug Android phone via USB cable to desktop',
    cmd: null
  },
  { 
    step: '03', 
    title: 'LAUNCH_DEBLOAT', 
    desc: 'Run the Electron app — device auto-detected',
    cmd: 'debloat-ai.exe'
  },
  { 
    step: '04', 
    title: 'ENTER_API_KEY', 
    desc: 'Paste your Perplexity API key for NLP features',
    cmd: null
  },
  { 
    step: '05', 
    title: 'START_CHATTING', 
    desc: 'Type natural language commands to debloat',
    cmd: '> scan for bloatware'
  },
];

// Architecture Stack
const architectureStack = [
  { layer: 'UI', tech: 'ELECTRON_SHELL', desc: 'Cross-platform desktop wrapper', color: '#71A1A1' },
  { layer: 'NLP', tech: 'OPENCLAW_ENGINE', desc: 'Natural language command parser', color: '#D33C34' },
  { layer: 'AI', tech: 'PERPLEXITY_API', desc: 'Package analysis & risk assessment', color: '#f97316' },
  { layer: 'BACKEND', tech: 'PYTHON_CORE', desc: 'ADB command orchestration', color: '#71A1A1' },
  { layer: 'BRIDGE', tech: 'ADB_DAEMON', desc: 'Android Debug Bridge protocol', color: '#D33C34' },
  { layer: 'TARGET', tech: 'ANDROID_DEVICE', desc: 'Connected phone via USB', color: '#f97316' },
];

// Sidebar Navigation
const sidebarNav = [
  { id: 'quick-start', label: 'QUICK_START', num: '01' },
  { id: 'openclaw-cmd', label: 'OPENCLAW_CMD', num: '02' },
  { id: 'architecture', label: 'ARCHITECTURE', num: '03' },
  { id: 'safety', label: 'SAFETY_GUIDE', num: '04' },
];

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

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('quick-start');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Click sound
  const playClickSound = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRl4AAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YToAAAAAAAAAAAAAAAAAAAAAAAA=');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarNav.map(nav => document.getElementById(nav.id));
      const scrollPos = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(sidebarNav[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] overflow-x-hidden">
      <HUDCursor />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-brutal">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-center border-b border-[#1a1a1a]">
            {/* Logo */}
            <a href="/" className="flex items-center gap-4 px-6 py-4 border-r border-[#1a1a1a] hover:bg-[#050505] transition-colors">
              <div className="w-8 h-8 bg-[#D33C34] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#030303]" />
              </div>
              <span className="font-mono text-white text-sm font-bold tracking-tight">DEBLOAT_AI</span>
            </a>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center">
              <a href="/#features" className="docs-nav-link px-6 py-4 border-r border-[#1a1a1a] text-[#555] hover:text-[#D33C34] hover:bg-[#050505] transition-all duration-100 font-mono text-xs tracking-widest">
                FEATURES
              </a>
              <a href="/#system" className="docs-nav-link px-6 py-4 border-r border-[#1a1a1a] text-[#555] hover:text-[#D33C34] hover:bg-[#050505] transition-all duration-100 font-mono text-xs tracking-widest">
                SYSTEM
              </a>
              <span className="px-6 py-4 border-r border-[#1a1a1a] text-[#D33C34] bg-[#050505] font-mono text-xs tracking-widest">
                DOCS
              </span>
              <a href="/#support" className="docs-nav-link px-6 py-4 border-r border-[#1a1a1a] text-[#555] hover:text-[#D33C34] hover:bg-[#050505] transition-all duration-100 font-mono text-xs tracking-widest">
                SUPPORT
              </a>
              <button className="btn-brutal terminal-focus ml-4 mr-6" data-text="DOWNLOAD" onClick={playClickSound}>
                DOWNLOAD
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-4 text-white border-l border-[#1a1a1a]"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 border-r border-[#1a1a1a] bg-[#030303] overflow-y-auto">
          <div className="p-6">
            <span className="label-mono text-[#D33C34] block mb-6">DOCUMENTATION</span>
            <nav className="space-y-1">
              {sidebarNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={playClickSound}
                  className={`docs-sidebar-link block px-4 py-3 border border-[#1a1a1a] font-mono text-xs tracking-wide transition-all duration-100 ${
                    activeSection === item.id 
                      ? 'bg-[#D33C34] text-[#030303] border-[#D33C34]' 
                      : 'text-[#555] hover:text-white hover:bg-[#050505] hover:border-[#333]'
                  }`}
                >
                  <span className="text-[#71A1A1] mr-2">{item.num}.</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Status Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-2">
              <span className="status-dot" />
              <span className="status-healthy text-[10px]">DOCS_v3.1.0</span>
            </div>
            <div className="hex-display text-[8px] break-all">
              0x4445424C4F41545F4149
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 lg:ml-64">
          {/* Header Banner */}
          <div className="border-b border-[#1a1a1a] bg-[#050505]">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="label-mono text-[#71A1A1] block mb-4"
              >
                REFERENCE_MANUAL
              </motion.span>
              <h1 className="font-mono text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                <CryptoReveal text="DEBLOAT_AI" as="span" className="block" duration={600} />
                <CryptoReveal text="DOCUMENTATION" as="span" className="block text-[#D33C34]" delay={200} duration={700} />
              </h1>
              <p className="text-[#555] font-mono text-sm max-w-xl">
                Complete reference for OpenClaw natural language commands, 
                system architecture, and safety guidelines.
              </p>
            </div>
          </div>

          {/* ========================================
              QUICK START SECTION
              ======================================== */}
          <section id="quick-start" className="border-b border-[#1a1a1a]">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
              <div className="mb-8">
                <span className="label-mono text-[#D33C34] block mb-2">01.</span>
                <h2 className="font-mono text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  <CryptoReveal text="QUICK_START" as="span" duration={500} />
                </h2>
              </div>

              <div className="grid gap-4">
                {quickStartSteps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={snapIn}
                    custom={i}
                    className="docs-card scanline-sweep border border-[#1a1a1a] bg-[#030303] hover:border-[#333] transition-colors"
                  >
                    <div className="flex items-start gap-6 p-6">
                      <div className="w-12 h-12 bg-[#D33C34] flex items-center justify-center flex-shrink-0">
                        <span className="font-mono text-lg font-bold text-[#030303]">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-mono text-base font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-[#555] font-mono text-sm mb-2">{step.desc}</p>
                        {step.cmd && (
                          <code className="inline-block bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-1 font-mono text-xs text-[#71A1A1]">
                            {step.cmd}
                          </code>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================
              OPENCLAW COMMANDS SECTION
              ======================================== */}
          <section id="openclaw-cmd" className="border-b border-[#1a1a1a]">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
              <div className="mb-8">
                <span className="label-mono text-[#D33C34] block mb-2">02.</span>
                <h2 className="font-mono text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  <CryptoReveal text="OPENCLAW_COMMANDS" as="span" duration={500} />
                </h2>
                <p className="text-[#555] font-mono text-sm mt-4 max-w-xl">
                  Natural language commands processed by the OpenClaw NLP engine. 
                  Type these directly into the chat interface.
                </p>
              </div>

              {/* Terminal-style Table */}
              <div className="border border-[#1a1a1a] bg-[#030303]">
                {/* Table Header */}
                <div className="grid grid-cols-12 border-b border-[#1a1a1a] bg-[#050505]">
                  <div className="col-span-4 px-4 py-3 border-r border-[#1a1a1a]">
                    <span className="label-mono text-[#71A1A1]">COMMAND</span>
                  </div>
                  <div className="col-span-6 px-4 py-3 border-r border-[#1a1a1a]">
                    <span className="label-mono text-[#71A1A1]">DESCRIPTION</span>
                  </div>
                  <div className="col-span-2 px-4 py-3">
                    <span className="label-mono text-[#71A1A1]">RISK</span>
                  </div>
                </div>

                {/* Table Rows */}
                {openclawCommands.map((cmd, i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-20px' }}
                    variants={snapIn}
                    custom={i * 0.5}
                    className="docs-table-row grid grid-cols-12 border-b border-[#1a1a1a] last:border-b-0 hover:bg-[#050505] transition-colors cursor-pointer"
                  >
                    <div className="col-span-4 px-4 py-4 border-r border-[#1a1a1a]">
                      <code className="font-mono text-xs text-[#D33C34]">&gt; {cmd.cmd}</code>
                    </div>
                    <div className="col-span-6 px-4 py-4 border-r border-[#1a1a1a]">
                      <span className="font-mono text-xs text-[#888]">{cmd.desc}</span>
                    </div>
                    <div className="col-span-2 px-4 py-4">
                      <span className={`font-mono text-[10px] font-bold ${
                        cmd.risk === 'SAFE' ? 'text-[#71A1A1]' :
                        cmd.risk === 'CAUTION' ? 'text-[#f97316]' :
                        'text-[#D33C34]'
                      }`}>
                        {cmd.risk}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Command Categories Legend */}
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#71A1A1]" />
                  <span className="font-mono text-[10px] text-[#555]">SAFE — No system impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#f97316]" />
                  <span className="font-mono text-[10px] text-[#555]">CAUTION — Review before executing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#D33C34]" />
                  <span className="font-mono text-[10px] text-[#555]">DANGER — Destructive operation</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================
              ARCHITECTURE SECTION
              ======================================== */}
          <section id="architecture" className="border-b border-[#1a1a1a]">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
              <div className="mb-8">
                <span className="label-mono text-[#D33C34] block mb-2">03.</span>
                <h2 className="font-mono text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  <CryptoReveal text="ARCHITECTURE" as="span" duration={500} />
                </h2>
                <p className="text-[#555] font-mono text-sm mt-4 max-w-xl">
                  System stack from user interface to Android device.
                  Each layer handles a specific responsibility in the pipeline.
                </p>
              </div>

              {/* Architecture Grid */}
              <div className="grid gap-2">
                {architectureStack.map((layer, i) => (
                  <motion.div
                    key={layer.layer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={snapIn}
                    custom={i}
                    className="docs-arch-card scanline-sweep border border-[#1a1a1a] bg-[#030303] hover:border-[#333] transition-colors"
                  >
                    <div className="grid grid-cols-12">
                      <div className="col-span-2 px-4 py-4 border-r border-[#1a1a1a] flex items-center">
                        <span className="font-mono text-[10px] text-[#555]">{layer.layer}</span>
                      </div>
                      <div className="col-span-4 px-4 py-4 border-r border-[#1a1a1a]">
                        <span className="font-mono text-sm font-bold" style={{ color: layer.color }}>
                          {layer.tech}
                        </span>
                      </div>
                      <div className="col-span-6 px-4 py-4 flex items-center">
                        <span className="font-mono text-xs text-[#555]">{layer.desc}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Data Flow Diagram */}
              <div className="mt-8 border border-[#1a1a1a] p-6 bg-[#050505]">
                <span className="label-mono text-[#71A1A1] block mb-4">DATA_FLOW</span>
                <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
                  <span className="text-white">USER_INPUT</span>
                  <ArrowRight className="w-4 h-4 text-[#333]" />
                  <span className="text-[#71A1A1]">ELECTRON</span>
                  <ArrowRight className="w-4 h-4 text-[#333]" />
                  <span className="text-[#D33C34]">OPENCLAW</span>
                  <ArrowRight className="w-4 h-4 text-[#333]" />
                  <span className="text-[#f97316]">PERPLEXITY</span>
                  <ArrowRight className="w-4 h-4 text-[#333]" />
                  <span className="text-[#71A1A1]">PYTHON</span>
                  <ArrowRight className="w-4 h-4 text-[#333]" />
                  <span className="text-[#D33C34]">ADB</span>
                  <ArrowRight className="w-4 h-4 text-[#333]" />
                  <span className="text-[#f97316]">ANDROID</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================
              SAFETY GUIDE SECTION
              ======================================== */}
          <section id="safety" className="border-b border-[#1a1a1a]">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
              <div className="mb-8">
                <span className="label-mono text-[#D33C34] block mb-2">04.</span>
                <h2 className="font-mono text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  <CryptoReveal text="SAFETY_GUIDE" as="span" duration={500} />
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Do's */}
                <div className="docs-card scanline-sweep border border-[#71A1A1] bg-[#030303] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-[#71A1A1]" />
                    <span className="font-mono text-sm font-bold text-[#71A1A1]">RECOMMENDED</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Always backup before removing packages',
                      'Start with ADVISORY mode first',
                      'Check AI risk assessment before action',
                      'Keep Google Play Services enabled',
                      'Test device after each removal batch'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#71A1A1] font-mono text-xs">+</span>
                        <span className="font-mono text-xs text-[#888]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="docs-card scanline-sweep border border-[#D33C34] bg-[#030303] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-[#D33C34]" />
                    <span className="font-mono text-sm font-bold text-[#D33C34]">AVOID</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Never remove system UI packages',
                      'Don\'t disable core telephony services',
                      'Avoid removing unknown packages blindly',
                      'Don\'t use LETHAL mode on first run',
                      'Never unplug USB during operations'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#D33C34] font-mono text-xs">-</span>
                        <span className="font-mono text-xs text-[#888]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-[#1a1a1a] py-8">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#D33C34] flex items-center justify-center">
                    <Zap className="w-3 h-3 text-[#030303]" />
                  </div>
                  <span className="font-mono text-xs text-[#555]">DEBLOAT_AI // DOCUMENTATION v3.1.0</span>
                </div>
                <div className="flex gap-6">
                  <a href="/" className="font-mono text-xs text-[#555] hover:text-[#D33C34] transition-colors">HOME</a>
                  <a href="/#features" className="font-mono text-xs text-[#555] hover:text-[#D33C34] transition-colors">FEATURES</a>
                  <a href="/#support" className="font-mono text-xs text-[#555] hover:text-[#D33C34] transition-colors">SUPPORT</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed inset-0 z-40 bg-[#030303]/95"
          onClick={() => setMobileNavOpen(false)}
        >
          <div className="p-6 pt-20">
            <nav className="space-y-2">
              {sidebarNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => { setMobileNavOpen(false); playClickSound(); }}
                  className="docs-sidebar-link block px-4 py-4 border border-[#1a1a1a] font-mono text-sm tracking-wide text-[#555] hover:text-white hover:bg-[#050505]"
                >
                  <span className="text-[#71A1A1] mr-2">{item.num}.</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </main>
  );
}
