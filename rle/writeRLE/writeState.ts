const UPPER_A_CODE_POINT = "A".codePointAt(0) ?? 0;
const LOWER_P_CODE_POINT = "p".codePointAt(0) ?? 0;

const states: string[] = [];

for (let i = 0; i < 256; i++) {
  states.push(writeStateNaive(i));
}

export function writeState(state: number, isMultiState: boolean): string {
  if (!isMultiState) return state === 1 ? "o" : "b";
  if (!Number.isInteger(state)) throw new Error("invalid state");
  if (state > 255) throw new Error("invalid state");

  return states[state] ?? (() => {
    throw new Error("internal error");
  })();
}

function writeStateNaive(state: number): string {
  if (state === 0) return ".";
  if (state <= 24) {
    return String.fromCodePoint(UPPER_A_CODE_POINT + state - 1);
  }

  const state0 = state - 25;
  const high = Math.floor(state0 / 24);
  const low = state0 % 24;

  return String.fromCodePoint(
    LOWER_P_CODE_POINT + high,
    UPPER_A_CODE_POINT + low,
  );
}
