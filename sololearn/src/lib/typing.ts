export type TypingState = {
  typed: string;
  mistakes: number;
};

export const emptyState: TypingState = { typed: "", mistakes: 0 };

const QUOTES = new Set(['"', "'", "“", "”", "‘", "’"]);

// Quotation marks and apostrophes are not required. They are filled in automatically.
function skipQuotes(target: string, state: TypingState): TypingState {
  let typed = state.typed;
  while (typed.length < target.length && QUOTES.has(target[typed.length])) {
    typed += target[typed.length];
  }
  return typed === state.typed ? state : { ...state, typed };
}

// Applies one typed character. Wrong characters are counted as mistakes
// and do not move the cursor, so the learner must type the right letter.
// Letters are case-sensitive: "I" and "i" are different keys.
export function applyKey(target: string, state: TypingState, key: string): TypingState {
  if (key.length !== 1) return state;

  const current = skipQuotes(target, state);
  if (current.typed.length >= target.length) return current;

  const expected = target[current.typed.length];
  if (key === expected) {
    return skipQuotes(target, { ...current, typed: current.typed + key });
  }
  // Typing a quote where the sentence has none is harmless, so it is ignored.
  if (QUOTES.has(key) && !QUOTES.has(expected)) return current;
  return { ...current, mistakes: current.mistakes + 1 };
}

export function isComplete(target: string, state: TypingState): boolean {
  return state.typed.length === target.length;
}

// Share of keypresses that were correct, from 0 to 100.
export function percentage(correct: number, mistakes: number): number {
  const attempts = correct + mistakes;
  if (attempts === 0) return 100;
  return Math.round((correct / attempts) * 100);
}

export function accuracy(state: TypingState): number {
  return percentage(state.typed.length, state.mistakes);
}
