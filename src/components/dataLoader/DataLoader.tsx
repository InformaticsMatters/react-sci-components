import React, { useRef, useState } from 'react';

import { useDatasetMeta } from 'hooks/useDatasetMeta';
import { useDatasets } from 'hooks/useDatasets';
import { useProjects } from 'hooks/useProjects';
import { AllowedMIMETypes, Dataset, Project } from 'services/apiTypes';
import styled from 'styled-components';

import {
  Button,
  CircularProgress,
  Divider as MuiDivider,
  FormGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import FieldConfiguration from './FieldConfiguration';
import { setWorkingSource, useWorkingSource } from './sources';
import { getDataFromForm } from './utils';

interface IProps {
  title: string;
  fileType: AllowedMIMETypes;
  enableConfigs: boolean;
}
/**
 * Component for loading and configuring sdf data files
 * @param name the use for the file selected by this data loader
 * @param fileType the type of file to allow selection of
 * @param enableConfigs whether to show the config inputs when a dataset is loaded
 */
const DataLoader: React.FC<IProps> = ({ title, fileType, enableConfigs }) => {
  const formRef = useRef<HTMLFormElement>(null!);

  const currentSource = useWorkingSource();

  const { isProjectsLoading, projects } = useProjects();
  let [currentProject, setCurrentProject] = useState<Project | null>(null);
  currentProject =
    currentProject ??
    projects.find((project) => project.projectId === currentSource?.projectId) ??
    null;
  let { isDatasetsLoading, datasets } = useDatasets(currentProject);
  let [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  currentDataset =
    currentDataset ??
    datasets.find((dataset) => dataset.datasetId === currentSource?.datasetId) ??
    null;
  const { isMetadataLoading, metadata } = useDatasetMeta(currentProject, currentDataset);

  datasets = datasets.filter(({ type }) => type === fileType);

  const handleLoad = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const datasetId = currentDataset?.datasetId;
    const projectId = currentProject?.projectId;
    if (metadata !== null && datasetId !== undefined && projectId !== undefined) {
      const formData = enableConfigs
        ? getDataFromForm(
            formRef.current,
            metadata.map(({ name }) => name),
          )
        : {};

      setWorkingSource({ title, state: { ...formData, projectId, datasetId } });
    }
  };

  return (
    <form
      ref={formRef}
      // update defaultValue of fields when currentSource changes
      key={`${currentSource?.datasetId}`}
    >
      <SourcesWrapper>
        <Autocomplete
          value={currentProject}
          id="project-selection"
          loading={isProjectsLoading}
          options={projects}
          getOptionLabel={(option) => option.name}
          fullWidth
          renderInput={(params) => (
            <TextField color="secondary" {...params} label="Select project" variant="outlined" />
          )}
          onChange={(_, newProject) => {
            setCurrentDataset(null);
            setCurrentProject(newProject);
          }}
        />

        <Autocomplete
          value={currentDataset}
          id="dataset-selection"
          loading={isDatasetsLoading}
          options={datasets}
          getOptionLabel={(option) => option.name}
          fullWidth
          renderInput={(params) => (
            <TextField color="secondary" {...params} label="Select dataset" variant="outlined" />
          )}
          onChange={(_, newDataset) => setCurrentDataset(newDataset)}
        />
      </SourcesWrapper>

      {enableConfigs && (
        <>
          <SourceRowTwo row>
            <TextField
              name="maxRecords"
              inputProps={{ min: 0, step: 100 }}
              type="number"
              label="Max. Records"
              variant="outlined"
              size="small"
              color="secondary"
              defaultValue={currentSource?.maxRecords ?? 500}
            />
            {/* {numOfMolsParsed !== undefined && (
          <Typography>
            <strong>{numOfMolsKept}</strong> loaded. <strong>{numOfMolsParsed}</strong> parsed.
          </Typography>
        )} */}
            <Button
              disabled={currentDataset === null || isMetadataLoading}
              variant="contained"
              color="primary"
              onClick={handleLoad}
            >
              Load
            </Button>
          </SourceRowTwo>

          <Divider />

          <FieldsWrapper>
            <Typography variant="h6">Field Configuration</Typography>
            {isMetadataLoading ? (
              <Progress />
            ) : metadata === null ? (
              <Typography>Load a data source to apply filters/transforms</Typography>
            ) : (
              <FieldConfiguration currentSource={currentSource} metadata={metadata} />
            )}
          </FieldsWrapper>
        </>
      )}
    </form>
  );
};

export default DataLoader;

const SourcesWrapper = styled.div`
  & > div {
    margin-bottom: ${({ theme }) => theme.spacing(1)}px;
    margin-top: ${({ theme }) => theme.spacing(1) / 1.5}px;
  }
`;

const SourceRowTwo = styled(FormGroup)`
  justify-content: space-between;
  align-items: baseline;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

const FieldsWrapper = styled.div`
  height: 40vh;
  overflow-y: scroll;
  text-align: center;
`;

const Divider = styled(MuiDivider)`
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const Progress = styled(CircularProgress)`
  margin-top: ${({ theme }) => theme.spacing(4)}px;
`;
