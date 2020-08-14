import { IconButton, Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import React from 'react';
import { useStoreState } from '../../hooks/useStoreState';

interface Props {
  dump: string;
  filename: string;
  tooltip: string;
};

interface SliceData {
  name: string;
  dump: string;
};

const DownloadButton = ({ dump, filename, tooltip }: Props) => {
  /*
   * Creates a Blob object which can be downloaded
   * Mime type using less common tab-separated-values
   * https://www.iana.org/assignments/media-types/text/tab-separated-values
   * Need to create hidden download link to initialise the download
   *
   * https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
   */

  const state = useStoreState();

  const downloadTextAsFile = () => {
    //dump = JSON.stringify(state);
    dump = createStateDump();
    const element = document.createElement('a');
    const file = new Blob([dump], { type: 'text/tab-separated-values' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const createStateDump = () => {
    const sliceNames = Object.keys(state);
    const slices: SliceData[] = sliceNames.map(name => {
      const sliceData = state[name];
      return {name: name, dump: JSON.stringify(sliceData)};
    });

    return JSON.stringify(slices);

  };

  return (
    <Tooltip arrow title={tooltip}>
      <IconButton onClick={downloadTextAsFile}>
        <GetAppIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DownloadButton;
