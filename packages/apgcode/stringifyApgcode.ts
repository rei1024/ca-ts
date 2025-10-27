import type { Apgcode } from "./Apgcode.ts";
import { numToChar, numToCharForY } from "./internal/numToChar.ts";

// An '''apgcode''' is a unique identifier used by [[apgsearch]] and its search results database, [[Catagolue]], to classify and denote a [[pattern]]. A pattern's name may also be its apgcode (especially for small, otherwise unnamed patterns).

// == Encoding objects ==
// An apgcode consists of a prefix and a suffix, separated by an underscore. Both the prefix and the suffix are alphanumeric strings.

// === Prefix ===
// The prefix consists of a two-character type and a number. For encodable objects, the types are:

// * <tt>xs</tt> for a [[still life]];
// * <tt>xp</tt> for an [[oscillator]];
// * <tt>xq</tt> for a [[spaceship]];
// * <tt>yl</tt> for a periodic linearly growing object, such as a [[puffer]] or [[gun]];
// * <tt>methuselah</tt> for a [[methuselah]];
// * <tt>messless</tt> for a [[diehard]]; and
// * <tt>megasized</tt> for a soup with a large final population.

// The number following the type represents the [[population]] for a still life, the lifespan for a methuselah or diehard, or otherwise the [[period]] of the object.
// For an example, see [[xp2]].

// Note that despite always having a constant shape and population, spaceships of period 1 are classified under <tt>xq</tt> rather than under <tt>xs</tt> or a dedicated period-1 spaceship prefix.

// === Suffix ===
// In codes for <tt>xs</tt>, <tt>xp</tt>, and <tt>xq</tt>, the suffix following the underscore is a representation of the object in Extended Wechsler Format (see below).

// In codes for <tt>yl</tt>, the suffix consists of additional information encoding higher-order periods of the pattern:<ref>https://conwaylife.com/forums/viewtopic.php?p=71429#p71429</ref>

// * The first value is a number representing the "population growth" of the pattern, which is related to (but not necessarily identical to) the period. For example:
// ** Despite the [[block-laying switch engine]] having a period of 288, its value is 144 due to [[glide symmetry]].
// ** Likewise, a diagonal puffer from [[HighLife]] has a value of 960 rather than the expected 192 due to creating period-10 oscillators out of phase with each other.
// * The second value represents the period at which the population of the debris fluctuates.
// * The third value represents how much the population grows after the amount of generations specified in the first value have elapsed.
// * What the fourth value corresponds to is currently not known; it appears to be a hashing function.

// === Unencodable objects ===
// In their original form, apgcodes are not guaranteed to encode still lifes, oscillators and spaceships exceeding a 40&times;40 bounding box.{{refn|group=note|Patterns exceeding a 40&times;40 bounding box can still be encoded using "classic" apgcodes if they match either fit within such a box in at least one phase, or if, alternatively, they do not contain runs of more than 39 zeroes in their extended Wechsler representation.}} These are instead reported by apgsearch and censused by Catagolue as ''oversized'' patterns, using the following types:

// * <tt>ov_s</tt> for an oversized still life;
// * <tt>ov_p</tt> for an oversized oscillator;
// * <tt>ov_q</tt> for an oversized spaceship.

// These types are then followed by a number representing the population for a still life, or otherwise the period of the object, as in the non-oversized case. apgcodes of this form do not uniquely identify a specific object, but rather represent classes of objects.

// An extension to apgcodes, dubbed "greedy apgcodes" (see below), was later used to relax the 40&times;40 bounding box constraint, although some sufficiently large patterns remain canonically unencodable.

// === Unclassifiable objects ===
// Objects which apgsearch cannot classify as above are denoted by one of:

// * <tt>zz_EXPLOSIVE</tt>
// * <tt>zz_LINEAR</tt>
// * <tt>zz_QUADRATIC</tt>
// * <tt>zz_REPLICATOR</tt>
// * <tt>PATHOLOGICAL</tt> (e.g. high-period oscillators)

// Chaotic-growth (<tt>zz_*</tt>) patterns are classified according to certain heuristics; the labels chosen do not necessarily reflect the nature of the object encountered, so an object classified as e.g. <tt>zz_REPLICATOR</tt> need not be an actual [[replicator]].

// Like oversized apgcodes, these apgcodes do not uniquely identify specific objects.

// == Extended Wechsler format ==
// Non-oversized still lifes, oscillators and patterns are encoded in '''extended Wechsler format''', an extension of a pattern notation developed by [[Allan Wechsler]] in 1992.

