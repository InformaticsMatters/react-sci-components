export const isUndefined = <TValue extends unknown>(
  value: TValue | null | undefined,
): value is TValue => {
  return value === undefined;
};

// Ts predicate to test if unknown is a number type
export const isNumber = (x: unknown): x is number => typeof x === 'number';
