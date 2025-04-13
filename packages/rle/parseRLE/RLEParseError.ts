export class RLEParseError extends Error {
  readonly line: number | undefined;
  constructor(message: string, { line }: { line?: number } = {}) {
    super(message);
    this.line = line;
    this.name = "RLEParseError";
  }
}
