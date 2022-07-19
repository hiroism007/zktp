import React from "react";
import {
    Box,
    Button,
    FormControl,
    Grid,
    Input,
    InputAdornment,
    InputLabel,
    Stack,
    Typography,
} from "@mui/material";
import Container from "../components/Container";
import { Event } from "../utilities/entities";
import { AccountCircle, Diamond } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";

type Props = {
    event: Event;
    onClickJoinEvent: () => void;
    onClickGenerateProof: () => void;
    solidityProof?: string;
};

export default function EventDetailTemplate(props: Props) {
    return (
        <Container>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="flexStart"
                spacing={2}
            >
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 4,
                            md: 12,
                        },
                    }}
                >
                    <Container maxWidth={800} paddingY={"0 !important"}>
                        <Typography
                            component={"h2"}
                            sx={{
                                fontSize: 42,
                                color: "white",
                            }}
                        >
                            {props.event.title}
                        </Typography>
                    </Container>
                </Grid>
                <Grid item>
                    <Container maxWidth={800} paddingY={"0 !important"}>
                        <Stack spacing={2}>
                            <FormControl variant="standard">
                                <InputLabel htmlFor="input-with-icon-adornment">
                                    Admin Address
                                </InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    value={props.event.adminAddress || ""}
                                    readOnly
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            </FormControl>
                            <FormControl variant="standard">
                                <InputLabel htmlFor="input-with-icon-adornment">
                                    Contract Address
                                </InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Diamond />
                                        </InputAdornment>
                                    }
                                    value={props.event.contractAddress || ""}
                                    readOnly
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            </FormControl>
                            <Button
                                color="inherit"
                                variant={"outlined"}
                                sx={{
                                    textTransform: "none",
                                    color: "white",
                                    paddingX: 7,
                                    paddingY: 1,
                                    "&:hover": {
                                        backgroundColor: "#fff",
                                        color: "rgba(62,51,62,1)",
                                    },
                                }}
                                onClick={props.onClickJoinEvent}
                            >
                                <Typography
                                    component={"h2"}
                                    sx={{
                                        fontSize: 22,
                                    }}
                                >
                                    {"Join Event"}
                                </Typography>
                            </Button>
                            <Button
                                color="inherit"
                                variant={"outlined"}
                                sx={{
                                    textTransform: "none",
                                    color: "white",
                                    paddingX: 7,
                                    paddingY: 1,
                                    "&:hover": {
                                        backgroundColor: "#fff",
                                        color: "rgba(62,51,62,1)",
                                    },
                                }}
                                onClick={props.onClickGenerateProof}
                            >
                                <Typography
                                    component={"h2"}
                                    sx={{
                                        fontSize: 22,
                                    }}
                                >
                                    {"Generate Proof"}
                                </Typography>
                            </Button>
                            {props.solidityProof && (
                                <Box
                                    sx={{
                                        color: "white",
                                        mt: 3,
                                        borderRadius: 1,
                                        textAlign: "center",
                                        fontSize: "1rem",
                                        fontWeight: "700",
                                    }}
                                >
                                    <QRCodeSVG
                                        value={props.solidityProof}
                                        size={300}
                                    />
                                </Box>
                            )}
                        </Stack>
                    </Container>
                </Grid>
            </Grid>
        </Container>
    );
}
