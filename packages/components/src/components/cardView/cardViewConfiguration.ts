import { useRedux } from 'hooks-for-redux';

import { resolveState } from '../../modules/state/stateResolver';
import { dTypes } from '../dataLoader/workingSource';

import type { DropResult } from 'react-smooth-dnd';

export interface CField {
  name: string;
  title: string;
  dtype: dTypes;
  isVisible: boolean;
}

interface Config {
  fields: CField[];
  fieldForDepiction: string | null;
}

const initialState: Config = {
  fields: [],
  fieldForDepiction: null,
};

export const [
  useCardViewConfiguration,
  { setFields, toggleFieldIsEnabled, moveFieldPosition, setDepictionField },
  cardViewConfigurationStore,
] = useRedux('cardViewConfiguration', resolveState('cardViewConfiguration', initialState), {
  setFields: (configuration, fields: CField[]) => ({ ...configuration, fields }),
  toggleFieldIsEnabled: ({ fields, ...rest }, fieldName: string) => {
    const fieldToChange = fields.find((field) => field.name === fieldName);
    if (fieldToChange !== undefined) {
      fieldToChange.isVisible = !fieldToChange?.isVisible;
    }
    return { fields, ...rest };
  },
  moveFieldPosition: ({ fields, ...rest }, { removedIndex, addedIndex }: DropResult) => {
    if (removedIndex === null || addedIndex === null) {
      return { ...rest, fields };
    }
    fields.splice(addedIndex, 0, fields.splice(removedIndex, 1)[0]);
    return { ...rest, fields: [...fields] };
  },
  setDepictionField: (configuration, fieldForDepiction: string) => ({
    ...configuration,
    fieldForDepiction,
  }),
});
