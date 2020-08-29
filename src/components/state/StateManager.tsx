import React, { useState } from 'react';

import { useStoreState } from 'hooks/useStoreState';
import { DropzoneDialog } from 'material-ui-dropzone';
import { filterOutFromState } from 'modules/state/stateResolver';

import { IconButton, Tooltip } from '@material-ui/core';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';

import DownloadButton from '../downloadButton/DownloadButton';

interface IProps {}

const StateManagement = () => {
  const state = useStoreState();

  const dump = JSON.stringify(filterOutFromState(state));

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <>
      <DownloadButton filename={'name.json'} dump={dump} tooltip={'Download State as json'} />
      <Tooltip arrow title="Upload saved state">
        <IconButton aria-label="upload json state" onClick={() => setUploadDialogOpen(true)}>
          <PublishRoundedIcon />
        </IconButton>
      </Tooltip>
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
