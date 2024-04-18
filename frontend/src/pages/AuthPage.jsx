import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import { LoginCard, SignupCard } from "../components";



const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)

  return (
    <>
      {authScreenState === "login" ? <LoginCard/>:<SignupCard/>}
    </>
  );
};

export default AuthPage;
