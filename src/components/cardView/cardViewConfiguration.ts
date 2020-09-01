import { dTypes } from 'components/dataLoader/sources';
import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';
import { initializeModule } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';

import type { DropResult } from 'react-smooth-dnd';
const NUM_ENABLED_DEFAULT = 5;

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

moleculesStore.subscribe(({ fields }) => {
  const enabledFields = fields.filter((f) => f.enabled);
  setFields(
    enabledFields.map(({ name, nickname, dtype }, index) => ({
      name,
      dtype,
      title: nickname,
      isVisible: index < NUM_ENABLED_DEFAULT,
    })),
  );

  // Use the first text field as the depiction field - best guess
  setDepictionField(enabledFields.filter((f) => f.dtype === dTypes.TEXT)[0].name);
});

initializeModule('cardViewConfiguration');
