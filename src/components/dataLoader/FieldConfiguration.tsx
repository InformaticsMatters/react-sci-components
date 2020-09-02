import React from 'react';

import styled from 'styled-components';

import FieldConfigInputs from './FieldConfigInputs';
import { StatePiece } from './sources';

interface IProps {
  currentSource: StatePiece | null;
  metadata: { name: string; type: string }[] | null;
}

const FieldConfiguration = ({ currentSource, metadata }: IProps) => {
  return (
    <FieldSet>
      {metadata?.map(({ name, type }, index) => {
        const config =
          currentSource === null
            ? null
            : currentSource.configs?.find((field) => field.name === name);
        return <FieldConfigInputs key={index} name={name} type={type} config={config} />;
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
