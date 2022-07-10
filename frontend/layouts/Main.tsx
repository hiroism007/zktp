import Head from "next/head";
import { Backdrop, CircularProgress, Container, Divider } from "@mui/material";
import React from "react";
import { Bar } from "../components/AppBar";
import Footer from "../components/Footer";
import Contaier2 from "../components/Container";

type Props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    onClickConnect?: () => void;
    children: React.ReactNode;
    title?: string;
};

export default function MainLayout(props: Props) {
    return (
        <div>
            <Bar onClickConnect={props.onClickConnect} />
            <Container>
                <Head>
                    <title>{props.title || "zktp"}</title>
                    <meta
                        name="description"
                        content="ZKTokenProof is a Zero Knowledge based ticketing/token proof application."
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: theme => theme.zIndex.modal + 100,
                    }}
                    open={props.loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                {props.children}
                <Contaier2 maxWidth={800} paddingY={"0 !important"}>
                    <Divider />
                </Contaier2>
                <Contaier2>
                    <Footer />
                </Contaier2>
            </Container>
        </div>
    );
}
