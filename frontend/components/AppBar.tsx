import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useAccount, useEnsName } from "wagmi";

type Props = {
    onClickConnect?: () => void;
};

export function Bar(props: Props) {
    const { data: account } = useAccount();
    const { data: ensName } = useEnsName({ address: account?.address });
    const [address, setAddress] = React.useState("");

    React.useEffect(() => {
        if (ensName) {
            setAddress(ensName);
        } else if (account?.address) {
            const shortAddress = `${account.address.slice(
                0,
                4
            )}...${account.address.slice(-4)}`;
            setAddress(shortAddress);
        } else {
            setAddress("");
        }
    }, [account?.address, ensName]);

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
