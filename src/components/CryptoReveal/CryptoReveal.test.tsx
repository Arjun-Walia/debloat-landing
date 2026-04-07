import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import CryptoReveal from './CryptoReveal';

// Mock framer-motion's useInView
vi.mock('framer-motion', () => ({
  useInView: vi.fn(),
  motion: {
    span: 'span',
    div: 'div',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
  },
}));

import { useInView } from 'framer-motion';

describe('CryptoReveal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders with initially scrambled text when not in view', () => {
    (useInView as any).mockReturnValue(false);

    const testText = 'Hello World';
    render(<CryptoReveal text={testText} />);

    // Should render scrambled text of the same length
    const element = screen.getByText((content, element) => {
      return content.length === testText.length && content !== testText;
    });

    expect(element).toBeInTheDocument();

    // Check it only contains hex chars
    expect(element.textContent).toMatch(/^[0-9A-F]+$/);
  });

  it('scrambles and eventually reveals the text when in view', () => {
    (useInView as any).mockReturnValue(true);

    const testText = 'Hello World';
    const duration = 800; // Default duration
    const scrambleSpeed = 30; // ms per iteration

    render(<CryptoReveal text={testText} duration={duration} />);

    // Initially should be completely scrambled
    const element = screen.getByText((content) => {
        return content.length === testText.length;
    });
    const initialText = element.textContent;

    // Advance by some iterations
    act(() => {
      vi.advanceTimersByTime(duration / 2);
    });

    // Should be partially revealed
    expect(element.textContent).not.toBe(initialText);
    expect(element.textContent).not.toBe(testText);

    // Some starting characters should be revealed
    const revealedLength = Math.floor(testText.length * 0.5);
    expect(element.textContent?.startsWith(testText.slice(0, revealedLength))).toBe(true);

    // Advance to the end
    act(() => {
      vi.advanceTimersByTime(duration);
    });

    // Should be fully revealed
    expect(element).toHaveTextContent(testText);
  });

  it('respects the delay prop', () => {
    (useInView as any).mockReturnValue(true);

    const testText = 'Delayed';
    const delay = 500;
    const duration = 300;

    render(<CryptoReveal text={testText} delay={delay} duration={duration} />);

    const element = screen.getByText((content) => {
        return content.length === testText.length;
    });

    const initialText = element.textContent;

    // Advance time but less than delay
    act(() => {
      vi.advanceTimersByTime(delay - 100);
    });

    // Should still be initial scrambled text
    expect(element.textContent).toBe(initialText);

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should start changing
    expect(element.textContent).not.toBe(initialText);

    // Advance to end
    act(() => {
      vi.advanceTimersByTime(duration);
    });

    expect(element).toHaveTextContent(testText);
  });

  it('renders with the correct tag', () => {
    (useInView as any).mockReturnValue(false);

    render(<CryptoReveal text="Test" as="h1" data-testid="crypto-heading" />);

    // We cannot easily target by data-testid since it does not accept standard HTML props in this implementation
    // But we can check if there's an h1
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
