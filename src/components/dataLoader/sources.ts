/**
 * Redux slice for data sources and field configurations
 */

import { useRedux } from 'hooks-for-redux';

import { initializeModule } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';

export enum dTypes {
  TEXT = 'text',
  FLOAT = 'float',
  INT = 'int',
}

export interface FieldConfig {
  name: string;
  nickname?: string;
  rank?: 'asc' | 'desc'; // TODO: make ENUM
  dtype?: dTypes; // TODO: make ENUM
  transform?: string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
}

export interface Source {
  projectId: string; // Need the project to access the dataset through the API otherwise the user needs editor access to the dataset which isn't guaranteed
  datasetId: string;
  configName: string;
  maxRecords?: number;
  configs: FieldConfig[];
}

// type LoadedDataState = Source[];

// const initialSourcesState: LoadedDataState = [];

// type AddSourcePayload = Omit<Source, 'id'>;

// export const [useSources, { addSource, selectSource, selectConfig }, sourcesStore] = useRedux(
//   'sources',
//   resolveState('sources', initialSourcesState),
//   {
//     addSource: (state, payload: AddSourcePayload) => {
//       return [{ id: state.length + 1, ...payload }, ...state];
//     },
//     selectSource: (state, url: string) => {
//       // Currently get the first with correct url
//       // ? Maybe need to select based on which was used last
//       const indexToSelect = state.findIndex((source) => source.url === url);
//       if (indexToSelect !== -1) {
//         return [state.splice(indexToSelect, 1)[0], ...state];
//       }
//       return state;
//     },
//     selectConfig: (state, id: number) => {
//       const indexToSelect = state.findIndex((source) => source.id === id);
//       if (indexToSelect !== -1) {
//         return [state.splice(indexToSelect, 1)[0], ...state];
//       }
//       return state;
//     },
//   },
// );

export type WorkingSourceState = Omit<Source, 'configName'> | null;

export const [useWorkingSource, { setWorkingSource }, workingSourceStore] = useRedux(
  'workingSource',
  resolveState('workingSource', null) as WorkingSourceState,
  {
    setWorkingSource: (_, newSource: NonNullable<WorkingSourceState>) => newSource,
  },
);

initializeModule('sources');
initializeModule('workingSource');
