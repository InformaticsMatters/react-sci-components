import React from 'react';

import styled from 'styled-components';

import { Typography } from '@material-ui/core';

import FieldConfigInputs from './FieldConfigInputs';
import { Source } from './workingSource';

interface IProps {
  currentSource: Source | null;
  metadata: { name: string; type: string }[] | null;
}

const FieldConfiguration = ({ currentSource, metadata }: IProps) => {
  if (metadata?.length) {
    return (
      <FieldSet>
        {metadata?.map(({ name, type }, index) => {
          const config =
            currentSource === null
              ? null
              : currentSource.configs?.find((field) => field.name === name);
          return <FieldConfigInputs config={config} key={index} name={name} type={type} />;
        })}
      </FieldSet>
    );
  } else {
    return <Typography>No fields exist in this dataset</Typography>;
  }
};

export default FieldConfiguration;

const FieldSet = styled.div`
  display: grid;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)}px;
  grid-template-columns: 2rem 10rem repeat(4, 1fr);
  grid-gap: ${({ theme }) => theme.spacing(1)}px;
`;
