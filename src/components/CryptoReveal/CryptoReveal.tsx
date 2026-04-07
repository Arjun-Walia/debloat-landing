'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface CryptoRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  delay?: number;
  duration?: number;
}

const HEX_CHARS = '0123456789ABCDEF';

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

    let animationFrameId: number;

    const timeout = setTimeout(() => {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const revealedLength = Math.floor(text.length * progress);

        // Build display: revealed characters + scrambled rest
        const revealedPart = text.slice(0, revealedLength);
        const scrambledPart = generateRandomHex(text.length - revealedLength);
        
        setDisplayText(revealedPart + scrambledPart);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          setRevealed(true);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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
