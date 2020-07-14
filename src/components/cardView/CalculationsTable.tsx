import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React from 'react';

interface IProps {
  properties: { name: string; value: number | string }[];
  calcs?: { [key: string]: string };
  blacklist?: string[];
  fontSize?: number | string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cell: {
      fontSize: ({ fontSize }: IProps) => fontSize,
      paddingLeft: 0,
      paddingRight: 0,
    },
    cellData: {
      maxWidth: '3rem',
      fontSize: ({ fontSize }: IProps) => fontSize,
      marginLeft: theme.spacing(1),
    },
  }),
);

const CalculationsTable = (props: Readonly<IProps>) => {
  const { calcs, blacklist = [], properties } = props;
  const classes = useStyles(props);

  return (
    <Table size="small">
      <TableBody>
        {properties
          .filter((property) => !blacklist.includes(property.name))
          .map(({ name, value }, index) => {
            if (typeof value === 'number') {
              value = +value.toFixed(2); // Round to 2 sig fig and remove pad.
            }

            return (
              <TableRow key={index}>
                <TableCell size="small" className={classes.cell} component="th">
                  {calcs?.[name] ?? name}
                </TableCell>
                <TableCell size="small" className={classes.cell} align="right">
                  <Typography className={classes.cellData} noWrap>
                    {value}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default CalculationsTable;
