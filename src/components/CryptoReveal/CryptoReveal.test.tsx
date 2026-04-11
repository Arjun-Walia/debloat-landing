import React from 'react';
import { render, screen, act } from '@testing-library/react';
import CryptoReveal from './CryptoReveal';
import { useInView } from 'framer-motion';

// Mock framer-motion's useInView
jest.mock('framer-motion', () => ({
  useInView: jest.fn(),
  motion: {
    div: 'div',
    span: 'span',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
  },
}));

describe('CryptoReveal Component', () => {
  const defaultProps = {
    text: 'Hello World',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useInView as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders scrambled text initially when not in view', () => {
    // Component not in view
    (useInView as jest.Mock).mockReturnValue(false);

    render(<CryptoReveal {...defaultProps} />);
    const element = screen.getByText((content, element) => {
      // It should render exactly text.length characters but not the original text yet
      return element?.tagName.toLowerCase() === 'span' && content.length === defaultProps.text.length && content !== defaultProps.text;
    });

    expect(element).toBeInTheDocument();

    // Original text should not be visible
    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();
  });

  it('reveals the text eventually when in view', () => {
    // Component in view
    (useInView as jest.Mock).mockReturnValue(true);

    render(<CryptoReveal {...defaultProps} delay={0} duration={800} />);

    // Initially scrambled, not fully revealed
    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();

    act(() => {
      // Fast forward past the delay and duration
      jest.advanceTimersByTime(1000);
    });

    // Now it should be fully revealed
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });

  it('uses the provided HTML tag', () => {
    (useInView as jest.Mock).mockReturnValue(false);

    const { container } = render(<CryptoReveal {...defaultProps} as="h1" />);
    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    (useInView as jest.Mock).mockReturnValue(false);

    const { container } = render(<CryptoReveal {...defaultProps} className="text-red-500" />);
    expect(container.firstChild).toHaveClass('text-red-500');
  });

  it('delays the scrambling effect', () => {
    (useInView as jest.Mock).mockReturnValue(true);
    const delay = 500;

    render(<CryptoReveal {...defaultProps} delay={delay} duration={800} />);

    // At t=0, it should be fully scrambled (no real characters except by chance, but definitely not the whole string)
    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();

    act(() => {
      // Fast forward up to delay
      jest.advanceTimersByTime(delay - 10);
    });

    // Should still be completely scrambled
    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();

    act(() => {
      // Fast forward past delay + duration
      jest.advanceTimersByTime(820);
    });

    // Now it should be fully revealed
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });
});
