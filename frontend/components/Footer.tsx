import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const Footer = (): JSX.Element => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={1}
                    flexDirection={{ xs: "column", sm: "row" }}
                >
                    <Box
                        display={"flex"}
                        component="a"
                        href="/"
                        title="theFront"
                    >
                        <Box component={"img"} src={"/zktp.png"} height={32} />
                    </Box>
                    <Box display="flex" flexWrap={"wrap"} alignItems={"center"}>
                        <Box marginTop={1} marginRight={2}>
                            <Link
                                underline="none"
                                component="a"
                                href="https://twitter.com/zktokenproof"
                                color="white"
                                target={"_blank"}
                                variant={"subtitle2"}
                            >
                                Twitter
                            </Link>
                        </Box>
                        <Box marginTop={1} marginRight={2}>
                            <Link
                                underline="none"
                                component="a"
                                href="/"
                                color="white"
                                variant={"subtitle2"}
                            >
                                Discord
                            </Link>
                        </Box>
                        <Box marginTop={1} marginRight={2}>
                            <Link
                                underline="none"
                                component="a"
                                href="https://polygonscan.com/address/0x4B25e2F00F9320F9802C2A734b1890F1E41c77db#code"
                                color="white"
                                target={"_blank"}
                                variant={"subtitle2"}
                            >
                                Etherscan
                            </Link>
                        </Box>
                        <Box marginTop={1} marginRight={2}>
                            <Link
                                underline="none"
                                component="a"
                                href="https://github.com/hiroism007/zktp"
                                color="white"
                                target={"_blank"}
                                variant={"subtitle2"}
                            >
                                Documentation
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    align={"center"}
                    variant={"subtitle2"}
                    color="white"
                    gutterBottom
                >
                    &copy; zktp. 2022, All rights reserved
                </Typography>
                <Typography
                    align={"center"}
                    variant={"caption"}
                    color="white"
                    component={"p"}
                >
                    ZKTokenProof delivers a decentralized seamless Zero
                    Knowledge based token-gating solution for real-world and
                    online use cases of ticketing features with privacy.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Footer;
