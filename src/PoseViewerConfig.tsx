import React from 'react';

import Configuration from './components/configuration/Configuration';

interface IProps {}

const PoseViewerConfig: React.FC<IProps> = () => {
  return (
    <Configuration titles={['a', 'b', 'c']}>
      <p>a</p>
      <p>b</p>
      <p>c</p>
    </Configuration>
  );
};

export default PoseViewerConfig;
