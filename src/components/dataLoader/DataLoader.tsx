import React, { useRef, useState } from 'react';

import styled from 'styled-components';

import { CircularProgress, Divider as MuiDivider, Typography } from '@material-ui/core';

import { useMolecules } from '../../modules/molecules/molecules';
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

const getFieldsFromForm = (form: HTMLFormElement, fieldNames: string[]): FieldConfig[] => {
  return fieldNames.map((name) => {
    const min = form?.[`${name}-min`]?.value;
    const max = form?.[`${name}-max`]?.value;
    const dtype = form?.[`${name}-dtype`]?.value;
    const isNumeric = dtype === 'int' || dtype === 'float';

    return {
      enabled: form?.[`${name}-enabled`]?.checked,
      name: name,
      nickname: form?.[`${name}-nickname`]?.value,
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

interface IProps {
  sourceLabel?: string;
}
/**
 * Component for loading and configuring sdf data files
 * @param sourceLabel the label text displayed in the main source text field
 */
const DataLoader = ({ sourceLabel }: IProps) => {
  const {
    molecules,
    totalParsed,
    fieldNames,
    isMoleculesLoading,
    moleculesErrorMessage,
  } = useMolecules();
  const sources = useSources();
  const currentSource = useWorkingSource();

  const formRef = useRef<HTMLFormElement>(null!);
  const [currentUrl, setCurrentUrl] = useState(''); // Monitor state of source field to conditionally display field configs

  const handleLoad = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const source = getDataFromForm(formRef.current, fieldNames);
    if (currentUrl !== currentSource.url) {
      source.configs = [];
    }
    setWorkingSource(source);
  };

  const handleSave = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const source = getDataFromForm(formRef.current, fieldNames);
    if (currentUrl !== currentSource.url) {
      source.configs = [];
    }
    addSource(source);
  };

  return (
    <form
      ref={formRef}
      // update defaultValue of fields when currentSource changes
      key={`${currentSource.url}-${currentSource.configName}`}
    >
      <SourceInputs
        numOfMolsKept={molecules.length}
        numOfMolsParsed={totalParsed}
        setCurrentUrl={setCurrentUrl}
        handleLoad={handleLoad}
        sources={sources}
        currentSource={currentSource}
        sourceLabel={sourceLabel}
        moleculesErrorMessage={moleculesErrorMessage}
      />
      <FieldsWrapper>
        <Typography variant="h6">Field Configuration</Typography>
        {isMoleculesLoading ? (
          <Progress />
        ) : !!currentSource.url && currentUrl === currentSource.url ? (
          <FieldConfiguration fieldNames={fieldNames} currentSource={currentSource} />
        ) : (
          <Typography>Load a data source to apply filters/transforms</Typography>
        )}
      </FieldsWrapper>
      <Divider />
      <ConfigManager handleSave={handleSave} sources={sources} currentSource={currentSource} />
    </form>
  );
};

export default DataLoader;

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
