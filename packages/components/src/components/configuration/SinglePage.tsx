import React from 'react';

import CloseIcon from '@material-ui/icons/Close';

import { CloseButton, Content, Title } from './components';
import Configuration from './Configuration';

interface IProps {
  title: string;
  close: () => void;
}

/**
 * Dialog content for when a single title/component is passed into ./Configuration
 */
const SinglePage: React.FC<IProps> = ({ title, close, children }) => {
  return (
    <Configuration>
      <Title id="modal-title">
        {title}
        <CloseButton aria-label="close" onClick={close}>
          <CloseIcon />
        </CloseButton>
      </Title>
      <Content dividers id="configuration-content">
        {children}
      </Content>
    </Configuration>
  );
};

export default SinglePage;
