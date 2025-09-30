// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./packages/pattern/mod.ts"],
  outDir: "./npm/pattern",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "rei1024/pattern",
    version: "0.1.0", // TODO
    description: "Your package.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/rei1024/ca-ts.git",
    },
    bugs: {
      url: "https://github.com/rei1024/ca-ts/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/pattern/LICENSE");
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
