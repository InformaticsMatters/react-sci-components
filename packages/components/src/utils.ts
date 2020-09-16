export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

// Ts predicate to test if unknown is a number type
export const isNumber = (x: unknown): x is number => typeof x === 'number';

// Test if value is number-like
export const isNumeric = (num: unknown): num is string | number =>
  (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
  !isNaN(num as number);
