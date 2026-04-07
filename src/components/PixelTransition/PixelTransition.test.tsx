import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PixelTransition from './PixelTransition';
import { gsap } from 'gsap';

// Mock gsap
jest.mock('gsap', () => {
  const mockKillTweensOf = jest.fn();
  const mockSet = jest.fn();
  const mockTo = jest.fn();
  const mockDelayedCall = jest.fn((delay, callback) => {
    // Return a mock tween object with a kill method
    return {
      kill: jest.fn()
    };
  });

  return {
    gsap: {
      killTweensOf: mockKillTweensOf,
      set: mockSet,
      to: mockTo,
      delayedCall: mockDelayedCall,
      core: {
        Tween: class {}
      }
    }
  };
});

describe('PixelTransition', () => {
  let originalTouchStart: any;
  let originalMaxTouchPoints: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Save originals
    originalTouchStart = (window as any).ontouchstart;
    originalMaxTouchPoints = navigator.maxTouchPoints;

    // Reset touch variables to false defaults
    delete (window as any).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });

    // Reset matchMedia mock to default (non-touch)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
      })),
    });
  });

  afterEach(() => {
    // Restore originals
    if (originalTouchStart !== undefined) {
      (window as any).ontouchstart = originalTouchStart;
    }
    Object.defineProperty(navigator, 'maxTouchPoints', { value: originalMaxTouchPoints, configurable: true });
  })

  const defaultProps = {
    firstContent: <div data-testid="first-content">First</div>,
    secondContent: <div data-testid="second-content">Second</div>,
  };

  it('renders first and second content', () => {
    render(<PixelTransition {...defaultProps} />);
    expect(screen.getByTestId('first-content')).toBeInTheDocument();
    expect(screen.getByTestId('second-content')).toBeInTheDocument();
  });

  it('generates the correct number of pixel grid elements', () => {
    const { container } = render(<PixelTransition {...defaultProps} gridSize={5} />);
    // 5x5 grid = 25 pixels
    const pixels = container.querySelectorAll('.pixelated-image-card__pixel');
    expect(pixels.length).toBe(25);
  });

  it('triggers animation on mouse enter and leave (non-touch device)', () => {
    const { container } = render(<PixelTransition {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    // Trigger enter
    fireEvent.mouseEnter(card);
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalledTimes(2);

    jest.clearAllMocks();

    // Trigger leave
    fireEvent.mouseLeave(card);
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalledTimes(2);
  });

  it('handles focus and blur events for accessibility', () => {
    const { container } = render(<PixelTransition {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    // Trigger focus
    fireEvent.focus(card);
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalledTimes(2);

    jest.clearAllMocks();

    // Trigger blur
    fireEvent.blur(card);
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalledTimes(2);
  });

  it('handles touch events on touch devices', () => {
    // Mock matchMedia to simulate a touch device before rendering
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true, // is a touch device
      })),
    });

    const { container } = render(<PixelTransition {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    // Mouse events should NOT trigger animations on touch devices
    fireEvent.mouseEnter(card);
    expect(gsap.set).not.toHaveBeenCalled();

    // Click should trigger animation on touch devices
    fireEvent.click(card);
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalledTimes(2);

    jest.clearAllMocks();

    // Second click should trigger reverse animation
    fireEvent.click(card);
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalledTimes(2);
  });

  it('respects the "once" prop', () => {
    const { container } = render(<PixelTransition {...defaultProps} once={true} />);
    const card = container.firstChild as HTMLElement;

    // First enter triggers animation
    fireEvent.mouseEnter(card);
    expect(gsap.set).toHaveBeenCalled();

    jest.clearAllMocks();

    // Leave should NOT trigger reverse animation if once is true
    fireEvent.mouseLeave(card);
    expect(gsap.set).not.toHaveBeenCalled();
  });

  it('applies custom className and style', () => {
    const { container } = render(
      <PixelTransition
        {...defaultProps}
        className="custom-class"
        style={{ margin: '10px' }}
      />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('pixelated-image-card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveStyle('margin: 10px');
  });

  it('cleans up previous animations when re-triggered', () => {
    const mockKill = jest.fn();
    (gsap.delayedCall as jest.Mock).mockImplementation(() => ({
      kill: mockKill
    }));

    const { container } = render(<PixelTransition {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    // First enter
    fireEvent.mouseEnter(card);

    // Second enter (or leave) quickly before first completes
    fireEvent.mouseLeave(card);

    // Expect the delayedCall kill method to have been called and the gsap.killTweensOf
    expect(gsap.killTweensOf).toHaveBeenCalled();
    expect(mockKill).toHaveBeenCalled();
  });

  it('updates the active state after the delay', () => {
    jest.useFakeTimers();
    let delayedCallback: Function | null = null;

    (gsap.delayedCall as jest.Mock).mockImplementation((delay, callback) => {
      delayedCallback = callback;
      return { kill: jest.fn() };
    });

    const { container } = render(<PixelTransition {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    // The active element initially should have aria-hidden=true
    const activeContainer = container.querySelector('.pixelated-image-card__active');
    expect(activeContainer).toHaveAttribute('aria-hidden', 'true');

    act(() => {
      fireEvent.mouseEnter(card);
    });

    // We manually invoke the callback that gsap.delayedCall would have executed
    if (delayedCallback) {
      act(() => {
        (delayedCallback as Function)();
      });
    }

    // Now the active container should be visible and aria-hidden should be false (because isActive is true)
    // Actually, aria-hidden is tied to the state 'isActive' which is set synchronously in animatePixels
    expect(activeContainer).toHaveAttribute('aria-hidden', 'false');

    jest.useRealTimers();
  });
});