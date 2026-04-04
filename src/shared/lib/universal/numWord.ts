export function numWord(value: number, words: [string, string, string]) {
  const mod100 = value % 100;
  const mod10 = value % 10;

  if (mod100 >= 11 && mod100 <= 14) {
    return words[2];
  }

  if (mod10 === 1) {
    return words[0];
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return words[1];
  }

  return words[2];
}
