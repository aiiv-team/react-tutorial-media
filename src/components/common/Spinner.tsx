import React from "react";
import styled, { keyframes } from "styled-components";

interface SpinnerProps {
  size: number;
  inverted?: boolean;
}

const spinnerKeyframes = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const StyledSpinner = styled.div<Partial<SpinnerProps>>`
  border-radius: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  &:after {
    border-radius: 50%;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
  }
  border: ${(props) => props.size! / 8}px solid
    rgba(${(props) => (props.inverted ? "97, 97, 97" : "0, 0, 0")}, 0.2);
  border-left: ${(props) => props.size! / 8}px solid
    ${(props) => (props.inverted ? "#ffffff" : "#343434")};
  animation: ${spinnerKeyframes} 1.1s infinite linear;
`;

const defaultProps: Partial<SpinnerProps> = {
  size: 64,
};

const Spinner = (props: SpinnerProps) => {
  return <StyledSpinner size={props.size} inverted={props.inverted} />;
};
Spinner.defaultProps = defaultProps;

export default Spinner;
