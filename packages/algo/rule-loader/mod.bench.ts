import { parseRuleFormat, resolveTable } from "../../rule-format/mod.ts";
import { WireWorldRule } from "../../rule-format/internal/test-data/rule-data.ts";
import { RuleLoaderWorld } from "./mod.ts";
import { parseRLE } from "../../rle/parseRLE.ts";

const rule = resolveTable(parseRuleFormat(WireWorldRule).table?.lines ?? []);

const ruleLoaderWorld = new RuleLoaderWorld({
  size: { width: 48, height: 12 },
  rule: (values) => rule.get(values),
});

// [CMOS in WireWorld](https://conwaylife.com/forums/viewtopic.php?f=11&t=4486&p=96406#p96065)
const rle = `x = 46, y = 9, rule = WireWorld
.3CA$C4.B3C$.4C4.C.C$8.38C$8.C2.C$8.38C$.4C4.C.C$B4.4C$.A3C!`;

const cells = parseRLE(rle).cells;

for (const cell of cells) {
  ruleLoaderWorld.set(cell.position.x, cell.position.y, cell.state);
}

Deno.bench("RuleLoader WireWorld", () => {
  for (let i = 0; i < 1000; i++) {
    ruleLoaderWorld.next();
  }
});
