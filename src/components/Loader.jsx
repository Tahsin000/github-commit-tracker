import { CircularProgress, Box } from "@mui/material";

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" marginY={3}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
