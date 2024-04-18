import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import usePreviewImg from "../hooks/usePreviewImg.js";
import useShowToast from "../hooks/useShowToast.js";
import { PiWarningBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
    bio: user.bio,
  });
  const fileRef = useRef(null);
  const [hide, setHide] = useState(true)
  const { handleImageChange, imgUrl } = usePreviewImg();
  let navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
      setIsLoading(false);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };
  //
  return (
    <><Flex position={"absolute"} left={-200} top={0}>
      <Button onClick={() => navigate(-1)}>
        <RiLogoutBoxLine size={35} /></Button>
    </Flex>

      <form onSubmit={handleSubmit}>
        <Flex align={"center"} justify={"center"} my={6}>
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            bg={useColorModeValue("white", "gray.dark")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              User Profile Edit
            </Heading>
            <FormControl id="userName">
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar
                    size="xl"
                    boxShadow={"md"}
                    src={imgUrl || user.profilePic}
                  />
                </Center>
                <Center w="full">
                  <Button
                    w="full"
                    onClick={() => {
                      fileRef.current.click();
                    }}
                  >
                    Change Avatar
                  </Button>
                  {/* hide input and ref to another button */}
                  <Input
                    type="file"
                    hidden
                    ref={fileRef}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Center>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>Full name</FormLabel>
              <Input
                placeholder="John Doe"
                _placeholder={{ color: "gray.500" }}
                type="text"
                onChange={(e) => {
                  setInputs({ ...inputs, name: e.target.value });
                }}
                value={inputs.name}
              />
            </FormControl>
            <FormControl>
              <FormLabel>User name</FormLabel>
              <Input
                placeholder="johndoe"
                _placeholder={{ color: "gray.500" }}
                type="text"
                onChange={(e) => {
                  setInputs({ ...inputs, username: e.target.value });
                }}
                value={inputs.username}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: "gray.500" }}
                type="email"
                onChange={(e) => {
                  setInputs({ ...inputs, email: e.target.value });
                }}
                value={inputs.email}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Input
                placeholder="Your bio."
                _placeholder={{ color: "gray.500" }}
                type="text"
                onChange={(e) => {
                  setInputs({ ...inputs, bio: e.target.value });
                }}
                value={inputs.bio}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                onKeyUp={(e) => {
                  if (e.getModifierState("CapsLock")) {
                    setHide(false)
                  }
                  else {
                    setHide(true)
                  }

                }}
                placeholder="password"
                _placeholder={{ color: "gray.500" }}
                type="password"
                onChange={(e) => {
                  setInputs({ ...inputs, password: e.target.value });
                }}
                value={inputs.password}
              />
            </FormControl>
            <Flex flexDirection={"row"} position={"relative"} hidden={hide}>
              <PiWarningBold color="yellow" />
              <Text top={-1} position={"absolute"} left={6}> Caplock is on</Text>

            </Flex>
            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                onClick={() => navigate(-1)}
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>

              <Button
                isLoading={isLoading}
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "green.500",
                }}
                type={isLoading ? "button" : "submit"}
              >
                Submit
              </Button>

            </Stack>
          </Stack>
        </Flex>
      </form>
    </>
  );
}
