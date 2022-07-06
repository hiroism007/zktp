import React from "react";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PublishIcon from "@mui/icons-material/Publish";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import Container from "../components/Container";
import Link from "next/link";

const howTo = [
    {
        title: "Connect",
        color: "#FFC050",
        subtitle: "Connect wallet and generate your ZK-friendly ID",
        icon: (
            <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
            </svg>
        ),
    },
    {
        title: "Create event",
        subtitle:
            "Anyone can create events where those with certain NFT can join",
        icon: <LocalFireDepartmentIcon />,
        color: "red",
    },
    {
        title: "Join event/Create Proof",
        subtitle:
            "If you have a certain NFT for the event, you can join and create a proof",
        icon: <PublishIcon />,
        color: "blue",
    },
];

type Props = {
    address: string;
};

export default function HomeTemplate(props: Props) {
    return (
        <Container>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Grid item>
                    <Box>
                        <Box marginBottom={4}>
                            <Box marginBottom={2}>
                                <Typography
                                    variant="h4"
                                    color="white"
                                    align={"center"}
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    ZKTokenProof is a ZK based ticketing/token
                                    proof solution
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    color="white"
                                    sx={{ fontWeight: 400 }}
                                    align={"center"}
                                >
                                    that enables users without revealing their
                                    wallet addresses prove ownership of NFTs.
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    color="white"
                                    sx={{ fontWeight: 300, mt: 2 }}
                                    align={"center"}
                                >
                                    For example, Anyone can easily mange limited
                                    events where only those with a particular
                                    NFT.
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    color="white"
                                    sx={{ fontWeight: 300 }}
                                    align={"center"}
                                >
                                    Participants can prove that they have one of
                                    the NFT without revealing their wallet
                                    addresses.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        {howTo.map((item, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Box width={1} height={1}>
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                    >
                                        <Box
                                            component={Avatar}
                                            width={60}
                                            height={60}
                                            marginBottom={2}
                                            bgcolor={"white"}
                                            color={item.color}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Typography
                                            variant={"h6"}
                                            gutterBottom
                                            sx={{ fontWeight: 500 }}
                                            align={"center"}
                                            color={"white"}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            color={"white"}
                                            align={"center"}
                                        >
                                            {item.subtitle}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 2,
                            md: 8,
                        },
                    }}
                >
                    <Button
                        color="inherit"
                        variant={"outlined"}
                        sx={{
                            borderRadius: 50,
                            textTransform: "none",
                            color: "white",
                            paddingX: 7,
                            paddingY: 1,
                            "&:hover": {
                                backgroundColor: "#fff",
                                color: "rgba(62,51,62,1)",
                            },
                        }}
                    >
                        <Link
                            href={
                                props.address ? "/events" : "/docs/introduction"
                            }
                        >
                            <Typography
                                component={"h2"}
                                sx={{
                                    fontSize: 32,
                                }}
                            >
                                {props.address ? "Launch App" : "Learn More"}
                            </Typography>
                        </Link>
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}
