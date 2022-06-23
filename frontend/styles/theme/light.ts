import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default:
                "linear-gradient(90deg, rgba(223,191,231,0.8758096988795518) 0%, rgba(121,9,121,1) 50%, rgba(62,51,62,1) 100%)",
        },
    },
});

export default lightTheme;
