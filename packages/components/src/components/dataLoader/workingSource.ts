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
  maxRecords?: number;
  configs?: FieldConfig[];
}

export type WorkingSourceState = { title: string; state: Source | null }[];

type SetWorkingSourcePayload = { title: string; state: NonNullable<Source> };

export const [useWorkingSource, { setWorkingSource }, workingSourceStore] = useRedux(
  'workingSource',
  resolveState('workingSource', [] as WorkingSourceState),
  {
    setWorkingSource: (prevState, { title, state }: SetWorkingSourcePayload) => {
      const toUpdate = prevState.findIndex((state) => state.title === title);
      if (toUpdate !== -1) {
        return prevState.map((slice, index) => (index === toUpdate ? { title, state } : slice));
      } else {
        return [...prevState, { title, state }];
      }
    },
  },
);

// initializeModule('sources');
initializeModule('workingSource');
