// Groups of visually similar ASL letters that should be accepted interchangeably
// This compensates for model detection inaccuracies while maintaining usability

export const letterGroups: Record<string, string[]> = {
  // Fist-based signs
  A: ["A", "S", "M", "N", "T"],
  S: ["A", "S", "M", "N", "T"],
  M: ["A", "S", "M", "N", "T"],
  N: ["A", "S", "M", "N", "T"],
  T: ["A", "S", "M", "N", "T"],

  // Flat hand variations
  B: ["B", "C"],
  C: ["B", "C"],

  // Pointing finger variations (D also similar to X)
  D: ["D", "G", "H", "X"],
  G: ["D", "G", "H", "X"],
  H: ["D", "G", "H", "X"],

  // Pinky-based signs
  I: ["I", "J"],
  J: ["I", "J"],

  // Two-finger signs
  K: ["K", "V", "U"],
  V: ["K", "V", "U"],
  U: ["K", "V", "U"],

  // Curved finger signs
  E: ["E", "O"],
  O: ["E", "O"],

  // Thumb touching variations (X also similar to D)
  F: ["F", "X"],
  X: ["F", "X", "D", "G", "H"],

  // Thumb extended signs
  L: ["L", "Y"],
  Y: ["L", "Y"],

  // Similar fist positions
  P: ["P", "Q"],
  Q: ["P", "Q"],

  // Unique signs (standalone)
  R: ["R"],
  W: ["W"],
  Z: ["Z"],
};

/**
 * Check if a detected letter is acceptable for the expected letter
 * @param expected - The letter the user should sign
 * @param detected - The letter detected by the model
 * @returns true if the detected letter is in the acceptable group
 */
export const isLetterAccepted = (
  expected: string,
  detected: string,
): boolean => {
  const acceptedGroup = letterGroups[expected] || [expected];
  return acceptedGroup.includes(detected);
};
