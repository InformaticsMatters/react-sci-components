import { useCallback } from 'react';

import { Project } from 'services/apiTypes';
import DataTierAPI from 'services/DataTierAPI';

import { usePromise } from './usePromise';

export const useDatasets = (project: Project | null) => {
  const projectId = project?.projectId;
  const func = useCallback(() => {
    if (projectId !== undefined) {
      return DataTierAPI.getDatasetsFromProject(projectId);
    } else {
      return Promise.resolve([]);
    }
  }, [projectId]);
  const { data, loading } = usePromise(func, []);
  return { datasets: data, isDatasetsLoading: loading };
};
