'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface CryptoRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  delay?: number;
  duration?: number;
}

const HEX_CHARS = '0123456789ABCDEF';
const SCRAMBLE_SPEED = 30; // ms per iteration

function generateRandomHex(length: number): string {
  return Array.from({ length }, () => 
    HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
  ).join('');
}

export default function CryptoReveal({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
  duration = 800,
}: CryptoRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayText, setDisplayText] = useState(generateRandomHex(text.length));
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isInView || revealed) return;

    const timeout = setTimeout(() => {
      const iterations = Math.floor(duration / SCRAMBLE_SPEED);
      let currentIteration = 0;

      const interval = setInterval(() => {
        currentIteration++;
        const progress = currentIteration / iterations;
        const revealedLength = Math.floor(text.length * progress);

        // Build display: revealed characters + scrambled rest
        const revealedPart = text.slice(0, revealedLength);
        const scrambledPart = generateRandomHex(text.length - revealedLength);
        
        setDisplayText(revealedPart + scrambledPart);

        if (currentIteration >= iterations) {
          clearInterval(interval);
          setDisplayText(text);
          setRevealed(true);
        }
      }, SCRAMBLE_SPEED);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay, duration, revealed]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
    >
      {displayText}
    </Tag>
  );
}
