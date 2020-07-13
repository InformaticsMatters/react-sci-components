export const isUndefined = <TValue extends unknown>(
  value: TValue | null | undefined,
): value is TValue => {
  return value === undefined;
};

export const isNumber = (x: unknown): x is number => typeof x === 'number';
