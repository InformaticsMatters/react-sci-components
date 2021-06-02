import { useCallback } from 'react';

import { DataTierAPI, Dataset, MIMETypes, Project } from '@squonk/data-tier-client';

import { usePromise } from './usePromise';

type SchemaProp = { type: string };

const isSchemaProp = (entry: unknown): entry is [string, SchemaProp] => {
  const [, value] = entry as [string, SchemaProp];
  return value.type !== undefined;
};

const getAppTypeName = (type: string) => {
  switch (type) {
    case 'string':
      return 'text';
    case 'number':
      return 'float';
    case 'integer':
      return 'int';
    default:
      return 'text';
  }
};

export const useDatasetMeta = (project: Project | null, dataset: Dataset | null) => {
  const projectId = project?.projectId;
  const datasetId = dataset?.datasetId;
  const dtype = dataset?.type;
  const func = useCallback(() => {
    if (dtype === MIMETypes.SDF && datasetId !== undefined && projectId !== undefined) {
      return DataTierAPI.getDatasetMetaFromProject(projectId, datasetId);
    } else {
      return Promise.resolve({});
    }
  }, [projectId, datasetId, dtype]);

  const { data, loading, error } = usePromise(func, null);
  const output = { isMetadataLoading: loading, metadataError: error };

  if (data === null) {
    return { metadata: null, ...output };
  } else if (data?.properties?.values?.properties !== undefined) {
    const metadata = Object.entries(data?.properties?.values?.properties)
      .filter(isSchemaProp)
      .map(([name, value]) => ({ name, type: getAppTypeName(value.type) }));

    return { metadata, ...output };
  } else {
    return { metadata: null, ...output };
  }
};
