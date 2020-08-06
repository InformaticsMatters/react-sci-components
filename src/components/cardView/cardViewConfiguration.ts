import { useRedux } from 'hooks-for-redux';
import { zip } from 'lodash';

import { moleculesStore } from '../../modules/molecules/molecules';

import type { DropResult } from 'react-smooth-dnd';

export type CField = { name: string; title: string };

interface Config {
  fields: CField[];
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
  setFields: (configuration, fields: CField[]) => ({ ...configuration, fields }),
  setEnabledFields: (configuration, enabledFields) => ({ ...configuration, enabledFields }),
  toggleFieldIsEnabled: ({ enabledFields, ...rest }, fieldName: string) => {
    const index = enabledFields.findIndex((f) => f === fieldName);
    if (index !== -1) {
      return { ...rest, enabledFields: enabledFields.filter((f) => f !== fieldName) };
    }
    return { ...rest, enabledFields: [...enabledFields, fieldName] };
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
    setFields(zipped.map(([name, title]) => ({ name, title })));

    setEnabledFields(fieldNames.filter((name) => enabledFieldNames?.includes(name)).slice(0, 5));
  }
});
