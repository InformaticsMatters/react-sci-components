import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';
import { resolveState } from '../../modules/state/stateResolver';
import {initializeModule, isBeingStateReloadedFromFile} from '../../modules/state/stateConfig';


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
  { resetConfiguration, setConfigurationItem },
  scatterplotConfigurationStore,
] = useRedux('plotConfiguration', resolveState('plotConfiguration', initialState), {
  resetConfiguration: () => initialState,
  setConfigurationItem: (configuration, { name, value }: ConfigItem) => ({
    ...configuration,
    [name]: value,
  }),
});

moleculesStore.subscribe(() => {
  if (!isBeingStateReloadedFromFile()) {
    resetConfiguration();
  };
});

initializeModule('plotConfiguration');