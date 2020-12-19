import { useRedux } from 'hooks-for-redux';

import { resolveState } from '../../modules/state/stateResolver';
import { dTypes } from '../dataLoader/workingSource';

import type { DropResult } from 'react-smooth-dnd';

/**
 * Types
 */
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

/**
 * Slice
 */

export const [
  useCardViewConfiguration,
  { setFields, toggleFieldIsEnabled, moveFieldPosition, setDepictionField },
  cardViewConfigurationStore,
] = useRedux('cardViewConfiguration', resolveState('cardViewConfiguration', initialState), {
  /**
   * @param configuration previous state
   * @param fields the new fields
   */
  setFields: (configuration, fields: CField[]) => ({ ...configuration, fields }),
  /**
   * @param configuration previous value of state
   * @param fieldName `.name` property of `Field` that is to be enabled
   */
  toggleFieldIsEnabled: ({ fields, ...rest }, fieldName: string) => {
    const fieldToChange = fields.find((field) => field.name === fieldName);
    if (fieldToChange !== undefined) {
      fieldToChange.isVisible = !fieldToChange?.isVisible;
    }
    return { fields, ...rest };
  },
  /**
   * Moves a field from the `removedIndex` position to the `addedIndex` position
   * @param configuration previous state
   * @param dropResult the result of the drag/drop operation including a removed and added index
   */
  moveFieldPosition: ({ fields, ...rest }, { removedIndex, addedIndex }: DropResult) => {
    if (removedIndex === null || addedIndex === null) {
      return { ...rest, fields };
    }
    fields.splice(addedIndex, 0, fields.splice(removedIndex, 1)[0]);
    return { ...rest, fields: [...fields] };
  },
  /**
   * @param configuration previous value of state
   * @param fieldForDepiction the `.name` of the field to be set for depiction
   */
  setDepictionField: (configuration, fieldForDepiction: string) => ({
    ...configuration,
    fieldForDepiction,
  }),
});
