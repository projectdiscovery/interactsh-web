import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    transition: all 0.50s linear;
  }
  .secondary_bg {
    background: ${({ theme }) => theme.secondaryBackground};
    transition: all 0.50s linear;
  }
  `;
