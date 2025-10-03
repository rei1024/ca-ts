// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

const packageKey = Deno.args[0];
if (packageKey == null) {
  throw new Error("Specify package");
}

const packages: Record<string, {
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

const packageData = packages[packageKey];

if (packageData == null) {
  throw new Error("Unknown package: " + packageKey);
}

const DIST_DIR = "npm_dist";

await emptyDir(`./${DIST_DIR}`);

const deno: { version?: string } = JSON.parse(
  await Deno.readTextFile("./deno.jsonc"),
);

if (!deno.version) {
  throw new Error("Version is not specified");
}

await build({
  entryPoints: packageKey === "algo"
    ? [
      {
        name: "./bit",
        path: "./bit/mod.ts",
      },
      {
        name: "./rule-loader",
        path: "./rule-loader/mod.ts",
      },
    ]
    : ["./mod.ts"],
  outDir: `./${DIST_DIR}/`,
  shims: {
    deno: "dev",
  },
  package: {
    // package.json properties
    name: packageData.npmPackageName,
    version: deno.version,
    description: packageData.description,
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/rei1024/ca-ts.git",
    },
    bugs: {
      url: "https://github.com/rei1024/ca-ts/issues",
    },
    keywords: packageData.keywords,
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("../../LICENSE", `${DIST_DIR}/LICENSE`);
    Deno.writeTextFileSync(
      `${DIST_DIR}/README.md`,
      `# ${packageData.npmPackageName}\n\n${packageData.description}\n\nSee <https://jsr.io/@ca-ts/${packageKey}> for documentation.`,
    );
  },
  // ...etc...
  filterDiagnostic(diagnostic) {
    if (
      diagnostic.file?.path?.includes("@std/assert")
    ) {
      return false; // ignore all diagnostics
    }
    // etc... more checks here
    return true;
  },
});
