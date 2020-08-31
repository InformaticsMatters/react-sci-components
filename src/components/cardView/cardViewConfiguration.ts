import { useRedux } from 'hooks-for-redux';
import { zip } from 'lodash';

import { moleculesStore } from '../../modules/molecules/molecules';
import { initializeModule } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';

import type { DropResult } from 'react-smooth-dnd';

export interface CField {
  name: string;
  title: string;
  isVisible: boolean;
}

interface Config {
  fields: CField[];
  fieldForDepiction: string;
}

const initialState: Config = {
  fields: [],
  fieldForDepiction: 'oclSmiles',
};

export const [
  useCardViewConfiguration,
  { setFields, toggleFieldIsEnabled, moveFieldPosition, setDepictionField },
  scatterplotConfigurationStore,
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

moleculesStore.subscribe(({ fieldNames, fieldNickNames, enabledFieldNames }) => {
  // This check is probably unnecessary
  if (fieldNames.length === fieldNickNames.length) {
    let zipped = zip(fieldNames, fieldNickNames) as [string, string][];
    zipped = zipped.filter(([name]) => enabledFieldNames?.includes(name));
    setFields(
      zipped.map(([name, title], index) => ({
        name,
        title,
        isVisible: !!enabledFieldNames?.includes(name) && index < 5,
      })),
    );
  }
});

initializeModule('cardViewConfiguration');
