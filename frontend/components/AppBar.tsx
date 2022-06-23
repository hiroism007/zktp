import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";

export function Bar() {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const logout = () => {
        console.log("");
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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
                    onClick={() => {}}
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
                    {/*<Typography*/}
                    {/*    component={"div"}*/}
                    {/*    variant={"h6"}*/}
                    {/*    sx={{ ml: 2, cursor: "pointer" }}*/}
                    {/*>*/}
                    {/*    ZK Token Proof*/}
                    {/*</Typography>*/}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                    {"shortAddress" && (
                        <>
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
                            >
                                <Typography
                                    component={"h2"}
                                    onClick={handleOpenUserMenu}
                                >
                                    {"connect"}
                                </Typography>
                            </Button>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem key={"logout"} onClick={logout}>
                                    <Typography textAlign="center">
                                        LOGOUT
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
