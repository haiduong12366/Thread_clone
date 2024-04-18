import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

const UserPost = ({  likes, replies, postImg, postTitle }) => {
  const [visibleInside, setVisibleInside] = useState(true);
  const [liked, setLiked] = useState(false);
  if (visibleInside == true) {
    return (
      <Link to={`/markzuckerberg/post/1`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name="Mark Zuckerberg"
              src="/public/zuck-avatar.png"
            />
            <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
            <Box position={"relative"} w={"full"}>
              <Avatar
                src="https://bit.ly/dan-abramov"
                size={"xs"}
                name="John doe"
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
              <Avatar
                src="https://bit.ly/kent-c-dodds"
                size={"xs"}
                name="John doe"
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
              />
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size={"xs"}
                name="John doe"
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
              />
            </Box>
          </Flex>

          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  markzuckerberg
                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text fontStyle={"sm"} color={"gray.light"}>
                  1d
                </Text>
                <Flex onClick={(e) => e.preventDefault()}>
                  <Menu>
                    <MenuButton>
                      <BsThreeDots size={24} cursor={"pointer"} />
                    </MenuButton>
                    <Portal>
                      <MenuList bg={"gray.dark"}>
                        <MenuItem
                          bg={"gray.dark"}
                          onClick={() => {
                            setVisibleInside(false);
                          }}
                        >
                          <Text color={"gray.light"}>Hide Post</Text>
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                </Flex>
              </Flex>
            </Flex>
              <Text textAlign={"left"} fontSize={"sm"}>{postTitle}</Text>
            {postImg && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={postImg} w={"full"} />
              </Box>
            )}
            <Flex gap={3} my={1}>
              {" "}
              <Actions liked={liked} setLiked={setLiked} />
            </Flex>
            <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"} fontSize={"sm"}>
                {replies} replies
              </Text>
              <Box
                w={0.5}
                h={0.5}
                borderRadius={"full"}
                bg={"gray.light"}
              ></Box>
              <Text color={"gray.light"} fontSize={"sm"}>
                {likes + (liked ? 1: 0)} likes
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    );
  }
};

export default UserPost;
