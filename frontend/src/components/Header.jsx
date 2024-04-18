import { Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mt="6" mb="12">
      {user && (
        <RouterLink to="/">
          <AiFillHome size={24} />
        </RouterLink>
      )}
      {!user && (
        <RouterLink
          to="/auth"
          onClick={() => {
            setAuthScreen("login");
          }}
        >
          Login
        </RouterLink>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <RouterLink to={`/${user.username}`}>
            <RxAvatar size={24} />
          </RouterLink>
          <RouterLink to={`/chat`}>
            <BsFillChatQuoteFill size={24} />
          </RouterLink>
          <RouterLink to={`/settings`}>
            <MdOutlineSettings size={24} />
          </RouterLink>

          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <RouterLink
          to="/auth"
          onClick={() => {
            setAuthScreen("signup");
          }}
        >
          Sign up
        </RouterLink>
      )}
    </Flex>
  );
};

export default Header;
