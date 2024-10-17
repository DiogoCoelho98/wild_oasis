import styled, { css } from "styled-components";

const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 5rem;
      font-weight: 700;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
        font-size: 2.5rem;
        font-weight: 600;
    css`}
    ${(props) =>
    props.as === "h3" &&
    `
    font-size: 2rem;
    `}
`;

export default Heading;
