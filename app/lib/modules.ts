export interface Module {
  id: number;
  title: string;
  description: string;
  letter_set: string[];
  completed: boolean;
}

export const modulesList: Module[] = [
  {
    id: 1,
    title: "Letter A - E",
    description: "Learn to spell A, B, C, D, and E in ASL",
    letter_set: ["A", "B", "C", "D", "E"],
    completed: false,
  },
  {
    id: 2,
    title: "Letter F - J",
    description: "Learn to spell F, G, H, I, and J in ASL",
    letter_set: ["F", "G", "H", "I", "J"],
    completed: false,
  },
  {
    id: 3,
    title: "Letter K - O",
    description: "Learn to spell K, L, M, N, and O in ASL",
    letter_set: ["K", "L", "M", "N", "O"],
    completed: false,
  },
  {
    id: 4,
    title: "Letter P - T",
    description: "Learn to spell P, Q, R, S, and T in ASL",
    letter_set: ["P", "Q", "R", "S", "T"],
    completed: false,
  },
  {
    id: 5,
    title: "Letter U - Z",
    description: "Learn to spell U, V, W, X, Y, and Z in ASL",
    letter_set: ["U", "V", "W", "X", "Y", "Z"],
    completed: false,
  },
  {
    id: 6,
    title: "Basics: CAT",
    description: "Learn to spell CAT in ASL",
    letter_set: ["C", "A", "T"],
    completed: false,
  },
  {
    id: 7,
    title: "Basics: DOG",
    description: "Learn to spell DOG in ASL",
    letter_set: ["D", "O", "G"],
    completed: false,
  },
  {
    id: 8,
    title: "Basics: HELP",
    description: "Learn to spell HELP in ASL",
    letter_set: ["H", "E", "L", "P"],
    completed: false,
  },
  {
    id: 9,
    title: "Basics: ORANGE",
    description: "Learn to spell ORANGE in ASL",
    letter_set: ["O", "R", "A", "N", "G", "E"],
    completed: false,
  },
];
