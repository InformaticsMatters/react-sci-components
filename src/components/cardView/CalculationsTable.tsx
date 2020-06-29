import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Score } from 'modules/molecules/molecules';

interface Props {
  properties: Score[];
  calcs?: { [key: string]: string };
  blacklist?: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      maxWidth: '1rem',
    },
    cell: {
      fontSize: '.7rem',
      padding: theme.spacing(1),
    },
  }),
);

const CalculationsTable = ({ calcs, blacklist = [], properties }: Readonly<Props>) => {
  const classes = useStyles();

  return (
    <Table size="small">
      <TableBody>
        {properties
          .filter((property) => !blacklist.includes(property.name))
          .map(({ name, value }, index) => (
            <TableRow key={index}>
              <TableCell className={classes.cell} component="th">
                {calcs?.[name] || name}
              </TableCell>
              <TableCell className={classes.cell} align="right">
                {+value.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default CalculationsTable;
