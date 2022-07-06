import Head from "next/head";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import createEmotionCache from "../utilities/createEmotionCache";
import lightTheme from "../styles/theme/light";
import { WagmiConfig, createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import React from "react";

const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector()],
});
const clientSideEmotionCache = createEmotionCache();

interface AppPropsWithLayout extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp(props: AppPropsWithLayout) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    return (
        <WagmiConfig client={client}>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                variant={"success"}
            >
                <CacheProvider value={emotionCache}>
                    <Head>
                        <meta
                            name="viewport"
                            content="initial-scale=1, width=device-width"
                        />
                    </Head>
                    <ThemeProvider theme={lightTheme}>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </ThemeProvider>
                </CacheProvider>
            </SnackbarProvider>
        </WagmiConfig>
    );
}

export default MyApp;
