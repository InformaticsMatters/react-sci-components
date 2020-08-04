import React from 'react';

import CloseIcon from '@material-ui/icons/Close';

import { CloseButton, Content, Title } from './components';

interface IProps {
  title: string;
  close: () => void;
}

const SinglePage: React.FC<IProps> = ({ title, close, children }) => {
  return (
    <>
      <Title id="modal-title">
        {title}
        <CloseButton aria-label="close" onClick={close}>
          <CloseIcon />
        </CloseButton>
      </Title>
      <Content dividers id="configuration-content">
        {children}
      </Content>
    </>
  );
};

export default SinglePage;
