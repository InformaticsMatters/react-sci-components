import React, { useState } from 'react';

import { Box, Button, Collapse, styled } from '@material-ui/core';

import { MiniFileList } from './MiniFileList';
import { SelectedFilesLabel } from './SelectedFilesLabel';
import type { SharedProps } from './types';

export interface FileSelectorProps extends Omit<SharedProps, 'projectId'> {
  projectId: string | undefined;
}

/**
 * General component for selecting files from a project volume or favourite files from that project.
 */
export const FileSelector = (props: FileSelectorProps) => {
  const { value, targetType, projectId } = props;

  const [expanded, setExpanded] = useState(false);

  // Convert the value so a consistent string array format
  const files = [value].flat().filter((f): f is string => f !== undefined);

  const openControls = (
    <>
      <SelectedFilesLabel files={files} />

      <RightButton size="small" variant="outlined" onClick={() => setExpanded(true)}>
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
          <MiniFileList {...props} projectId={projectId} />
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
