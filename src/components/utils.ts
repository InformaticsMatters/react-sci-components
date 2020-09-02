import { dTypes } from './dataLoader/sources';

type Props = { name: string; title: string; dtype: string };

export const getDisplayText = ({ name, title, dtype }: Props) => {
  const arr: (string | dTypes)[] = [dtype];
  if (name !== title) {
    arr.push(name);
  }
  return `${title} (${arr.join(', ')})`;
};
