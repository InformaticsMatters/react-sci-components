import React from 'react';

import { IconButton, Tooltip } from '@material-ui/core';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';

interface Props {
  dump: string;
  filename: string;
  tooltip: string;
}

const DownloadButton = ({ dump, filename, tooltip }: Props) => {
  /*
   * Creates a Blob object which can be downloaded
   * Mime type using less common tab-separated-values
   * https://www.iana.org/assignments/media-types/text/tab-separated-values
   * Need to create hidden download link to initialise the download
   *
   * https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
   */

  const downloadTextAsFile = () => {
    const element = document.createElement('a');
    const file = new Blob([dump], { type: 'text/json' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <Tooltip arrow title={tooltip}>
      <IconButton onClick={downloadTextAsFile}>
        <GetAppRoundedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DownloadButton;
