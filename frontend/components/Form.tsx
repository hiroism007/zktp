import * as React from "react";
import * as yup from "yup";
import * as ethers from "ethers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField } from "@mui/material";

const formSchema = yup
    .object()
    .required()
    .shape({
        title: yup.string().required("Input your event title!"),
        contractAddress: yup
            .string()
            .test("isAddress", "You should input valid address", value =>
                ethers.utils.isAddress(value || "")
            )
            .required(),
        adminAddress: yup
            .string()
            .test("isAddress", "You should input valid address", value =>
                ethers.utils.isAddress(value || "")
            )
            .required(),
        feeInETH: yup
            .string()
            .test("isValidETH", "You should input valid fee in ETH", value => {
                try {
                    ethers.utils.parseEther(value || "");
                    return true;
                } catch (e) {
                    return false;
                }
            })
            .required(),
    });

export type TForm = Readonly<{
    title: string;
    contractAddress: string;
    adminAddress: string;
    feeInETH: string;
}>;

type Props = {
    address: string;
    onSubmit: (form: TForm) => void;
};

export default function Form(props: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TForm>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            adminAddress: props.address,
        },
    });

    return (
        <Stack
            spacing={3}
            sx={{
                minWidth: {
                    sm: 420,
                },
            }}
        >
            <TextField
                required
                fullWidth={true}
                label="title"
                error={"title" in errors}
                helperText={errors.title?.message}
                {...register("title")}
            />
            <TextField
                required
                fullWidth={true}
                label="adminAddress"
                error={"adminAddress" in errors}
                aria-readonly={true}
                helperText={errors.adminAddress?.message}
                {...register("adminAddress")}
            />
            <TextField
                required
                fullWidth={true}
                label="contractAddress"
                type="string"
                error={"contractAddress" in errors}
                helperText={errors.contractAddress?.message}
                {...register("contractAddress")}
            />
            <TextField
                required
                fullWidth={true}
                label="fee in ETH"
                placeholder={"4.2"}
                type="string"
                error={"feeInETH" in errors}
                helperText={errors.feeInETH?.message}
                {...register("feeInETH")}
            />
            <Button
                size="large"
                sx={{
                    textTransform: "none",
                    background:
                        "linear-gradient(90deg, rgba(223,191,231,0.8758096988795518) 0%, rgba(121,9,121,1) 50%, rgba(62,51,62,1) 100%)",
                    "&:hover": {
                        backgroundColor: "#fff",
                        color: "rgba(62,51,62,1)",
                    },
                    color: "white",
                }}
                onClick={handleSubmit(props.onSubmit)}
            >
                Register
            </Button>
        </Stack>
    );
}
