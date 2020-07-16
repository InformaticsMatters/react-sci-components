import { useRedux } from 'hooks-for-redux';
import type { DropResult } from 'react-smooth-dnd';

import { moleculesStore } from '../../modules/molecules/molecules';

interface Config {
  fields: string[];
  enabledFields: string[];
  fieldForDepiction: string;
}

const initialState: Config = {
  fields: [],
  fieldForDepiction: 'oclSmiles',
  enabledFields: [],
};

export const [
  useCardViewConfiguration,
  { setFields, setEnabledFields, toggleFieldIsEnabled, moveFieldPosition, setDepictionField },
  scatterplotConfigurationStore,
] = useRedux('cardViewConfiguration', initialState, {
  setFields: (configuration, fields: string[]) => ({ ...configuration, fields }),
  setEnabledFields: (configuration, enabledFields) => ({ ...configuration, enabledFields }),
  toggleFieldIsEnabled: ({ enabledFields, ...rest }, field: string) => {
    const index = enabledFields.findIndex((f) => f === field);
    if (index !== -1) {
      return { ...rest, enabledFields: enabledFields.filter((f) => f !== field) };
    }
    return { ...rest, enabledFields: [...enabledFields, field] };
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

moleculesStore.subscribe(({ fieldNames }) => {
  setFields(fieldNames);
  setEnabledFields(fieldNames.slice(0, 5));
});
