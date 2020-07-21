import React from 'react';

import styled from 'styled-components';

import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';

interface IProps {
  properties: { name: string; value: number | string }[];
  calcs?: { [key: string]: string };
  blacklist?: string[];
  fontSize?: number | string;
}

const CalculationsTable = ({ calcs, blacklist = [], properties, fontSize }: Readonly<IProps>) => {
  return (
    <Table>
      <TableBody>
        {properties
          .filter((property) => !blacklist.includes(property.name))
          .map(({ name, value }, index) => {
            if (typeof value === 'number') {
              value = +value.toFixed(2); // Round to 2 sig fig and remove pad.
            }

            return (
              <TableRow key={index}>
                <Cell fontSize={fontSize} component="th">
                  {calcs?.[name] ?? name}
                </Cell>
                <CellTd fontSize={fontSize} align="left">
                  <CellText fontSize={fontSize} noWrap>
                    {value}
                  </CellText>
                </CellTd>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default CalculationsTable;

type CellExtraProps = { fontSize: number | string | undefined };

const Cell = styled(TableCell)<CellExtraProps>`
  font-size: ${({ fontSize }) => fontSize};
  padding-top: ${({ theme }) => theme.spacing(0.5)}px;
  padding-bottom: ${({ theme }) => theme.spacing(0.5)}px;
  padding-right: 0;
  padding-left: 0;
`;

const CellTd = styled(Cell)`
  width: 100%;
  padding-left: ${({ theme }) => theme.spacing(1)}px;
`;

const CellText = styled(Typography)<CellExtraProps>`
  font-size: inherit; /* Inherit from Cell */
  width: 0;
  min-width: 100%;
`;
