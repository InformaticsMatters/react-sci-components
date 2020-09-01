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
  dtype: dTypes;
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
  configs?: FieldConfig[];
}

export type WorkingSourceState = Omit<Source, 'configName'> | null;

type SetWorkingSourcePayload = { title: string; state: NonNullable<WorkingSourceState> };

export const [useWorkingSource, { setWorkingSource }, workingSourceStore] = useRedux(
  'workingSource',
  resolveState('workingSource', null) as WorkingSourceState,
  {
    setWorkingSource: (_, { title, state }: SetWorkingSourcePayload) => state,
  },
);

initializeModule('sources');
initializeModule('workingSource');
