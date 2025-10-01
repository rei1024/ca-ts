import { ParseRuleError } from "../core.ts";

/**
 * [Bounded grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
 */
export type GridParameter = {
  /**
   * Size of the grid.
   */
  size: {
    /**
     * Width of the grid.
     *
     * 0 represents infinite width.
     */
    width: number;
    /**
     * Height of the grid.
     *
     * 0 represents infinite height.
     */
    height: number;
  };
  /**
   * Topology of the grid.
   */
  topology: {
    /**
     * - S: Sphere
     */
    type: "S";
    /**
     * - `"top-to-left"`: Top edge is connected to left edge. (default)
     * - `"top-to-right"`: Top edge is connected to right edge. (with *)
     *    - Golly 4.3 does not support this.
     */
    join: "top-to-left" | "top-to-right";
  } | {
    /**
     * - P: Plane
     * - C: Cross-surface
     */
    type: "P" | "C";
  } | {
    /**
     * - K: Klein bottle
     */
    type: "K";
    /**
     * Which edge is twisted.
     */
    twisted: "horizontal" | "vertical";
    /**
     * Golly treats any non-zero shift on a Klein bottle as 1.
     */
    shift: 1 | null;
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
      throw new ParseRuleError(
        `Unknown topology type "${firstChar}". Must be one of P, T, K, C, or S.`,
        "topology",
      );
    }
  }

  const sizeStr = str.slice(1);

  // --- Sphere (S) ---
  if (topology === "S") {
    const match = sizeStr.match(/^(?<size>[0-9]+)(?<join>\*)?$/);
    if (!match) {
      throw new ParseRuleError(
        "Invalid format for Sphere topology (S). Expected 'S<size>' or 'S<size>*' (e.g., S30).",
        "topology",
      );
    }
    const size = Number(match.groups?.size);
    if (!Number.isInteger(size) || size <= 0) {
      throw new ParseRuleError(
        "Sphere size must be a positive integer.",
        "topology",
      );
    }

    const join = match.groups?.join ? "top-to-right" : "top-to-left";
    return {
      size: {
        width: size,
        height: size,
      },
      topology: {
        type: topology,
        join,
      },
    };
  }

  // --- Cross-surface (C) ---
  if (topology === "C") {
    const regex = /^(?<w>[0-9]+),(?<h>[0-9]+)$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new ParseRuleError(
        "Invalid format for Cross-surface topology (C). Expected 'C<width>,<height>' (e.g., C30,20).",
        "topology",
      );
    }
    const width = Number(match.groups?.w);
    const height = Number(match.groups?.h);
    if (width === 0 || height === 0) {
      throw new ParseRuleError(
        "Cross-surface (C) does not allow infinite dimensions (0).",
        "topology",
      );
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

  // --- Plane (P) ---
  if (topology === "P") {
    const regex = /^(?<w>[0-9]+),(?<h>[0-9]+)$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new ParseRuleError(
        "Invalid format for Plane topology (P). Expected 'P<width>,<height>' (e.g., P30,20 or P30,0).",
        "topology",
      );
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

  // --- Torus (T) ---
  if (topology === "T") {
    const regex =
      /^(?<w>[0-9]+)(?<hShift>(\+|-)[0-9]+)?,(?<h>[0-9]+)(?<vShift>(\+|-)[0-9]+)?$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new ParseRuleError(
        "Invalid format for Torus topology (T). Expected 'T<w>[,<shift>],<h>[,<shift>]' (e.g., T30,20 or T30+5,20).",
        "topology",
      );
    }
    const hShift = match.groups?.hShift;
    const vShift = match.groups?.vShift;
    const width = Number(match.groups?.w);
    const height = Number(match.groups?.h);

    if (hShift && vShift) {
      throw new ParseRuleError(
        "Torus topology (T) only allows a shift on horizontal edges OR vertical edges, not both.",
        "topology",
      );
    }

    if ((hShift || vShift) && (width === 0 || height === 0)) {
      throw new ParseRuleError(
        "Shifting is not allowed on a Torus (T) if either dimension is infinite (0).",
        "topology",
      );
    }

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

  // --- Klein bottle (K) ---
  if (topology === "K") {
    const regex =
      /^(?<w>[0-9]+)(?<hTwisted>\*)?(?<hShift>(\+|-)[0-9]+)?,(?<h>[0-9]+)(?<vTwisted>\*)?(?<vShift>(\+|-)[0-9]+)?$/;
    const match = sizeStr.match(regex);
    if (!match) {
      throw new ParseRuleError(
        "Invalid format for Klein bottle topology (K). Expected 'K<w>[*][<shift>],<h>[*][<shift>]' (e.g., K30*,20).",
        "topology",
      );
    }

    const hTwisted = match.groups?.hTwisted;
    let vTwisted = match.groups?.vTwisted;

    // Handle the case where K<w>,<h> defaults to vertical twist, K<w>,<h>*
    if (!hTwisted && !vTwisted) {
      vTwisted = "*";
    }

    const hShift = match.groups?.hShift;
    const vShift = match.groups?.vShift;
    const width = Number(match.groups?.w);
    const height = Number(match.groups?.h);

    if (width === 0 || height === 0) {
      throw new ParseRuleError(
        "Klein bottle (K) does not allow infinite dimensions (0).",
        "topology",
      );
    }

    // Check for invalid combinations
    if (hTwisted && vTwisted) {
      throw new ParseRuleError(
        "Klein bottle (K) only allows one pair of edges to be twisted (horizontal OR vertical), not both. Use 'C' for cross-surface.",
        "topology",
      );
    }
    if (hShift && vShift) {
      throw new ParseRuleError(
        "Klein bottle (K) only allows one shift (horizontal OR vertical), not both.",
        "topology",
      );
    }

    // Check shift is on twisted edge
    if ((hShift && !hTwisted) || (vShift && !vTwisted)) {
      throw new ParseRuleError(
        "Shift on a Klein bottle (K) is only allowed on the twisted edge.",
        "topology",
      );
    }

    const shiftAmount = hShift != null || vShift != null
      ? (
        Number(hShift ?? vShift)
      )
      : null;

    // Check even dimension for shift
    if (shiftAmount != null) {
      if (hTwisted && width % 2 !== 0) {
        throw new ParseRuleError(
          "Shift on a horizontally twisted Klein bottle (K<w>*) requires the width to be even.",
          "topology",
        );
      }

      if (vTwisted && height % 2 !== 0) {
        throw new ParseRuleError(
          "Shift on a vertically twisted Klein bottle (K<w>,<h>*) requires the height to be even.",
          "topology",
        );
      }
    }

    // Golly treats all Klein bottle shifts as +1 (if present).
    return {
      size: {
        width,
        height,
      },
      topology: {
        type: topology,
        twisted: hTwisted != null ? "horizontal" : "vertical",
        shift: shiftAmount != null ? 1 : null,
      },
    };
  }

  // This should be unreachable due to the initial switch
  assertNever(topology);
}

function assertNever(v: never): never {
  throw new Error(`Exhaustiveness check failed: received value ${v}`);
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
  if (!Number.isInteger(size.width) || !Number.isInteger(size.height)) {
    throw new Error(
      "Grid dimensions (width and height) must be integers for stringification.",
    );
  }

  if (size.width < 0 || size.height < 0) {
    throw new Error("Grid dimensions (width and height) cannot be negative.");
  }

  switch (gridParameter.topology.type) {
    case "P": {
      return `P${size.width},${size.height}`;
    }
    case "C": {
      if (size.width === 0 || size.height === 0) {
        throw new Error(
          "Cross-surface (C) cannot have infinite dimensions (0).",
        );
      }
      return `C${size.width},${size.height}`;
    }
    case "S": {
      if (size.height !== size.width) {
        throw new Error(
          "Sphere topology (S) requires width and height to be equal.",
        );
      }
      if (size.width === 0) {
        throw new Error("Sphere topology (S) cannot have infinite size (0).");
      }
      return `S${size.width}${
        gridParameter.topology.join === "top-to-right" ? "*" : ""
      }`;
    }
    case "T": {
      const shift = gridParameter.topology.shift;
      if (shift && (size.width === 0 || size.height === 0)) {
        throw new Error(
          "Shifting on a Torus (T) is not allowed if either dimension is infinite (0).",
        );
      }

      const isHorizontalShift = shift?.edge === "horizontal";
      return `T${size.width}${
        isHorizontalShift ? encodeShift(shift?.amount) : ""
      },${size.height}${isHorizontalShift ? "" : encodeShift(shift?.amount)}`;
    }
    case "K": {
      if (size.width === 0 || size.height === 0) {
        throw new Error(
          "Klein bottle (K) cannot have infinite dimensions (0).",
        );
      }

      const horizontalTwisted = gridParameter.topology.twisted === "horizontal";
      const shift = gridParameter.topology.shift;
      if (shift && (size.width === 0 || size.height === 0)) {
        // This is technically caught above, but ensures the check is explicit for K.
        throw new Error(
          "Shifting on a Klein bottle (K) is not allowed if either dimension is infinite (0).",
        );
      }

      return `K${size.width}${
        horizontalTwisted ? ("*" + encodeShift(shift)) : ""
      },${size.height}${horizontalTwisted ? "" : ("*" + encodeShift(shift))}`;
    }
    default: {
      assertNever(gridParameter.topology);
    }
  }
}

function encodeShift(amount: number | null | undefined) {
  if (amount == null) {
    return "";
  } else if (Number.isNaN(amount)) {
    throw new Error("Shift amount cannot be NaN.");
  } else if (amount === 0) {
    return "";
  } else if (amount > 0) {
    return "+" + amount;
  } else {
    // Handle negative amounts correctly for string representation
    return String(amount);
  }
}
