import { useCallback } from 'react';

import { DataTierAPI, Project } from '@squonk/data-tier-services';

import { usePromise } from './usePromise';

export const useProjects = () => {
  const func = useCallback(() => {
    return DataTierAPI.getAvailableProjects();
  }, []);
  const { data, loading, error } = usePromise(func, [] as Project[]);
  return { projects: data, isProjectsLoading: loading, projectsError: error };
};
