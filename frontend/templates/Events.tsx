import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import Container from "../components/Container";
import Form, { TForm } from "../components/Form";
import EventCreatedDialog from "../components/EventCreatedDialog";

type Props = {
    adminAddress: string;
    dialogOpen: boolean;
    sDialogOpen: boolean;
    eDialogOpen: boolean;
    eventId: string;
    inputEventId: string;
    handleSubmit: (form: TForm) => void;
    handleDialogClose: () => void;
    handleClickDialogOpen: () => void;
    handleSDialogClose: () => void;
    handleSDialogOpen: () => void;
    onClickVerify: () => void;
    onUpdateInputEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenJoinEvent: () => void;
    handleCloseJoinEvent: () => void;
    onClickJoinEvent: () => void;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default function EventsTemplate(props: Props) {
    return (
        <Container>
            <BootstrapDialog
                open={props.dialogOpen}
                onClose={props.handleDialogClose}
                disableEscapeKeyDown
                fullWidth={true}
            >
                <BootstrapDialogTitle
                    onClose={props.handleDialogClose}
                    id={"title"}
                >
                    Register Event
                </BootstrapDialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <Form
                        onSubmit={props.handleSubmit}
                        address={props.adminAddress}
                    />
                </DialogContent>
            </BootstrapDialog>
            <EventCreatedDialog
                eventId={props.eventId}
                dialogOpen={props.sDialogOpen}
                showDialog={props.handleSDialogOpen}
                closeDialog={props.handleSDialogClose}
            />
            <Dialog
                open={props.eDialogOpen}
                onClose={props.handleCloseJoinEvent}
            >
                <DialogTitle>Join Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To join a event, please enter the eventID here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="event ID"
                        fullWidth
                        variant="standard"
                        value={props.inputEventId}
                        onChange={props.onUpdateInputEvent}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleCloseJoinEvent}>Cancel</Button>
                    <Button onClick={props.onClickJoinEvent}>Find Event</Button>
                </DialogActions>
            </Dialog>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
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
                        onClick={props.handleClickDialogOpen}
                    >
                        <Typography
                            component={"h2"}
                            sx={{
                                fontSize: 32,
                            }}
                        >
                            {"Register Event"}
                        </Typography>
                    </Button>
                </Grid>
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 4,
                            md: 12,
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
                            paddingX: 9,
                            paddingY: 1,
                            "&:hover": {
                                backgroundColor: "#fff",
                                color: "rgba(62,51,62,1)",
                            },
                        }}
                        onClick={props.handleOpenJoinEvent}
                    >
                        <Typography
                            component={"h2"}
                            sx={{
                                fontSize: 32,
                            }}
                        >
                            {"Join Event"}
                        </Typography>
                    </Button>
                </Grid>
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 4,
                            md: 12,
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
                            paddingX: 9,
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
                                fontSize: 32,
                            }}
                        >
                            {"Verify Proof"}
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}
