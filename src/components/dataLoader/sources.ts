/**
 * Redux slice for data sources and field configurations
 */

import { useRedux } from 'hooks-for-redux';

export interface Field {
  nickname?: string;
  rank: 'asc' | 'desc';
  dtype?: string;
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
  fields?: Field[];
}

type LoadedDataState = Source[];

const initialState: LoadedDataState = [];

type AddSourcePayload = { url: string; maxRecords: number; configName: string | null };

export const [useSources, { addSource, selectSource, selectConfig }, sourcesStore] = useRedux(
  'sources',
  initialState,
  {
    addSource: (state, { url, maxRecords, configName }: AddSourcePayload) => {
      if (configName === null) configName = 'default';
      return [{ id: state.length + 1, url, maxRecords, configName, configs: [] }, ...state];
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
