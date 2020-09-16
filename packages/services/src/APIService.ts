/**
 * ! VERSION 1.0.1
 */
import axios from 'axios';

import appSettings from '../appSettings';
import { AllowedMediaTypes, PostDatasetArgs } from './apiTypes';

enum Endpoints {
  PROJECT = 'project',
  DATASET = 'dataset',
  LABEL = 'label',
}

type QueryParam = string | number | boolean;

export class APIService {
  protected token?: string;
  protected url: string;

  constructor(protected mock: boolean = false, useProxy: boolean = false) {
    if (useProxy) {
      this.url = 'https://cors-anywhere.herokuapp.com/' + appSettings.DATA_TIER_SERVER;
    } else {
      this.url = appSettings.DATA_TIER_SERVER;
    }
  }

  /**
   * Sets the keycloak token required to make API calls
   * @param token Main keycloak token sent in API calls
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * getToken gets the stored keycloak token
   */
  getToken() {
    return this.token;
  }

  /**
   * removeToken sets the token back to undefined
   */
  removeToken() {
    this.token = undefined;
  }

  /**
   * hasToken check whether service has a token
   */
  hasToken() {
    return this.token !== undefined;
  }

  /**
   * get the Auth header required to make an axios request
   */
  protected getAuthHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }

  getPromiseMockData(key: string) {
    return Promise.resolve(mockedData[key]);
  }

  /**
   * Access the api endpoint for projects if mock is false
   */
  protected async _fetchAvailableProjects() {
    if (this.mock) {
      return this.getPromiseMockData('GET/project');
    }

    const response = await axios.get(`${this.url}/${Endpoints.PROJECT}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Access the api endpoint for projects/project_id if mock is false otherwise return mocked data
   */
  protected async _fetchProjectDetails(projectId: string) {
    if (this.mock) {
      return this.getPromiseMockData('GET/project/project_id');
    }

    const response = await axios.get(`${this.url}/${Endpoints.PROJECT}/${projectId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  protected async _postNewProject(name: string) {
    const response = await axios.post(`${this.url}/${Endpoints.PROJECT}`, `name=${name}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Access the api endpoint for projects if mock is false otherwise return mocked data
   */
  protected async _fetchOwedDatasets() {
    if (this.mock) {
      return this.getPromiseMockData('GET/dataset');
    }

    const response = await axios.get(`${this.url}/${Endpoints.DATASET}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  private paramIsUndefined(param: unknown): param is [string, QueryParam] {
    const p = param as [string, QueryParam];
    return p[1] !== undefined;
  }

  private encodeParams(params: { [key: string]: QueryParam | undefined }): string {
    return Object.entries(params)
      .filter(this.paramIsUndefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  }

  /**
   * Fetch a dataset, file or metadata, with given id from a project with given project id.
   * @param projectId the id of the project which the dataset is a part of
   * @param datasetId the id of the dataset to be requested
   * @param mediaType the type of response requested
   */
  protected async _fetchDatasetFromProject(
    projectId: string,
    datasetId: string,
    mediaType?: AllowedMediaTypes,
  ) {
    const url = `${this.url}/${Endpoints.PROJECT}/${projectId}/${
      Endpoints.DATASET
    }/${datasetId}?${this.encodeParams({ format: mediaType })}`;

    const response = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /** Create new file on server
   * @param file the `File` object to be sent
   * @param MIMEType the MIME type of the file being sent.
   */
  protected async _postDataset(args: PostDatasetArgs) {
    const formData = new FormData();
    Object.entries(args).forEach(([key, value]) => formData.append(key, value));

    const response = await axios.post(`${this.url}/${Endpoints.DATASET}`, formData, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

/* spell-checker: disable */
const mockedData: any = {
  'GET/project': [
    {
      editors: ['dlister'],
      name: 'project-x',
      owner: 'dlister',
      projectId: 'project-cd1e6c92-81db-4e47-9834-4c1115e3b048',
    },
  ],
  'GET/project/project_id': {
    datasets: [
      {
        datasetId: 'dataset-319bc63b-6534-439a-91e1-4cbd1f87fa46',
        editors: ['dlister'],
        labels: ['project-x', 'project-y'],
        name: 'alpine',
        owner: 'dlister',
        projects: ['project-cd1e6c92-81db-4e47-9834-4c1115e3b048'],
        published: '2020-01-20T18:32:00+00:00',
        source: 'alpine.sdf',
        type: 'chemical/x-mdl-sdfile',
      },
    ],
    editors: ['dlister'],
    name: 'project-x',
    owner: 'dlister',
    projectId: 'project-cd1e6c92-81db-4e47-9834-4c1115e3b048',
  },

  'GET/dataset': [
    {
      datasetId: 'dataset-319bc63b-6534-439a-91e1-4cbd1f87fa46',
      editors: ['dlister'],
      labels: ['project-x', 'project-y'],
      name: 'alpine',
      owner: 'dlister',
      projects: ['project-cd1e6c92-81db-4e47-9834-4c1115e3b048'],
      published: '2020-01-20T18:32:00+00:00',
      source: 'alpine.sdf',
      type: 'chemical/x-mdl-sdfile',
    },
  ],
};
