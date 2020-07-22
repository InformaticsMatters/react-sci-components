/**
 * Redux slice for data sources and field configurations
 */

import { useRedux } from 'hooks-for-redux';

interface FieldConfig {
  id: number;
  nickname?: string;
  rank: 'asc' | 'desc';
  dtype?: string;
  transform?: string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
}

interface Config {
  name: string;
  fieldConfigs: FieldConfig[];
}

export interface Source {
  url: string;
  maxRecords: number;
  configs: Config[];
}

type LoadedDataState = Source[];

const initialState: LoadedDataState = [];

type AddSourcePayload = { url: string; maxRecords: number };

export const [useLoadedData, { addSource }, loadedDataStore] = useRedux(
  'loadedData',
  initialState,
  {
    addSource: (state, { url, maxRecords }: AddSourcePayload) => [
      ...state,
      { url, maxRecords, configs: [] },
    ],
  },
);
