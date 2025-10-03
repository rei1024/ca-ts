export const packages: Record<string, {
  npmPackageName: string;
  description: string;
  keywords: string[];
}> = {
  "algo": {
    npmPackageName: "@rei1024/ca-algo",
    description: "Algorithms for cellular automata simulation.",
    keywords: [
      "cellular-automata",
      "algorithm",
    ],
  },
  "pattern": {
    npmPackageName: "@rei1024/ca-pattern",
    description:
      "Cellular automata pattern data structures for managing cell states and positions.",
    keywords: [
      "cellular-automata",
    ],
  },
  "rle": {
    npmPackageName: "@rei1024/ca-rle",
    description:
      "Run Length Encoded (RLE) file format parser and writer (Cellular automaton)",
    keywords: [
      "cellular-automata",
      "rle",
      "parse",
    ],
  },
  "rule": {
    npmPackageName: "@rei1024/ca-rulestring",
    description: "Rulestring parser and writer (Cellular automaton)",
    keywords: [
      "cellular-automata",
      "rulestring",
      "parse",
    ],
  },
  "rule-format": {
    npmPackageName: "@rei1024/ca-rule-format",
    description: "Rule format parser.",
    keywords: [
      "cellular-automata",
      "parse",
    ],
  },
};