// * The pattern is separated into horizontal strips of five rows.
// ** Each strip, ''n'' columns wide, is encoded as a string of ''n'' characters in the set {<tt>0</tt>, <tt>1</tt>, <tt>2</tt>, ..., <tt>8</tt>, <tt>9</tt>, <tt>a</tt>, <tt>b</tt>, ..., <tt>v</tt>} denoting the five cells in a vertical column corresponding to the bitstrings {'00000', '00001', '00010', ..., '01000', '01001', '01010', '01011', ... '11111'}.
// ** The characters '<tt>w</tt>' and '<tt>x</tt>' are used to abbreviate '<tt>00</tt>' and '<tt>000</tt>', respectively, and the symbols {'<tt>y0</tt>', '<tt>y1</tt>', <tt>y2</tt>', ..., '<tt>yx</tt>', '<tt>yy</tt>', '<tt>yz</tt>'} are used to encode runs of between 4 and 39 consecutive '<tt>0</tt>'s.
// ** Extraneous '<tt>0</tt>'s at the ends of strips are not included in the encoding. (Note that in particular, blank five-row strips are represented by the empty string.)
// * The character '<tt>z</tt>' separates contiguous five-row strips.

// === Examples ===
// <tt>xq4_27deee6</tt> encodes a [[heavyweight spaceship]]:

// [[File:xq4 27deee6 annotated.png|center]]

// <tt>xs31_0ca178b96z69d1d96</tt> encodes a 31-bit still life; note how the '<tt>z</tt>' separates the two five-row strips:

// {| style="margin-left: auto; margin-right: auto;"
// |-
// | style="padding-bottom: 0.5em;" | [[File:xs31 0ca178b96z69d1d96 annotated strip1.png|center]]
// |-
// | style="padding-bottom: 0.5em;" | [[File:xs31 0ca178b96z69d1d96 annotated strip2.png]]
// |}

// <tt>xp30_w33z8kqrqk8zzzx33</tt> encodes a [[trans-queen bee shuttle]]; note how five-row strips are represented by the empty string:

// {| style="margin-left: auto; margin-right: auto;"
// |-
// | style="padding-bottom: 0.5em;" | [[File:Xp30 w33z8kqrqk8zzzx33 annotated strip1.png|center]]
// |-
// | style="padding-bottom: 0.5em;" | [[File:Xp30 w33z8kqrqk8zzzx33 annotated strip2.png|center]]
// |-
// | style="padding-bottom: 0.5em;" | <center>(10 blank rows omitted)</center>
// |-
// | [[File:Xp30 w33z8kqrqk8zzzx33 annotated striplast.png|center]]
// |}

// <tt>xp2_31a08zy0123cko</tt> is a [[quadpole tie ship]]; note how trailing zeros in the first five-row strip are not encoded:

// {| style="margin-left: auto; margin-right: auto;"
// |-
// | style="padding-bottom: 0.5em;"| [[File:xp2 31a08zy0123cko annotated strip1.png|center]]
// |-
// | [[File:xp2 31a08zy0123cko annotated strip2.png|center]]
// |}

// == Canonical form ==
// In order to enforce a canonical form, there are further rules regarding encoding:

// * The leftmost column and uppermost row must each contain at least one live cell. (This gives a canonical position.)
// * A canonical orientation and phase must be determined. For example, with the [[caterer]] (p3 oscillator with no [[symmetry]]), there are three phases and eight orientations, so we have 24 possible encodings. A total order on these encodings is defined as follows:
// ** Shorter representations are preferred to longer representations;
// ** For representations of the same length, lexicographical ASCII ordering is applied, and preference given to earlier strings.

// This gives, for any still-life, oscillator or spaceship, an unambiguous canonical code to represent the pattern. It has several desirable properties:

// * Compression: it is much more compact than [[RLE]] or [[SOF]] for storing very small patterns, and sometimes even beats the common name ('<tt>xp15_4r4z4r4</tt>' is shorter than '[[pentadecathlon]]')!
// * Character set: it only uses digits, lowercase letters and the underscore, so can be safely used in filenames and URLs.
// * Human-readability: the prefix means that we can instantly see whether a particular object is a still-life (and if so, what size), oscillator (and if so, what period) or spaceship (and if so, what period). It also means that the string is instantly recognised as being an encoding of an object ('<tt>xp2_7</tt>' is obviously a [[blinker]], whereas the digit 7 on its own with no extra context is ambiguous).

// == Adapting apgcodes to larger patterns ==
// As apgcodes were originally limited to patterns fitting into a 40&times;40 bounding box, different ways of extending them to allow unambiguously encoding larger patterns were proposed.<ref name="forumthread2307" /> In their original form, apgcodes are not guaranteed to be able to encode larger patterns, due a lack of well-definedness for runs of 40 or more consecutive zeroes, and apgsearch versions up to 3.x would report such patterns as oversized instead of attempting to encode them.

