import { dTypes } from './dataLoader/workingSource';

type Props = { name: string; title: string; dtype: string };

export const getDisplayText = ({ name, title, dtype }: Props) => {
  const arr: (string | dTypes)[] = [dtype];
  if (name !== title) {
    arr.push(name);
  }
  return `${title} (${arr.join(', ')})`;
};
