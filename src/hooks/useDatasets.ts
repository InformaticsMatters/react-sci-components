import { useCallback } from 'react';

import { DataTierAPI, Project } from '@squonk/data-tier-client';

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
  const { data, loading, error } = usePromise(func, []);
  return { datasets: data, isDatasetsLoading: loading, datasetsError: error };
};
