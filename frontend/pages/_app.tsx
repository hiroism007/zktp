import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import createEmotionCache from "../utilities/createEmotionCache";
import lightTheme from "../styles/theme/light";
import { createClient, configureChains, chain, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.polygon],
    [publicProvider()]
);

const client = createClient({
    provider,
    webSocketProvider,
    autoConnect: true,
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
