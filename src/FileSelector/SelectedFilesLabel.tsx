import React from 'react';

import { styled, Tooltip, Typography } from '@material-ui/core';

export interface SelectedFilesLabelProps {
  /**
   * Array of files that are selected
   */
  files: string[];
}

/**
 * Text describing the current selected file(s).
 * * If none are selected, "None" is displayed,
 * * If one file is selected, its name is displayed,
 * * If more than one file is selected, the name of the first is shown with how many more there are.
 */
export const SelectedFilesLabel = ({ files }: SelectedFilesLabelProps) => {
  return (
    <Label noWrap display="inline" variant="body2">
      Selected Files:{' '}
      {files.length === 1 ? (
        files[0]
      ) : files.length > 1 ? (
        <Tooltip title={files.slice(1).join(', ')}>
          <span>
            {files[0]} and <b>{files.length - 1} more</b>
          </span>
        </Tooltip>
      ) : (
        'None'
      )}
    </Label>
  );
};

const Label = styled(Typography)({
  whiteSpace: 'break-spaces',
});
