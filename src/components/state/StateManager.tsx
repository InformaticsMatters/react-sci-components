import { DropzoneDialog } from 'material-ui-dropzone';
import React, { useState } from 'react';

import { IconButton } from '@material-ui/core';
//import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

// import { useStoreState } from '../../hooks/useStoreState';
import DownloadButton from '../downloadButton/DownloadButton';
import { getStore } from 'hooks-for-redux';

//const useStyles = makeStyles((theme: Theme) => createStyles({}));
interface IProps {}

const StateManagement = () => {
  //const classes = useStyles();

//   const state = useStoreState();
  const store = getStore();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <>
      <DownloadButton
        filename={'name.json'}
        // dump={JSON.stringify(state)}
        dump={''}
        tooltip={'Download State as json'}
      />
      <IconButton aria-label="upload json state" onClick={() => setUploadDialogOpen(true)}>
        <ArrowUpwardIcon />
      </IconButton>
      <DropzoneDialog
        filesLimit={1}
        onSave={(files: { text: () => Promise<any>; }[]) => {
          files[0]
            .text()
            .then((txt) => store.dispatch({ type: 'SET_FULL_STATE', payload: JSON.parse(txt) }));
          setUploadDialogOpen(false);
        }}
        onClose={() => {
          setUploadDialogOpen(false);
        }}
        open={uploadDialogOpen}
      />
    </>
  );
};

export default StateManagement;
