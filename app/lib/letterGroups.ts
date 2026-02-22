// Groups of visually similar ASL letters that should be accepted interchangeably
// This compensates for model detection inaccuracies while maintaining usability

export const letterGroups: Record<string, string[]> = {
  A: ["A", "S", "M", "N", "T"],
  S: ["A", "S", "M", "N", "T"],

  M: ["A", "S", "M", "N", "T"],
  N: ["A", "S", "M", "N", "T"],
  T: ["A", "S", "M", "N", "T"],

  B: ["B", "C"],
  C: ["B", "C"],

  D: ["D", "G", "H", "X"],
  G: ["D", "G", "H", "X"],
  H: ["D", "G", "H", "X"],

  I: ["I", "J"],
  J: ["I", "J"],

  K: ["K", "V", "U"],
  V: ["K", "V", "U"],
  U: ["K", "V", "U"],

  E: ["E", "O"],
  O: ["E", "O"],

  F: ["F", "X"],
  X: ["F", "X", "D", "G", "H"],

  L: ["L", "Y"],
  Y: ["L", "Y"],

  P: ["P", "Q"],
  Q: ["P", "Q"],

  R: ["R"],
  W: ["W"],
  Z: ["Z"],
};

export const isLetterAccepted = (
  expected: string,
  detected: string,
): boolean => {
  const acceptedGroup = letterGroups[expected] || [expected];
  return acceptedGroup.includes(detected);
};
