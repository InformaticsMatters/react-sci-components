import { useRedux } from 'hooks-for-redux';

import { FieldMeta, moleculesStore } from '../../modules/molecules/molecules';
import { initializeModule, isStateLoadingFromFile } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';

type ConfigOptions = 'xprop' | 'yprop' | 'colour' | 'size';
type Config = Record<ConfigOptions, string | null>;
type ConfigItem = { name: string; value: string | null };

const initialState: Config = {
  xprop: 'id',
  yprop: 'id',
  colour: null,
  size: null,
};

export const [
  useScatterplotConfiguration,
  { resetWithNewFields, setConfigurationItem },
  scatterplotConfigurationStore,
] = useRedux('plotConfiguration', resolveState('plotConfiguration', initialState), {
  resetWithNewFields: (configuration, newFields: FieldMeta[]) => {
    const names = newFields.map(({ name }) => name);

    const newConfig = Object.entries(configuration).map(([prop, name]) => {
      if (name === 'id') {
        return [prop, 'id'];
      }
      if (name !== null && names.includes(name)) {
        return [prop, name];
      }
      if (prop === 'xprop' || prop === 'yprop') {
        return [prop, 'id'];
      }
      return [prop, null];
    });

    return Object.fromEntries(newConfig);
  },
  setConfigurationItem: (configuration, { name, value }: ConfigItem) => ({
    ...configuration,
    [name]: value,
  }),
});

moleculesStore.subscribe(({ fields }) => {
  if (!isStateLoadingFromFile()) {
    resetWithNewFields(fields);
  }
});

initializeModule('plotConfiguration');
