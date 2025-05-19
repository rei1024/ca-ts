import { parseRuleFormat, resolveTable } from "../../rule-format/mod.ts";
import { WireWorldRule } from "../../rule-format/internal/test-data/rule-data.ts";
import { RuleLoaderWorld } from "./mod.ts";
import { parseRLE } from "../../rle/parseRLE.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("RuleLoader WireWorld", () => {
  const transitionMap = resolveTable(
    parseRuleFormat(WireWorldRule).table?.lines ?? [],
  );

  const ruleLoaderWorld = new RuleLoaderWorld({
    size: { width: 48, height: 12 },
    rule: (values) => transitionMap.get(values),
  });

  // https://conwaylife.com/forums/viewtopic.php?f=11&t=4486&p=96406#p96065
  const rle = `x = 46, y = 9, rule = WireWorld
.3CA$C4.B3C$.4C4.C.C$8.38C$8.C2.C$8.38C$.4C4.C.C$B4.4C$.A3C!`;

  const cells = parseRLE(rle).cells;

  for (const cell of cells) {
    ruleLoaderWorld.set(cell.position.x, cell.position.y, cell.state);
  }

  const gen0 = getSnapshot(ruleLoaderWorld);
  assertEquals(
    gen0.trimEnd(),
    ` 3331                                           
3    2333                                       
 3333    3 3                                    
        33333333333333333333333333333333333333  
        3  3                                    
        33333333333333333333333333333333333333  
 3333    3 3                                    
2    3333                                       
 1333`,
  );

  ruleLoaderWorld.next();
  const gen1 = getSnapshot(ruleLoaderWorld);
  assertEquals(
    gen1.trimEnd(),
    ` 3312                                           
3    3333                                       
 3333    3 3                                    
        33333333333333333333333333333333333333  
        3  3                                    
        33333333333333333333333333333333333333  
 3333    3 3                                    
3    3333                                       
 2133`,
  );
});

function getSnapshot(ruleLoaderWorld: RuleLoaderWorld) {
  return ruleLoaderWorld.getArray().map((row) =>
    row.map((x) => x === 0 ? " " : x.toString()).join("")
  )
    .join("\n");
}
