import React, { useState } from 'react';

import { useStoreState } from 'hooks/useStoreState';
import { DropzoneDialog } from 'material-ui-dropzone';

import { IconButton } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import DownloadButton from '../downloadButton/DownloadButton';

interface IProps {}

const StateManagement = () => {
  const state = useStoreState();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <>
      <DownloadButton
        filename={'name.json'}
        dump={JSON.stringify(state)}
        tooltip={'Download State as json'}
      />
      <IconButton aria-label="upload json state" onClick={() => setUploadDialogOpen(true)}>
        <ArrowUpwardIcon />
      </IconButton>
      <DropzoneDialog
        filesLimit={1}
        onSave={(files: { text: () => Promise<any> }[]) => {
          files[0].text().then((txt) => {
            localStorage.setItem('state', txt);
            window.location.reload();
          });
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
