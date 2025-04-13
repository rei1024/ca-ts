/**
 * [Bounded grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
 */
export type GridParameter = {
  size: {
    /**
     * 0 is infinite
     */
    width: number;
    /**
     * 0 is infinite
     */
    height: number;
  };
  topology: {
    /**
     * - P: Plane
     * - S: Sphere
     * - C: Cross-surface
     */
    type: "P" | "S" | "C";
  } | {
    /**
     * - K: Klein bottle
     */
    type: "K";
    twisted: "horizontal" | "vertical";
    shift: -1 | 1 | null;
  } | {
    /**
     * - T: Torus
     */
    type: "T";
    shift: {
      edge: "horizontal" | "vertical";
      amount: number;
    } | null;
  };
};

export function parseGridParameter(str: string): GridParameter | null {
  if (str.length === 0) {
    return null;
  }
  const firstChar = str[0]!;
  const firstCharUpper = firstChar.toUpperCase();

  let topology: "P" | "T" | "K" | "C" | "S";
  switch (firstCharUpper) {
    case "P":
    case "T":
    case "K":
    case "C":
    case "S": {
      topology = firstCharUpper;
      break;
    }
    default: {
      throw new Error("Unknown topology type " + `"${firstChar}"`);
    }
  }

  const sizeStr = str.slice(1);

  if (topology === "S") {
    if (!/^[0-9]+$/.test(sizeStr)) {
      throw new Error("non valid character");
    }
    const size = Number(sizeStr);
    if (size === 0) {
      throw new Error("infinite size is disallowed for cross-surface");
    }
    return {
      size: {
        width: size,
        height: size,
      },
      topology: {
        type: topology,
      },
    };
  }

  if (topology === "C") {
    const regex = /^(?<w>[0-9]+),(?<h>[0-9]+)$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new Error("invalid size for cross-surface");
    }
    const width = Number(match.groups?.w);
    const height = Number(match.groups?.h);
    if (width === 0 || height === 0) {
      throw new Error("infinite size is disallowed for cross-surface");
    }
    return {
      size: {
        width,
        height,
      },
      topology: {
        type: topology,
      },
    };
  }

  if (topology === "P") {
    const regex = /^(?<w>[0-9]+),(?<h>[0-9]+)$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new Error("invalid size for plane");
    }
    return {
      size: {
        width: Number(match.groups?.w),
        height: Number(match.groups?.h),
      },
      topology: {
        type: topology,
      },
    };
  }

  if (topology === "T") {
    const regex =
      /^(?<w>[0-9]+)(?<hShift>(\+|-)[0-9]+)?,(?<h>[0-9]+)(?<vShift>(\+|-)[0-9]+)?$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new Error("invalid size for torus");
    }
    const hShift = match.groups?.hShift;
    const vShift = match.groups?.vShift;
    if (hShift && vShift) {
      throw new Error("invalid shift for torus");
    }
    const width = Number(match.groups?.w);
    const height = Number(match.groups?.h);
    return {
      size: {
        width,
        height,
      },
      topology: {
        type: topology,
        shift: hShift != null || vShift != null
          ? {
            edge: hShift != null ? "horizontal" : "vertical",
            amount: hShift != null ? Number(hShift) : Number(vShift),
          }
          : null,
      },
    };
  }

  if (topology === "K") {
    const regex =
      /^(?<w>[0-9]+)(?<hTwisted>\*)?(?<hShift>(\+|-)[0-9]+)?,(?<h>[0-9]+)(?<vTwisted>\*)?(?<vShift>(\+|-)[0-9]+)?$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new Error("invalid size for klein bottle");
    }
    const hShift = match.groups?.hShift;
    const vShift = match.groups?.vShift;
    if (hShift && vShift) {
      throw new Error("invalid shift for klein bottle");
    }
    const hTwisted = match.groups?.hTwisted;
    let vTwisted = match.groups?.vTwisted;
    // treat ":K10,20" like ":K10,20*"
    if (!hTwisted && !vTwisted) {
      vTwisted = "*";
    }
    if (hShift && vTwisted || vShift && hTwisted) {
      throw new Error("invalid twisted edge for klein bottle");
    }
    if (hTwisted && vTwisted) {
      throw new Error("invalid twisted edge for klein bottle");
    }
    const shiftAmount = hShift != null || vShift != null
      ? (
        Number(hShift ?? vShift)
      )
      : null;
    const width = Number(match.groups?.w);
    const height = Number(match.groups?.h);
    if (width === 0 || height === 0) {
      throw new Error("infinite size is disallowed for Klein bottle");
    }
    return {
      size: {
        width,
        height,
      },
      topology: {
        type: topology,
        twisted: hTwisted != null ? "horizontal" : "vertical",
        shift: shiftAmount != null ? (shiftAmount > 0 ? 1 : -1) : null,
      },
    };
  }

  assertNever(topology);
}

function assertNever(v: never): never {
  return v;
}

export function stringifyGridParameterWithColon(
  gridParameter: GridParameter | null | undefined,
) {
  if (gridParameter == null) {
    return "";
  }

  return ":" + stringifyGridParameter(gridParameter);
}

export function stringifyGridParameter(gridParameter: GridParameter): string {
  const size = gridParameter.size;
  switch (gridParameter.topology.type) {
    case "P": {
      return `P${size.width},${size.height}`;
    }
    case "C": {
      return `C${size.width},${size.height}`;
    }
    case "S": {
      if (size.height !== size.width) {
        throw new Error("Non same size for sphere");
      }
      return `S${size.width}`;
    }
    case "T": {
      const isHorizontalShift =
        gridParameter.topology.shift?.edge === "horizontal";
      return `T${size.width}${
        isHorizontalShift
          ? encodeShift(gridParameter.topology.shift?.amount)
          : ""
      },${size.height}${
        isHorizontalShift
          ? ""
          : encodeShift(gridParameter.topology.shift?.amount)
      }`;
    }
    case "K": {
      const horizontalTwisted = gridParameter.topology.twisted === "horizontal";
      return `K${size.width}${
        horizontalTwisted
          ? ("*" + encodeShift(gridParameter.topology.shift))
          : ""
      },${size.height}${
        horizontalTwisted
          ? ""
          : ("*" + encodeShift(gridParameter.topology.shift))
      }`;
    }
    default: {
      assertNever(gridParameter.topology);
    }
  }
}

function encodeShift(amount: number | null | undefined) {
  if (amount == null) {
    return "";
  } else if (amount >= 0) {
    return "+" + amount;
  } else {
    return "-" + (-amount);
  }
}
