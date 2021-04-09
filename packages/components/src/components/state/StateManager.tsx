import React, { useState } from 'react';

import { DropzoneDialog } from 'material-ui-dropzone';

import { IconButton, Tooltip } from '@material-ui/core';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';

import { useStoreState } from '../../hooks/useStoreState';
import { STATE_KEY } from '../../modules/state/stateConfig';
import { filterOutFromState } from '../../modules/state/stateResolver';
import DownloadButton from '../DownloadButton';

const STATE_VERSION = '4.0.0';

interface IProps {}

const StateManagement: React.FC<IProps> = () => {
  const state = useStoreState();

  const dump = JSON.stringify({
    __version__: STATE_VERSION,
    ...filterOutFromState(state),
  });

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
        onSave={async (files: File[]) => {
          const txt = await files[0].text();
          localStorage.setItem(STATE_KEY, txt);
          window.location.reload();
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
