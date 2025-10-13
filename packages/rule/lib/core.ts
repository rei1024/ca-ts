/**
 * Custom error class used for reporting specific failures during cellular automaton rule parsing.
 *
 * It extends the standard JavaScript `Error` class and adds a `kind` property
 * to categorize the type of parsing issue encountered.
 */
export class ParseRuleError extends Error {
  /**
   * Categorizes the type of rule parsing error.
   *
   * - `'format'`: The overall rule string syntax (e.g., B/S) is incorrect.
   * - `'transition'`: An issue with neighbor counts or conditions (e.g., number out of range).
   * - `'generations'`: An issue with the generations parameter (e.g., value less than 2).
   * - `'topology'`: An issue related to grid parameters.
   */
  public readonly kind: "format" | "transition" | "generations" | "topology";

  /**
   * Creates an instance of {@link ParseRuleError}.
   * @param message The error message detailing the specific failure.
   * @param kind The category of the error.
   */
  constructor(
    message: string,
    kind: "format" | "transition" | "generations" | "topology",
  ) {
    super(message);
    this.kind = kind;
  }
}
