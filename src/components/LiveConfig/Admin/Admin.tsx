import { Box } from "@mui/material";
import SetDataForm from "./SetDataForm";

const Admin: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <SetDataForm />
    </Box>
  );
};

export default Admin;
