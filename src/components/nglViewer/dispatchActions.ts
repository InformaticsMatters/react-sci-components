import { isEmpty, isEqual } from 'lodash';

import { removeAllNglComponents, setNglOrientation } from './nglLocalState';

export const setOrientation = (div_id: string, orientation: any, nglOrientations: any) => {
  if (
    orientation &&
    ((nglOrientations &&
      nglOrientations[div_id] &&
      !isEqual(orientation.elements, nglOrientations[div_id].elements)) ||
      isEmpty(nglOrientations) ||
      (nglOrientations && nglOrientations[div_id] === undefined))
  ) {
    setNglOrientation({ orientation: orientation, div_id: div_id });
  }
};

export const removeNglComponents = (stage: any) => {
  removeAllNglComponents(stage);
};
