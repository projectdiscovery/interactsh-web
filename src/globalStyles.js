import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
  }
  .secondary_bg {
    background: ${({ theme }) => theme.secondaryBackground}!important;
  }
  .light_bg {
    background: ${({ theme }) => theme.lightBackground}!important;
  }
  `;

export default {};
