/**
 * https://github.com/rowett/lifeviewer/blob/ce0569da56d9f3d5f3b42f97c212bb99a6dc1aa1/js/alias.js#L133
 */
const map = new Map([
  ["", "B3/S23"],
  ["life", "B3/S23"],
  ["conway", "B3/S23"],
  ["conway's game of life", "B3/S23"],
  ["conway's life", "B3/S23"],
]);

export function alias(ruleString: string): string {
  const item = map.get(ruleString.toLowerCase());
  return item ?? ruleString;
}
