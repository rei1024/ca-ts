/**
 * https://github.com/rowett/lifeviewer/blob/4d5d2fbe96a9c9722b6966a5133d975124efbedb/js/alias.js
 */
const map = new Map([
  ["life", "B3/S23"],
  ["conway", "B3/S23"],
  ["conway's game of life", "B3/S23"],
  ["conway's life", "B3/S23"],
]);

export function alias(ruleString: string): string {
  const item = map.get(ruleString.toLowerCase());
  return item ?? ruleString;
}
