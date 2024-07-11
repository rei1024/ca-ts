const XRLE_HEADER = "#CXRLE";

/**
 * Parse "#CXRLE Pos=x,y Gen=123" line and extract values.
 * @returns `undefined` for non XRLE line.
 */
export function parseXRLELine(
  line: string,
):
  | { generation: string | null; position: { x: number; y: number } | null }
  | undefined {
  const res = parseXRLELineRaw(line);
  if (res === undefined) {
    return undefined;
  }
  const gen = res.get("Gen");
  function getXY() {
    const xy = res?.get("Pos")?.trim();
    if (xy == undefined) {
      return null;
    }
    const [xStr, yStr] = xy.split(",");
    if (xStr === undefined || yStr === undefined) {
      return null;
    }
    const x = parseInt(xStr, 10);
    if (isNaN(x)) {
      return null;
    }
    const y = parseInt(yStr, 10);
    if (isNaN(y)) {
      return null;
    }
    return { x, y };
  }

  return {
    generation: gen ?? null,
    position: getXY(),
  };
}

/**
 * Parse "#CXRLE key=value key=value ..." line and extract values.
 * @throws
 */
export function parseXRLELineRaw(
  line: string,
): Map<string, string> | undefined {
  const trimmedLine = line.trim();
  if (!trimmedLine.startsWith(XRLE_HEADER)) {
    return undefined;
  }
  const map: Map<string, string> = new Map();
  const array = trimmedLine.slice(XRLE_HEADER.length).split(/\s+/).filter(
    (x) => x.trim() !== "",
  );
  for (const x of array) {
    const [k, v] = x.split("=");
    if (k === undefined || v === undefined) {
      throw Error(`Parse error: ${line}`);
    }
    map.set(k, v);
  }

  return map;
}
