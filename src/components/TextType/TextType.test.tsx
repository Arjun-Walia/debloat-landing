import React from 'react';
import { render, act } from '@testing-library/react';
import TextType from './TextType';

// Mock gsap since it manipulates the DOM in ways JSDOM might struggle with
jest.mock('gsap', () => ({
  gsap: {
    set: jest.fn(),
    to: jest.fn(),
  },
}));

describe('TextType Component', () => {
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    // Mock IntersectionObserver
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      // Store the callback to trigger it manually in tests
      window.__intersectionObserverCallback = callback;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.clearAllMocks();
    delete window.__intersectionObserverCallback;
  });

  it('handles basic typing sequence', async () => {
    render(<TextType text="Hello" startOnVisible={false} initialDelay={100} typingSpeed={50} />);

    // Initially the text content should be empty
    const content = document.querySelector('.text-type__content');
    expect(content).toHaveTextContent('');

    // Wait for initial delay
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    // Should be empty right after initial delay, wait for the first execution loop
    expect(content).toHaveTextContent('');

    // For H: The code has a double queueing effect.
    // It schedules setDisplayedText, and *also* schedules setCurrentCharIndex in a setTimeout
    // Since React state updates happen together, we need to advance the timer

    // So 50ms for "H"
    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    expect(content).toHaveTextContent('H');

    // "e"
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('He');

    // "l"
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('Hel');

    // "l"
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('Hell');

    // "o"
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('Hello');
  });

  it('handles deleting sequence and looping', async () => {
    render(
      <TextType
        text={["Hi", "Yo"]}
        startOnVisible={false}
        initialDelay={0}
        typingSpeed={50}
        pauseDuration={1000}
        deletingSpeed={30}
        loop={true}
      />
    );

    const content = document.querySelector('.text-type__content');

    // To type "Hi" we need 2 letters: wait 50ms for H, 50ms for i
    await act(async () => { jest.advanceTimersByTime(50); });
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('Hi');

    // Pause before delete
    await act(async () => { jest.advanceTimersByTime(1000); });
    expect(content).toHaveTextContent('Hi');

    // Delete "Hi"
    await act(async () => { jest.advanceTimersByTime(30); }); // deletes 'i'
    expect(content).toHaveTextContent('H');

    await act(async () => { jest.advanceTimersByTime(30); }); // deletes 'H'
    expect(content).toHaveTextContent('');

    // After empty, there's a pauseDuration
    await act(async () => { jest.advanceTimersByTime(1000); });

    // Then start typing "Yo"
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('Y');

    await act(async () => { jest.advanceTimersByTime(50); });
    expect(content).toHaveTextContent('Yo');
  });

  it('waits for intersection when startOnVisible is true', async () => {
    render(<TextType text="Hi" startOnVisible={true} initialDelay={0} typingSpeed={50} />);
    const content = document.querySelector('.text-type__content');

    // Time passes, but it shouldn't start typing
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(content).toHaveTextContent('');

    // Trigger intersection
    await act(async () => {
      if (window.__intersectionObserverCallback) {
        window.__intersectionObserverCallback([{ isIntersecting: true }]);
      }
    });

    // Should now type
    await act(async () => { jest.advanceTimersByTime(50); }); // H
    await act(async () => { jest.advanceTimersByTime(50); }); // i
    expect(content).toHaveTextContent('Hi');
  });

  it('processes text in reverse when reverseMode is true', async () => {
    render(<TextType text="Hello" startOnVisible={false} initialDelay={0} typingSpeed={50} reverseMode={true} />);
    const content = document.querySelector('.text-type__content');

    await act(async () => { jest.advanceTimersByTime(50); }); // First letter of reversed "olleH" -> o
    expect(content).toHaveTextContent('o');

    await act(async () => { jest.advanceTimersByTime(50); }); // l
    await act(async () => { jest.advanceTimersByTime(50); }); // l
    await act(async () => { jest.advanceTimersByTime(50); }); // e
    await act(async () => { jest.advanceTimersByTime(50); }); // H
    expect(content).toHaveTextContent('olleH');
  });

  it('calls onSentenceComplete when text finishes typing', async () => {
    const onCompleteMock = jest.fn();
    render(
      <TextType
        text="Hello"
        startOnVisible={false}
        initialDelay={0}
        typingSpeed={50}
        pauseDuration={100}
        deletingSpeed={10}
        onSentenceComplete={onCompleteMock}
      />
    );

    // Type the word (5 chars)
    await act(async () => { jest.advanceTimersByTime(50); }); // H
    await act(async () => { jest.advanceTimersByTime(50); }); // e
    await act(async () => { jest.advanceTimersByTime(50); }); // l
    await act(async () => { jest.advanceTimersByTime(50); }); // l
    await act(async () => { jest.advanceTimersByTime(50); }); // o

    expect(onCompleteMock).not.toHaveBeenCalled();

    // Wait for pause duration
    await act(async () => { jest.advanceTimersByTime(100); });

    // Wait for delete to finish (5 chars)
    await act(async () => { jest.advanceTimersByTime(10); }); // llo
    await act(async () => { jest.advanceTimersByTime(10); }); // ll
    await act(async () => { jest.advanceTimersByTime(10); }); // l
    await act(async () => { jest.advanceTimersByTime(10); }); // e
    await act(async () => { jest.advanceTimersByTime(10); }); // H

    // One more tick to trigger onSentenceComplete
    await act(async () => { jest.advanceTimersByTime(10); });

    expect(onCompleteMock).toHaveBeenCalledWith('Hello', 0);
  });
});

declare global {
  interface Window {
    __intersectionObserverCallback?: (entries: unknown[]) => void;
  }
}
