import { render, screen, act } from '@testing-library/react';
import TextType from './TextType';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Create a proper mock IntersectionObserver class
class MockIntersectionObserver {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;

  constructor(callback: IntersectionObserverCallback) {
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    this.unobserve = vi.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.MockIntersectionObserverCallback = callback;
  }
}

describe('TextType Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.IntersectionObserver = MockIntersectionObserver;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.IntersectionObserver.trigger = (entries: IntersectionObserverEntry[]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (window.MockIntersectionObserverCallback) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.MockIntersectionObserverCallback(entries, {} as IntersectionObserver);
      }
    };
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const getContainer = () => {
    return document.querySelector('.text-type__content');
  };

  it('renders without crashing and shows cursor', () => {
    render(<TextType text="Hello World" typingSpeed={10} />);
    const cursor = screen.getByText('|');
    expect(cursor).toBeInTheDocument();
  });

  it('types out the text character by character', () => {
    render(<TextType text="Test" typingSpeed={50} />);

    const content = getContainer();
    expect(content?.textContent).toBe('');

    act(() => { vi.advanceTimersByTime(1); });

    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('T');

    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('Te');

    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('Tes');

    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('Test');
  });

  it('deletes text after pauseDuration', () => {
    render(<TextType text="Hi" typingSpeed={50} pauseDuration={100} deletingSpeed={30} loop={true} />);

    const content = getContainer();

    act(() => { vi.advanceTimersByTime(1); }); // initial delay trigger

    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('Hi');

    // the component triggers the pause timeout logic after the string finishes typing (at index == text.length)
    act(() => { vi.advanceTimersByTime(50); }); // trigger final char condition -> starts pause duration timeout

    // pause timeout
    act(() => { vi.advanceTimersByTime(100); });

    // start deleting (delete character "i")
    act(() => { vi.advanceTimersByTime(30); });
    expect(content?.textContent).toBe('H');

    // delete character "H"
    act(() => { vi.advanceTimersByTime(30); });
    expect(content?.textContent).toBe('');
  });

  it('handles array of texts and loops', () => {
    render(<TextType text={['One', 'Two']} typingSpeed={50} pauseDuration={100} deletingSpeed={30} loop={true} />);

    const content = getContainer();

    act(() => { vi.advanceTimersByTime(1); });

    // Type 'One'
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('One');

    // Trigger pause timeout
    act(() => { vi.advanceTimersByTime(50); });

    // Pause + Delete 'One'
    act(() => { vi.advanceTimersByTime(100); });
    act(() => { vi.advanceTimersByTime(30); }); // 'On'
    act(() => { vi.advanceTimersByTime(30); }); // 'O'
    act(() => { vi.advanceTimersByTime(30); }); // ''
    expect(content?.textContent).toBe('');

    // Trigger pause after string delete
    act(() => { vi.advanceTimersByTime(30); });

    // Pause duration
    act(() => { vi.advanceTimersByTime(100); });

    // Type 'Two'
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('Two');

    // Trigger pause
    act(() => { vi.advanceTimersByTime(50); });

    // Pause + Delete 'Two'
    act(() => { vi.advanceTimersByTime(100); });
    act(() => { vi.advanceTimersByTime(30); });
    act(() => { vi.advanceTimersByTime(30); });
    act(() => { vi.advanceTimersByTime(30); });
    expect(content?.textContent).toBe('');

    // Trigger pause after string delete
    act(() => { vi.advanceTimersByTime(30); });

    // Pause duration
    act(() => { vi.advanceTimersByTime(100); });

    // Type 'One' again
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    expect(content?.textContent).toBe('One');
  });

  it('calls onSentenceComplete callback', () => {
    const mockCallback = vi.fn();
    render(<TextType text={['First', 'Second']} typingSpeed={10} pauseDuration={10} deletingSpeed={10} onSentenceComplete={mockCallback} loop={false} />);

    act(() => { vi.advanceTimersByTime(1); });

    // Type 'First'
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });

    // trigger pause
    act(() => { vi.advanceTimersByTime(10); });

    // Pause duration
    act(() => { vi.advanceTimersByTime(10); });

    // Delete 'First'
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });

    // Delete finishes -> displayed text === '' -> triggers onSentenceComplete
    act(() => { vi.advanceTimersByTime(10); });

    expect(mockCallback).toHaveBeenCalledWith('First', 0);
  });

  it('respects startOnVisible using IntersectionObserver', () => {
    render(<TextType text="Visible" typingSpeed={10} startOnVisible={true} />);

    const content = getContainer();

    // Text should not be typed yet
    act(() => { vi.advanceTimersByTime(100); });
    expect(content?.textContent).toBe('');

    // Simulate visibility
    act(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.IntersectionObserver.trigger([{ isIntersecting: true }]);
    });

    act(() => { vi.advanceTimersByTime(1); });

    // Text should be typed now
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    act(() => { vi.advanceTimersByTime(10); });
    expect(content?.textContent).toBe('Visible');
  });

  it('hides cursor while typing when hideCursorWhileTyping is true', () => {
    render(<TextType text="Test" typingSpeed={50} hideCursorWhileTyping={true} cursorCharacter="|" />);

    const cursor = screen.getByText('|');

    // Initially, it should be hidden while typing is starting/ongoing
    expect(cursor).toHaveClass('text-type__cursor--hidden');

    act(() => { vi.advanceTimersByTime(1); });

    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });
    act(() => { vi.advanceTimersByTime(50); });

    act(() => { vi.advanceTimersByTime(50); }); // trigger final char condition -> starts pause duration timeout

    // After typing is finished and we enter the pause duration, it shouldn't be typing anymore
    expect(cursor).not.toHaveClass('text-type__cursor--hidden');
  });

  it('respects reverseMode', () => {
    render(<TextType text="Mode" typingSpeed={50} reverseMode={true} />);

    const content = getContainer();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(content?.textContent).toBe('e');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(content?.textContent).toBe('ed');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(content?.textContent).toBe('edo');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(content?.textContent).toBe('edoM');
  });
});
