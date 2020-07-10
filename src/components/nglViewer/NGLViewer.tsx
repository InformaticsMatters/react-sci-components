import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useCardActions } from 'components/cardView/cardActions';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({}));
interface IProps {}

const NGLViewer = () => {
  const classes = useStyles();
  const { colours } = useCardActions();

  const { isInNGLViewerIds } = useCardActions();

  return (
    <>
      <h4>IDs of molecules in NGL viewer</h4>
      <ul>
        {isInNGLViewerIds.map((id) => (
          <li>
            {id}: {colours.find((c) => c.id === id)?.colour ?? 'none'}
          </li>
        ))}
      </ul>
    </>
  );
};

export default NGLViewer;
