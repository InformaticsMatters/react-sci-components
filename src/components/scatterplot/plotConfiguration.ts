import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';

type ConfigOptions = 'xprop' | 'yprop' | 'colour' | 'size';
type Config = Record<ConfigOptions, string | null>;

const initialState: Config = {
  xprop: null,
  yprop: null,
  colour: null,
  size: null,
};

export const [
  useScatterplotConfiguration,
  { resetConfiguration, setConfigurationItem },
  scatterplotConfigurationStore,
] = useRedux('plotConfiguration', initialState, {
  resetConfiguration: () => initialState,
  setConfigurationItem: (configuration, { name, value }) => ({ ...configuration, [name]: value }),
});

moleculesStore.subscribe(() => {
  resetConfiguration();
});
