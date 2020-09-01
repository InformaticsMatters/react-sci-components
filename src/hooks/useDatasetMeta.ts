import { useCallback } from 'react';

import { Dataset, MIMETypes, Project } from 'services/apiTypes';
import DataTierAPI from 'services/DataTierAPI';

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

  const { data, loading } = usePromise(func, null);

  if (data === null) {
    return { metadata: null, isMetadataLoading: loading };
  } else if (data?.properties?.values?.properties !== undefined) {
    const metadata = Object.entries(data?.properties?.values?.properties)
      .filter(isSchemaProp)
      .map(([name, value]) => ({ name, type: getAppTypeName(value.type) }));

    return { metadata, isMetadataLoading: loading };
  } else {
    return { metadata: null, isMetadataLoading: loading };
  }
};
