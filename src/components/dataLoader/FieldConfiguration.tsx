import React from 'react';

import styled from 'styled-components';

import FieldConfigInputs from './FieldConfigInputs';
import { Source } from './sources';

interface IProps {
  currentSource: Omit<Source, 'id'>;
  fieldNames: string[];
}

const FieldConfiguration = ({ currentSource, fieldNames }: IProps) => {
  const { configs, url, configName, maxRecords } = currentSource;
  return (
    <FieldSet>
      {fieldNames
        .filter((name) => name !== 'oclSmiles')
        .map((name, index) => {
          const config = configs.find((field) => field.name === name);
          return (
            <FieldConfigInputs
              key={`${url}-${configName}-${maxRecords}-${index}`}
              name={name}
              config={config}
            />
          );
        })}
    </FieldSet>
  );
};

export default FieldConfiguration;

const FieldSet = styled.div`
  display: grid;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)}px;
  grid-template-columns: auto 10rem repeat(4, 8rem);
  grid-gap: ${({ theme }) => theme.spacing(1)}px;
`;
