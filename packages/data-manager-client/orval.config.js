const mapping = {
  'app.api_dataset.get': 'getAvailableDatasets',
  'app.api_dataset.post': 'uploadDataset',
  'app.api_dataset.delete': 'deleteDataset',
  'app.api_dataset.get_dataset': 'downloadDataset',
  'app.api_dataset.delete_editor': 'removeEditorFromDataset',
  'app.api_dataset.put_editor': 'addEditorToDataset',
  'app.api_label.put_dataset': 'addLabelToDataset',
  'app.api_project.get': 'getAvailableProjects',
  'app.api_project.post': 'addNewProject',
  'app.api_project.delete': 'deleteProject',
  'app.api_project.get_project': 'getProject',
  'app.api_project.put_dataset': 'addDatasetToProject',
  'app.api_project.delete_editor': 'removeEditorFromProject',
  'app.api_project.put_editor': 'addEditorToProject',
  'app.api_project.delete_file': 'removeDatasetFromProject',
  'app.api_project.get_file': 'downloadDatasetFromProject',
  'app.api_task.get': 'getTask',
};

module.exports = {
  'data-manager-api': {
    input: {
      // validation: true,
      target: 'https://squonk.informaticsmatters.org/data-manager-api/openapi.json',
      override: {
        transformer: (obj) => {
          for (const value of Object.values(obj.paths)) {
            for (const defn of Object.values(value)) {
              const { operationId } = defn;
              defn.operationId = mapping[operationId];
            }
          }
          return obj;
        },
      },
    },
    output: {
      mode: 'tags',
      target: './src/orval/data-manager-api.ts',
      schemas: './src/orval/model',
      // mock: true,
      client: 'react-query',
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
