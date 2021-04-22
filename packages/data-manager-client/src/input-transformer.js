const translations = {
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
  'app.api_application.get': 'getApplications',
  'app.api_application.get_application': 'getApplication',
  'app.api_instance.get': 'getInstances',
  'app.api_instance.post': 'addInstance',
  'app.api_instance.delete': 'terminateInstance',
  'app.api_instance.get_instance': 'getInstance',
};

/**
 * Transform operation IDs to semantic names
 */
const inputTransformer = (obj) => {
  for (const value of Object.values(obj.paths)) {
    for (const defn of Object.values(value)) {
      const { operationId } = defn;
      if (translations[operationId]) {
        defn.operationId = translations[operationId];
      }
    }
  }
  return obj;
};

module.exports = inputTransformer;
