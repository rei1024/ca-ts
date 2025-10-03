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
  "pattern": {
    npmPackageName: "@rei1024/ca-pattern",
    description: "Library for manipulating cellular automaton patterns",
    keywords: [
      "cellular-automata",
    ],
  },
  "rule": {
    npmPackageName: "@rei1024/ca-rulestring",
    description: "Rulestring parser and writer (Cellular automaton)",
    keywords: [
      "cellular-automata",
      "rulestring",
    ],
  },
  "rle": {
    npmPackageName: "@rei1024/ca-rle",
    description:
      "Run Length Encoded (RLE) file format parser and writer (Cellular automaton)",
    keywords: [
      "cellular-automata",
      "rle",
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
  entryPoints: ["./mod.ts"],
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
      `### ${packageData.npmPackageName}\n\nSee <https://jsr.io/@ca-ts/${packageKey}> for documentation.`,
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
