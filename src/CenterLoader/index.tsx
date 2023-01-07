import React from "react";

import { CircularProgress, styled } from "@material-ui/core";

export const CenterLoader = () => {
  return <Progress />;
};

const Progress = styled(CircularProgress)({
  position: "relative",
  left: "calc(50% - 20px)",
});
