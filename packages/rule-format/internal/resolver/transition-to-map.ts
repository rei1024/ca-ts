export class TransitionMap {
  private map = new Map<string, number>();
  get(condition: readonly number[]): number | undefined {
    return this.map.get(condition.join("_"));
  }

  set(condition: readonly number[], to: number): void {
    this.map.set(condition.join("_"), to);
  }

  /**
   * The number of conditions.
   */
  get size(): number {
    return this.map.size;
  }
}

export function transitionToMap(transitions: {
  condition: number[];
  to: number;
}[]): TransitionMap {
  const map = new TransitionMap();

  for (const transition of transitions) {
    const current = map.get(transition.condition);

    // ignore later conditions
    if (current === undefined) {
      map.set(transition.condition, transition.to);
    }
  }

  return map;
}
