import React from 'react';

import styled from 'styled-components';

import FieldConfigInputs from './FieldConfigInputs';
import { Source } from './sources';

interface IProps {
  currentSource: Omit<Source, 'id'>;
  fieldNames: string[];
}

const FieldConfiguration = ({ currentSource, fieldNames }: IProps) => {
  const { configs } = currentSource;

  return (
    <FieldSet>
      {fieldNames.map((name, index) => {
        const config = configs.find((field) => field.name === name);
        return <FieldConfigInputs key={index} name={name} config={config} />;
      })}
    </FieldSet>
  );
};

export default FieldConfiguration;

const FieldSet = styled.fieldset`
  display: grid;
  grid-template-columns: 12rem repeat(4, 8rem);
  grid-gap: ${({ theme }) => theme.spacing(1)}px;
  border: none;
`;
