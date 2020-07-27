import React from 'react';

import styled from 'styled-components';

import { CircularProgress, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import { useMolecules } from '../../modules/molecules/molecules';
import Configuration from '../configuration/Configuration';
import FieldConfigForm from './FieldConfigForm';
import SourceForm from './SourceForm';
import { useSources } from './sources';

interface IProps {
  sourceLabel?: string;
}

const defaultSource = {
  url: '',
  maxRecords: 500,
  configName: 'default',
  fields: [],
};

const DataLoader = ({ sourceLabel }: IProps) => {
  const { fieldNames, isMoleculesLoading } = useMolecules();
  const sources = useSources();
  const [currentSource = { id: sources.length + 1, ...defaultSource }] = sources;

  return (
    <Configuration draggable title="SDF Sources" ModalOpenIcon={<GetAppIcon />}>
      <SourceForm sources={sources} currentSource={currentSource} sourceLabel={sourceLabel} />
      <Typography>Field Configuration</Typography>
      {isMoleculesLoading ? (
        <CircularProgress />
      ) : (
        !!currentSource.url && (
          <FieldsWrapper>
            <FieldConfigForm
              fieldNames={fieldNames}
              sources={sources}
              currentSource={currentSource}
            />
          </FieldsWrapper>
        )
      )}
    </Configuration>
  );
};

export default DataLoader;

const FieldsWrapper = styled.div`
  height: 50vh;
  overflow-y: scroll;
`;
