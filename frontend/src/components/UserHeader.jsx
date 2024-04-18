import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom"
import useHandleFollow from "../hooks/useHandleFollow";
import { useSocket } from "../context/SocketContext";


const UserHeader = ({ user }) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollow, updating, following } = useHandleFollow(user)
  const { setSendingMessage } = useSocket();


  const copyUrl = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Success", "Profile link copied", "success");
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"left"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              thread.next
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic ? (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          ) : (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      <Flex flexDirection={"row"} gap={3}>
        {currentUser?._id === user._id ? (
          <RouterLink to="/update">
            <Button size={"sm"}>Update Profile</Button>
          </RouterLink>
        ) : (<>
          <Button size={"sm"} onClick={handleFollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
          <RouterLink to={`/chat`} onClick={()=>{
            setSendingMessage(user.username)
          }}>
            <Button size={"sm"} >Message</Button></RouterLink></>
        )}


      </Flex>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    <Text color={"gray.light"}>Copy Link</Text>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