// Extended ("greedy") apgcodes were eventually adopted to allow larger patterns to be encoded. These avoid the problem by stipulating that a run of ''n'' zeroes be encoded as follows:

// # If ''n'' is less than 40, the run is encoded as in regular apgcodes, using the characters <tt>w</tt>, <tt>x</tt>, and <tt>y0</tt> .. <tt>yz</tt> as appropriate.
// # If ''n'' is equal to or greater than 40, the run is encoded as <tt>yz</tt> (representing the first 39 zeroes), following by the encoding for a run of ''n'' - 39 zeroes according to this definition.

// That is to say:

// :[[File:Extended apgcodes zeroes encoding.png]]

// This extension, which is used on the LifeWiki for larger patterns, retains compatibility with existing apgcode decoders. Adapting encoders to produce extended apgcodes is similarly straightforward.

/**
 * Convert Apgcode object back to apgcode string.
 *
 * NOTE: this function does not compute minimal representation.
 */
export function stringifyApgcode(apgcode: Apgcode): string {
  switch (apgcode.type) {
    case "still-life": {
      return `xs${apgcode.population}_${
        stringifyExtendedWechslerFormat(apgcode.cells)
      }`;
    }
    case "oscillator": {
      return `xp${apgcode.period}_${
        stringifyExtendedWechslerFormat(apgcode.cells)
      }`;
    }
    case "spaceship": {
      return `xq${apgcode.period}_${
        stringifyExtendedWechslerFormat(apgcode.cells)
      }`;
    }
    case "linear": {
      return `yl${apgcode.populationGrowthPeriod}_${apgcode.debrisPeriod}_${apgcode.populationGrowthAmount}_${apgcode.hash}`;
    }
  }
}

function cellsOffsetZero(
  cells: { x: number; y: number }[],
): { x: number; y: number }[] {
  if (cells.length === 0) {
    return cells;
  }
  const minX = cells.reduce((acc, cell) => Math.min(acc, cell.x), Infinity);
  const minY = cells.reduce((acc, cell) => Math.min(acc, cell.y), Infinity);
  return cells.map((cell) => ({ x: cell.x - minX, y: cell.y - minY }));
}

// opposite of parseExtendedWechslerFormat
export function stringifyExtendedWechslerFormat(
  cells: { x: number; y: number }[],
): string {
  validate(cells);

  if (cells.length === 0) {
    throw new Error("empty pattern");
  }

  const normalizedCells = cellsOffsetZero(cells);

  if (normalizedCells.length === 0) {
    return "";
  }

  const maxY = normalizedCells.reduce((max, cell) => Math.max(max, cell.y), 0);
  const numStrips = Math.floor(maxY / 5) + 1;
  const strips: string[] = [];

  for (let i = 0; i < numStrips; i++) {
    const stripCells = normalizedCells.filter(
      (cell) => Math.floor(cell.y / 5) === i,
    );

    if (stripCells.length === 0) {
      strips.push("");
      continue;
    }

    const maxX = stripCells.reduce((max, cell) => Math.max(max, cell.x), 0);
    const columnValues: number[] = new Array(maxX + 1).fill(0);

    for (const cell of stripCells) {
      const bit = 1 << (cell.y % 5);
      columnValues[cell.x]! |= bit;
    }

    let lastNonZero = columnValues.length - 1;
    while (lastNonZero >= 0 && columnValues[lastNonZero] === 0) {
      lastNonZero--;
    }
    if (lastNonZero < 0) {
      strips.push("");
      continue;
    }
    const trimmedColumnValues = columnValues.slice(0, lastNonZero + 1);

    let stripStr = "";
    let zeroCount = 0;

    for (const value of trimmedColumnValues) {
      if (value === 0) {
        zeroCount++;
      } else {
        stripStr += numToCharForY(zeroCount);
        zeroCount = 0;
        stripStr += numToChar(value);
      }
    }

    strips.push(stripStr);
  }

  return strips.join("z").replace(/z*$/, "");
}

function validate(cells: { x: number; y: number }[]) {
  let prevCell = undefined;
  for (const cell of cells) {
    if (!Number.isInteger(cell.x) || !Number.isInteger(cell.y)) {
      throw new Error("Not an integer");
    }
    if (
      prevCell &&
      (prevCell.y > cell.y || (prevCell.y === cell.y && prevCell.x > cell.x))
    ) {
      throw new Error("Not sorted and unique");
    }
    prevCell = cell;
  }
}
