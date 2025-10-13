/**
 * Determine if transition is Conway's Game of Life
 */
export function isLifeTransition(
  transition: { birth: number[]; survive: number[] },
) {
  const normalizedBirth = sortUnique(transition.birth);

  const normalizedSurvive = sortUnique(transition.survive);

  return (normalizedBirth.length === 1 &&
    normalizedBirth[0] === 3 &&
    normalizedSurvive.length === 2 &&
    normalizedSurvive[0] === 2 && normalizedSurvive[1] === 3);
}

function sortUnique(a: number[]) {
  return [...new Set(a.slice().sort((a, b) => a - b))];
}
