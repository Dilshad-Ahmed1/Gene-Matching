// Brute-Force
export function bruteForceSearch(text, pattern) {
  const matches = [];
  const n = text.length;
  const m = pattern.length;

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) j++;
    if (j === m) matches.push(i);
  }

  return matches;
}

// Horspool
export function horspoolSearch(text, pattern) {
  const matches = [];
  const m = pattern.length;
  const n = text.length;
  const table = {};

  // Create shift table
  for (let i = 0; i < m - 1; i++) {
    table[pattern[i]] = m - 1 - i;
  }

  let i = m - 1;
  while (i < n) {
    let k = 0;
    while (k < m && pattern[m - 1 - k] === text[i - k]) k++;
    if (k === m) matches.push(i - m + 1);
    i += table[text[i]] || m;
  }

  return matches;
}

// Boyer-Moore (Bad character heuristic only for simplicity)
export function boyerMooreSearch(text, pattern) {
  const matches = [];
  const n = text.length;
  const m = pattern.length;
  const badChar = {};

  for (let i = 0; i < m; i++) {
    badChar[pattern[i]] = i;
  }

  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    if (j < 0) {
      matches.push(s);
      s += (s + m < n) ? m - badChar[text[s + m]] || 1 : 1;
    } else {
      const badShift = badChar[text[s + j]];
      s += Math.max(1, j - (badShift !== undefined ? badShift : -1));
    }
  }

  return matches;
}
