import React from 'react';

import { Box } from '@material-ui/core';

import { AllFilesList } from './AllFilesList';
import type { SharedProps } from './types';

/**
 * List of files and directories, either from the list of favourites or project volume, with option
 * to select them.
 */
export const MiniFileList = (props: SharedProps) => {
  return (
    <Box border="2px dashed" borderColor="grey.600" borderRadius={8} px={2} py={1}>
      <AllFilesList {...props} />
    </Box>
  );
};
