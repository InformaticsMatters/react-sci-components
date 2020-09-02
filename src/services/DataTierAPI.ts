// ! VERSION 1.2.1

import { APIService } from './APIService';
import { AddNewDatasetArgs, Dataset, IMMolecule, Project } from './apiTypes';

class DataTierAPI extends APIService {
  /**
   * Asynchronously get the projects the authenticated user has access to
   */
  async getAvailableProjects(): Promise<Project[]> {
    const data = await this._fetchAvailableProjects();
    return data.map(({ project_id, ...rest }: any) => ({ projectId: project_id, ...rest }));
  }

  /**
   * Asynchronously get all the datasets for the specified project id
   * @param projectId the `project_id` for the project to fetch the datasets of
   */
  async getDatasetsFromProject(projectId: string): Promise<Dataset[]> {
    const data = await this._fetchProjectDetails(projectId);
    return data.datasets.map(({ dataset_id, ...rest }: any) => ({
      datasetId: dataset_id,
      ...rest,
    }));
  }

  /**
   * Asynchronously get the metadata (available fields) of a dataset
   * @param projectId the id of the project the file is a part of
   * @param datasetId the id of the dataset to get the metadata of
   */
  async getDatasetMetaFromProject(projectId: string, datasetId: string): Promise<any> {
    const data = await this._fetchDatasetFromProject(
      projectId,
      datasetId,
      'application/schema+json',
    );
    return data;
  }

  /**
   * Asynchronously get the parsed JSON version of a dataset
   * @param projectId the id of the project the file is a part of
   * @param datasetId the id of the dataset to get the metadata of
   */
  async downloadDatasetFromProjectAsJSON(
    projectId: string,
    datasetId: string,
  ): Promise<IMMolecule[]> {
    const data = await this._fetchDatasetFromProject(
      projectId,
      datasetId,
      'application/x-squonk-dataset-molecule-v2+json',
    );
    return data;
  }

  /**
   * @param projectId
   * @param datasetId
   */
  async downloadDatasetFromProjectAsNative(projectId: string, datasetId: string): Promise<any> {
    const data = await this._fetchDatasetFromProject(projectId, datasetId);
    return data;
  }

  /**
   * Asynchronously add a new project with the provided name
   * @param name the name of the new project
   */
  async createNewProject(name: string): Promise<string> {
    const { project_id } = await this._postNewProject(name);
    return project_id;
  }

  /**
   * Asynchronously get all the datasets the user has access to
   */
  async getOwnedDatasets(): Promise<Dataset[]> {
    const data = await this._fetchOwedDatasets();
    return data.map(({ dataset_id, ...rest }: any) => ({ datasetId: dataset_id, ...rest }));
  }

  /**
   * Asynchronously post a new data set
   * @param args object containing the `File` object, and MIME type.
   * A name can be provided, when it is `undefined` the `file.name` is used.
   * Optionally labels and projects can be provided
   */
  async uploadNewDataset({ file, MIMEType, name, ...rest }: AddNewDatasetArgs): Promise<string> {
    const { dataset_id } = await this._postDataset({
      datasetFile: file,
      datasetType: MIMEType,
      datasetName: name ?? file.name,
      ...rest,
    });
    return dataset_id;
  }
}

export default new DataTierAPI(false, false);
