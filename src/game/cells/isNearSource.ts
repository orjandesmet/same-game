export function isNearSource(
  rowIdx: number,
  columnIdx: number,
  sourceRowIdx: number,
  sourceColumnIdx: number,
  distance: Readonly<number>
): Readonly<boolean> {
  const calculatedDistance = Math.sqrt(
    Math.pow(rowIdx - sourceRowIdx, 2) +
      Math.pow(columnIdx - sourceColumnIdx, 2)
  );
  return calculatedDistance <= distance;
}
