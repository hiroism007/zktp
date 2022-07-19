import React from "react";
import {
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
import { QR } from "../utilities/entities";
import { AccountCircle, Diamond } from "@mui/icons-material";

type Props = {
    onUpdateProof: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickVerify: () => void;
    proof: string;
    qrData: QR;
};

export default function VerifyTemplate(props: Props) {
    const Form = React.useMemo(() => {
        if (!props.qrData.id) return <></>;

        return (
            <>
                <FormControl variant="standard">
                    <InputLabel htmlFor="input-with-icon-adornment">
                        Event ID
                    </InputLabel>
                    <Input
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        value={props.qrData.id}
                        readOnly
                        sx={{
                            color: "white",
                        }}
                    />
                </FormControl>
                <FormControl variant="standard">
                    <InputLabel htmlFor="input-with-icon-adornment">
                        NullifierHash
                    </InputLabel>
                    <Input
                        startAdornment={
                            <InputAdornment position="start">
                                <Diamond />
                            </InputAdornment>
                        }
                        value={props.qrData.nullifierHash || ""}
                        readOnly
                        sx={{
                            color: "white",
                        }}
                    />
                </FormControl>
            </>
        );
    }, [props.qrData]);

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
                            {"Verify Proof"}
                        </Typography>
                    </Container>
                </Grid>
                <Grid item>
                    <Container maxWidth={800} paddingY={"0 !important"}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="input-with-icon-adornment">
                                PROOF
                            </InputLabel>
                            <Input
                                value={props.proof}
                                sx={{
                                    color: "white",
                                }}
                                onChange={props.onUpdateProof}
                            />
                        </FormControl>
                    </Container>
                </Grid>
                <Grid item>
                    <Container maxWidth={800} paddingY={"0 !important"}>
                        <Stack spacing={2}>
                            {Form}
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
                                onClick={props.onClickVerify}
                            >
                                <Typography
                                    component={"h2"}
                                    sx={{
                                        fontSize: 22,
                                    }}
                                >
                                    {"Verify"}
                                </Typography>
                            </Button>
                        </Stack>
                    </Container>
                </Grid>
            </Grid>
        </Container>
    );
}
