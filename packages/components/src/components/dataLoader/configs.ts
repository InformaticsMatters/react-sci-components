import { useRedux } from 'hooks-for-redux';

import { initializeModule } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';
import { Source } from './workingSource';

export interface SourceConfig extends NonNullable<Source> {
  configName: string;
  id: number;
}

export const [useSourceConfigs, { addConfig }, SourceConfigsStore] = useRedux(
  'sourceConfigs',
  resolveState('sourceConfigs', [] as SourceConfig[]),
  {
    addConfig: (configs, newConfig: Omit<SourceConfig, 'id'>) => [
      ...configs,
      { ...newConfig, id: configs.length + 1 },
    ],
  },
);

// initializeModule('sources');
initializeModule('sourceConfigs');
