import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import theme from "../styled/theme";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  body {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
    font-family: ${(p) => p.theme.fonts.body};
  }

  a {
    color: inherit;
  }

  #__next {
    height: 100%;
  }

  ::selection {
    background: ${(p) => p.theme.colors.accent};
  }

  ::-moz-selection {
    background: ${(p) => p.theme.colors.accent};
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Head>
        <title>Postcards</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
