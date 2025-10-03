// deno-lint-ignore-file no-console
import { packages } from "./package-data.ts";

const packageKey = Deno.args[0];
if (packageKey == null) {
  throw new Error("Specify package");
}

const packageData = packages[packageKey];

if (packageData == null) {
  throw new Error("Unknown package: " + packageKey);
}

// npm view react version

const command = new Deno.Command(`npm`, {
  args: ["view", packageData.npmPackageName, "version"],
});
const output = await command.output();

const text = new TextDecoder().decode(output.stdout).trim();
const deno: { version?: string } = JSON.parse(
  await Deno.readTextFile("./deno.jsonc"),
);

if (!deno.version) {
  throw new Error("Version is not specified");
}

if (deno.version === text) {
  console.log("1");
} else {
  console.log("0");
}
