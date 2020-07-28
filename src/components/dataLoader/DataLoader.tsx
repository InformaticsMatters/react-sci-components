import React, { useRef } from 'react';

import styled from 'styled-components';

import { CircularProgress, Divider as MuiDivider, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import { useMolecules } from '../../modules/molecules/molecules';
import Configuration from '../configuration/Configuration';
import ConfigManager from './ConfigManager';
import FieldConfiguration from './FieldConfiguration';
import SourceInputs from './SourceInputs';
import {
  addSource,
  FieldConfig,
  setWorkingSource,
  Source,
  useSources,
  useWorkingSource,
} from './sources';

interface IProps {
  sourceLabel?: string;
}

const getFieldsFromForm = (form: HTMLFormElement, fieldNames: string[]): FieldConfig[] => {
  return fieldNames.map((name) => {
    const min = form?.[`${name}-min`].value;
    const max = form?.[`${name}-max`].value;
    const dtype = form?.[`${name}-dtype`].value;
    const isNumeric = dtype === 'int' || dtype === 'float';

    return {
      name: name,
      nickname: form?.[`${name}-nickname`].value,
      dtype,
      min: isNumeric && min !== '' ? Number(min) : undefined,
      max: isNumeric && max !== '' ? Number(max) : undefined,
    };
  });
};

const getDataFromForm = (form: HTMLFormElement, fieldNames: string[]): Omit<Source, 'id'> => {
  const target = form as typeof form & { [key: string]: { value: string } };

  const url = target.sourcePath.value;
  const maxRecords = Number(target.maxRecords.value);
  const configName = target.configName.value ?? 'default';
  const configs = getFieldsFromForm(target, fieldNames);

  return { url, maxRecords, configName, configs };
};

const DataLoader = ({ sourceLabel }: IProps) => {
  const { fieldNames, isMoleculesLoading } = useMolecules();
  const sources = useSources();
  const currentSource = useWorkingSource();

  const formRef = useRef<HTMLFormElement>(null!);

  const handleLoad = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const source = getDataFromForm(formRef.current, fieldNames);
    setWorkingSource(source);
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const source = getDataFromForm(formRef.current, fieldNames);
    addSource(source);
  };

  return (
    <Configuration draggable title="SDF Sources" ModalOpenIcon={<GetAppIcon />}>
      <form
        ref={formRef}
        // update defaultValue of fields when currentSource changes
        key={`${currentSource.url}-${currentSource.configName}`}
      >
        <SourceInputs
          handleLoad={handleLoad}
          sources={sources}
          currentSource={currentSource}
          sourceLabel={sourceLabel}
        />
        <Typography variant="h6">Field Configuration</Typography>
        {isMoleculesLoading ? (
          <CircularProgress />
        ) : (
          !!currentSource.url && (
            <FieldsWrapper>
              <FieldConfiguration fieldNames={fieldNames} currentSource={currentSource} />
            </FieldsWrapper>
          )
        )}
        <Divider />
        <ConfigManager handleSave={handleSave} sources={sources} currentSource={currentSource} />
      </form>
    </Configuration>
  );
};

export default DataLoader;

const FieldsWrapper = styled.div`
  height: 40vh;
  overflow-y: scroll;
  width: 60vw;
`;

const Divider = styled(MuiDivider)`
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;
