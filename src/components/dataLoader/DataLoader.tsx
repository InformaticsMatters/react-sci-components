import React, { useRef, useState } from 'react';

import styled from 'styled-components';

import {
  Button,
  CircularProgress,
  FormGroup,
  LinearProgress,
  Divider as MuiDivider,
  TextField,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useDatasetMeta, useDatasets, useProjects } from '../../hooks';
import { SourceConfig, addConfig, useSourceConfigs } from './configs';
import FieldConfiguration from './FieldConfiguration';
import { getDataFromForm, getDataset, getProject } from './utils';
import { setWorkingSource, useWorkingSource } from './workingSource';

import type { AllowedMIMETypes, Dataset, Project } from '@squonk/data-tier-client';

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
        setWorkingSource({
          title,
          state: { ...formData, projectId, datasetId },
        });
      } else if (mode === 'save' && enableConfigs) {
        const configName = formRef.current['configName'].value as string;
        configName && addConfig({ datasetId, projectId, configName, ...formData });
      }
    }
  };

  return (
    <form
      key={`${currentSource?.datasetId}-${selectedConfig?.id}`}
      // update defaultValue of fields when currentSource changes
      ref={formRef}
    >
      <SourcesWrapper>
        <Autocomplete
          fullWidth
          getOptionLabel={(option) => option.name}
          id="project-selection"
          loading={isProjectsLoading}
          options={projects}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              error={!!projectsError}
              label={projectsError || 'Select project'}
              variant="outlined"
            />
          )}
          value={currentProject}
          onChange={(_, newProject) => {
            setSelectedConfig(null);
            setCurrentDataset(null);
            setCurrentProject(newProject);
          }}
        />

        <Autocomplete
          fullWidth
          getOptionLabel={(option) => option.name}
          id="dataset-selection"
          loading={isDatasetsLoading}
          options={datasets}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              error={!!datasetsError}
              label={datasetsError || 'Select dataset'}
              variant="outlined"
            />
          )}
          value={currentDataset}
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
                color="secondary"
                defaultValue={currentSource?.maxRecords ?? 500}
                inputProps={{ min: 0, step: 100 }}
                label="Max. Records"
                name="maxRecords"
                size="small"
                type="number"
                variant="outlined"
              />
              {totalParsed !== undefined && moleculesKept !== undefined && (
                <Typography>
                  <strong>{moleculesKept}</strong> loaded. <strong>{totalParsed}</strong> parsed.
                </Typography>
              )}
            </>
          )}
          <Button
            color="primary"
            disabled={currentDataset === null || isMetadataLoading || loading}
            variant="contained"
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
                freeSolo
                handleHomeEndKeys
                getOptionLabel={(option) => option.configName}
                options={configs.filter((config) => config.datasetId === currentDataset?.datasetId)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    name="configName"
                    placeholder="Config Name"
                    variant="outlined"
                  />
                )}
                size="small"
                value={selectedConfig}
                onChange={(_, newValue) =>
                  typeof newValue !== 'string' && newValue !== null && setSelectedConfig(newValue)
                }
              />
              <Button color="primary" variant="outlined" onClick={handleAction('save')}>
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

// TODO: Make reusable @ref LoginButton.tsx
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
