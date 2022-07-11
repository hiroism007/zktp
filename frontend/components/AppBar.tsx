import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi";
import { useSnackbar } from "notistack";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Props = {
    onClickConnect?: () => void;
};

export function Bar(props: Props) {
    const { chain } = useNetwork();
    const { enqueueSnackbar } = useSnackbar();
    const { switchNetwork } = useSwitchNetwork();
    const { address: useAccountAddress } = useAccount();
    const [address, setAddress] = React.useState("");
    const [identityCommitment] = useLocalStorage("identityCommitment", "");

    React.useEffect(() => {
        if (
            chain &&
            chain.id !== 137 &&
            identityCommitment !== null &&
            identityCommitment !== ""
        ) {
            enqueueSnackbar("Invalid Network", { variant: "error" });
            switchNetwork?.(137);
        }
    }, [chain, enqueueSnackbar, identityCommitment, switchNetwork]);

    React.useEffect(() => {
        if (useAccountAddress) {
            const shortAddress = `${useAccountAddress.slice(
                0,
                4
            )}...${useAccountAddress.slice(-4)}`;
            setAddress(shortAddress);
        } else {
            setAddress("");
        }
    }, [useAccountAddress]);

    const ConnectOrLaunchApp = React.useMemo(() => {
        if (address) {
            return (
                <Typography component={"h2"} sx={{ cursor: "pointer" }}>
                    {address}
                </Typography>
            );
        } else {
            return (
                <Button
                    color="inherit"
                    variant={"outlined"}
                    sx={{
                        borderRadius: 50,
                        textTransform: "lowercase",
                        "&:hover": {
                            backgroundColor: "#fff",
                            color: "rgba(62,51,62,1)",
                        },
                    }}
                    onClick={props.onClickConnect}
                >
                    <Typography component={"h2"}>{"connect"}</Typography>
                </Button>
            );
        }
    }, [address, props.onClickConnect]);

    return (
        <AppBar
            position="static"
            sx={{
                background: "inherit",
            }}
            elevation={0}
        >
            <Toolbar>
                <Box
                    display="flex"
                    flexGrow={1}
                    sx={{ alignItems: "center", cursor: "pointer" }}
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            height: "42px",
                            padding: 0,
                            imageRendering: "-webkit-optimize-contrast",
                        }}
                        alt="top"
                        src={"/zktp.png"}
                    />
                </Box>
                <Box sx={{ flexGrow: 0 }}>{ConnectOrLaunchApp}</Box>
            </Toolbar>
        </AppBar>
    );
}
