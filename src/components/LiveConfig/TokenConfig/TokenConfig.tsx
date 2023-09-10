import { useSelector } from "react-redux";
import EnterToken from "./EnterToken";
import ResetToken from "./ResetToken";
import { type RootState } from "../../../redux/LiveConfig/store";

const TokenConfig: React.FC = () => {
  const token = useSelector((state: RootState) => state.app.apiToken);

  return token === "" ? <ResetToken /> : <EnterToken />;
};

export default TokenConfig;
