import React, { useState } from 'react';

import { Box, Button, Collapse, styled } from '@material-ui/core';

import { AllFilesList } from './AllFilesList';
import { SelectedFilesLabel } from './SelectedFilesLabel';
import type { SharedProps } from './types';

export interface FileSelectorProps extends Omit<SharedProps, 'projectId'> {
  projectId: string | undefined;
  disabled?: boolean;
}

/**
 * General component for selecting files from a project volume or favourite files from that project.
 */
export const FileSelector = (props: FileSelectorProps) => {
  const { value, targetType, projectId, disabled } = props;

  const [expanded, setExpanded] = useState(false);

  const openControls = (
    <>
      <SelectedFilesLabel files={value.map((file) => file.path)} />

      <RightButton
        disabled={disabled}
        size="small"
        variant="outlined"
        onClick={() => setExpanded(true)}
      >
        Select {targetType}
      </RightButton>
    </>
  );

  const closeControls = (
    <RightButton size="small" variant="outlined" onClick={() => setExpanded(false)}>
      Close
    </RightButton>
  );

  return (
    <>
      {projectId !== undefined && (
        <Collapse in={expanded}>
          <Box border="2px dashed" borderColor="grey.600" borderRadius={8} px={2} py={1}>
            <AllFilesList {...props} projectId={projectId} />
          </Box>
        </Collapse>
      )}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Box display="flex" paddingY={1}>
        {expanded ? closeControls : openControls}
      </Box>
    </>
  );
};

const RightButton = styled(Button)({
  marginLeft: 'auto',
});
