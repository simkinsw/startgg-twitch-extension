import EnterToken from "./EnterToken";
import ResetToken from "./ResetToken";

interface TokenConfigProps {
    token: string | null;
}

const TokenConfig: React.FC<TokenConfigProps> = ({ token }) => {
    
    //TODO: get token from redux once its saved

    return (
        token ?
            <ResetToken token={token} />
            :
            <EnterToken />
    );
};

export default TokenConfig;
