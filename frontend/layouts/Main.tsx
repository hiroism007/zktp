import Head from "next/head";
import { Backdrop, CircularProgress, Container } from "@mui/material";
import React from "react";
import { Bar } from "../components/AppBar";

type Props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    children: React.ReactNode;
};

export function MainLayout(props: Props) {
    return (
        <div>
            <Bar />
            <Container>
                <Head>
                    <title></title>
                    <meta
                        name="description"
                        content="ZKTokenProof is a Zero Knowledge based ticketing/token proof application."
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: theme => theme.zIndex.drawer + 1,
                    }}
                    open={props.loading}
                    onClick={() => props.setLoading(false)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                {props.children}
            </Container>
        </div>
    );
}
