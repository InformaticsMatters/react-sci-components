/**
 * Redux slice for data sources and field configurations
 */

import { useRedux } from 'hooks-for-redux';

import { initializeModule } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';

export interface FieldConfig {
  name: string;
  enabled: boolean;
  nickname?: string;
  rank?: 'asc' | 'desc'; // TODO: make ENUM
  dtype?: string; // TODO: make ENUM
  transform?: string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
}

export interface Source {
  id: number;
  url: string;
  configName: string;
  maxRecords?: number;
  configs: FieldConfig[];
}

type LoadedDataState = Source[];

const initialSourcesState: LoadedDataState = [];

type AddSourcePayload = Omit<Source, 'id'>;

export const [useSources, { addSource, selectSource, selectConfig }, sourcesStore] = useRedux(
  'sources',
  resolveState('sources', initialSourcesState),
  {
    addSource: (state, payload: AddSourcePayload) => {
      return [{ id: state.length + 1, ...payload }, ...state];
    },
    selectSource: (state, url: string) => {
      // Currently get the first with correct url
      // ? Maybe need to select based on which was used last
      const indexToSelect = state.findIndex((source) => source.url === url);
      if (indexToSelect !== -1) {
        return [state.splice(indexToSelect, 1)[0], ...state];
      }
      return state;
    },
    selectConfig: (state, id: number) => {
      const indexToSelect = state.findIndex((source) => source.id === id);
      if (indexToSelect !== -1) {
        return [state.splice(indexToSelect, 1)[0], ...state];
      }
      return state;
    },
  },
);

const initialWorkingSourceState: Omit<Source, 'id'> = {
  url: '',
  maxRecords: 500,
  configName: 'default',
  configs: [],
};

export const [useWorkingSource, { setWorkingSource }, workingSourceStore] = useRedux(
  'workingSource',
  resolveState('workingSource', initialWorkingSourceState),
  {
    setWorkingSource: (_, newSource: Omit<Source, 'id'>) => newSource,
  },
);

initializeModule('sources');
initializeModule('workingSource');
