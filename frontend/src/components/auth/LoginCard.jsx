import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom.js";
import useShowToast from "../../hooks/useShowToast.js";
import userAtom from "../../atoms/userAtom.js";
import { PiWarningBold } from "react-icons/pi";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [hide,setHide] = useState(true)

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return
    setIsLoading(true)
    try {

      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
      setIsLoading(false)
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <Flex align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Login
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow={"lg"}
            p={8}
            w={{ sm: "400px", base: "full" }}
          >
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  autoFocus
                  type="text"
                  onChange={(e) => {
                    setInputs({ ...inputs, username: e.target.value });
                  }}
                  value={inputs.username}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    onKeyUp={(e)=>{
                      if(e.getModifierState("CapsLock"))
                      {
                        setHide(false)
                      }
                      else{
                        setHide(true)
                      }
                      
                    }}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      setInputs({ ...inputs, password: e.target.value });
                    }}
                    value={inputs.password}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Flex flexDirection={"row"} position={"relative"} hidden={hide}>
                <PiWarningBold color="yellow" />
                <Text  top={-1} position={"absolute"} left={6}> Caplock is on</Text>

              </Flex>

              <Stack spacing={10} pt={2}>
                <Button
                  type={!isLoading ? "submit" : "button"}
                  isLoading={isLoading}
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}

                >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don&apos;t have an account?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthScreen("signup")}
                  >
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
