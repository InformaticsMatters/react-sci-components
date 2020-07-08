export const isUndefined = <TValue extends unknown>(
  value: TValue | null | undefined,
): value is TValue => {
  return value === undefined;
};

export const isNotUndefined = <TValue extends unknown>(
  value: TValue | null | undefined,
): value is TValue => {
  return value !== undefined;
};
