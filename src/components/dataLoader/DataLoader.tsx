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
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { addConfig, SourceConfig, useSourceConfigs } from './configs';
import FieldConfiguration from './FieldConfiguration';
import { getDataFromForm, getDataset, getProject } from './utils';
import { setWorkingSource, useWorkingSource } from './workingSource';

interface IProps {
  title: string;
  fileType: AllowedMIMETypes;
  enableConfigs: boolean;
  loading?: boolean;
  error?: string | null;
  totalParsed?: number;
  moleculesKept?: number;
}
/**
 * Component for loading and configuring sdf and pdb data files
 * @param name the use for the file selected by this data loader
 * @param fileType the type of file to allow selection of
 * @param enableConfigs whether to show the config inputs when a dataset is loaded.
 * Typically sdf use this feature but not pdb datasets.
 * @param loading whether data is currently being loaded, controls the Load button
 * loading indicator.
 * @param error The main error message to display.
 * @param totalParsed the total number of molecules parsed including those filtered out
 * @param moleculesKept the total number of molecules parsed excluding those filtered out
 */
const DataLoader: React.FC<IProps> = ({
  title,
  fileType,
  enableConfigs,
  loading,
  error,
  totalParsed,
  moleculesKept,
}) => {
  const formRef = useRef<HTMLFormElement>(null!);

  const configs = useSourceConfigs();
  const [selectedConfig, setSelectedConfig] = useState<SourceConfig | null>(null);

  const currentSources = useWorkingSource();
  const currentSource =
    selectedConfig ?? currentSources.find((slice) => slice.title === title)?.state ?? null;

  const { isProjectsLoading, projects, projectsError } = useProjects();
  let [currentProject, setCurrentProject] = useState<Project | null>(null);
  currentProject = currentProject ?? getProject(projects, currentSource?.projectId) ?? null;
  let { isDatasetsLoading, datasets, datasetsError } = useDatasets(currentProject);
  let [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  currentDataset = currentDataset ?? getDataset(datasets, currentSource?.datasetId) ?? null;
  const { isMetadataLoading, metadata, metadataError } = useDatasetMeta(
    currentProject,
    currentDataset,
  );

  datasets = datasets.filter(({ type }) => type === fileType);

  const handleAction = (mode: string) => () => {
    const datasetId = currentDataset?.datasetId;
    const projectId = currentProject?.projectId;
    if (datasetId !== undefined && projectId !== undefined) {
      const formData =
        enableConfigs && metadata !== null
          ? getDataFromForm(
              formRef.current,
              metadata.map(({ name }) => name),
            )
          : {};
      if (mode === 'load') {
        setWorkingSource({ title, state: { ...formData, projectId, datasetId } });
      } else if (mode === 'save' && enableConfigs) {
        const configName = formRef.current['configName'].value as string;
        configName && addConfig({ datasetId, projectId, configName, ...formData });
      }
    }
  };

  return (
    <form
      ref={formRef}
      // update defaultValue of fields when currentSource changes
      key={`${currentSource?.datasetId}-${selectedConfig?.id}`}
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
            <TextField
              color="secondary"
              {...params}
              label={projectsError || 'Select project'}
              error={!!projectsError}
              variant="outlined"
            />
          )}
          onChange={(_, newProject) => {
            setSelectedConfig(null);
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
            <TextField
              color="secondary"
              {...params}
              label={datasetsError || 'Select dataset'}
              error={!!datasetsError}
              variant="outlined"
            />
          )}
          onChange={(_, newDataset) => {
            setSelectedConfig(null);
            setCurrentDataset(newDataset);
          }}
        />
      </SourcesWrapper>

      <>
        <SourceRowTwo row>
          {enableConfigs && (
            <>
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
              {totalParsed !== undefined && moleculesKept !== undefined && (
                <Typography>
                  <strong>{moleculesKept}</strong> loaded. <strong>{totalParsed}</strong> parsed.
                </Typography>
              )}
            </>
          )}
          <Button
            disabled={currentDataset === null || isMetadataLoading || loading}
            variant="contained"
            color="primary"
            onClick={handleAction('load')}
          >
            Load
            {loading && <Progress size={24} />}
          </Button>
        </SourceRowTwo>

        {enableConfigs && (
          <>
            <Divider />

            <FieldsWrapper>
              <Typography variant="h6">Field Configuration</Typography>
              {isMetadataLoading ? (
                <LinearProgress color="secondary" />
              ) : !!metadataError || !!error ? (
                <>
                  {metadataError && <Typography>{metadataError}</Typography>}
                  {error && <Typography>{error}</Typography>}
                </>
              ) : metadata === null ? (
                <Typography>Load a data source to apply filters/transforms</Typography>
              ) : (
                <FieldConfiguration currentSource={currentSource} metadata={metadata} />
              )}
            </FieldsWrapper>

            <Divider />

            <ConfigSaveFormGroup row>
              <Autocomplete
                value={selectedConfig}
                size="small"
                freeSolo
                handleHomeEndKeys
                options={configs.filter((config) => config.datasetId === currentDataset?.datasetId)}
                getOptionLabel={(option) => option.configName}
                onChange={(_, newValue) =>
                  typeof newValue !== 'string' && newValue !== null && setSelectedConfig(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="configName"
                    variant="outlined"
                    color="secondary"
                    placeholder="Config Name"
                  />
                )}
              />
              <Button variant="outlined" color="primary" onClick={handleAction('save')}>
                Save
              </Button>
            </ConfigSaveFormGroup>
          </>
        )}
      </>
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
  height: calc(80vh - 345px);
  overflow-y: scroll;
  text-align: center;
`;

const Divider = styled(MuiDivider)`
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const Progress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const ConfigSaveFormGroup = styled(FormGroup)`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  > div:first-child {
    width: 15rem;
    margin-right: ${({ theme }) => theme.spacing(2)}px;
  }
`;
