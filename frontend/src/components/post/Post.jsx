import { Link, useNavigate } from "react-router-dom";
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
import { BsThreeDots, BsXSquare } from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postAtom from "../../atoms/postAtom";
import { MdContentCopy } from "react-icons/md";

const Post = ({ post, postedBy }) => {
  const [visibleInside, setVisibleInside] = useState(true);
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom);

  const navigate = useNavigate();
  const showToast = useShowToast();

  const copyUrl = () => {
    navigator.clipboard
      .writeText(`http://localhost:3000/${user.username}/post/${post._id}`)
      .then(() => {
        showToast("Success", "Post link copied", "success");
      });
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;
  if (visibleInside === true) {
    return (
      <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name={user?.name}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
            <Box position={"relative"} w={"full"}>
              {post.replies.length === 0 && (
                <Text textAlign={"center"}>🥱</Text>
              )}
              {post.replies[0] && (
                <Avatar
                  src={post.replies[0].userProfilePic}
                  size={"xs"}
                  name={post.replies[0].username}
                  position={"absolute"}
                  top={"0px"}
                  left={"15px"}
                  padding={"2px"}
                />
              )}
              {post.replies[1] && (
                <Avatar
                  src={post.replies[1].userProfilePic}
                  size={"xs"}
                  name={post.replies[1].username}
                  position={"absolute"}
                  top={"0px"}
                  left={"15px"}
                  padding={"2px"}
                />
              )}
              {post.replies[2] && (
                <Avatar
                  src={post.replies[2].userProfilePic}
                  size={"xs"}
                  name={post.replies[2].username}
                  position={"absolute"}
                  top={"0px"}
                  left={"15px"}
                  padding={"2px"}
                />
              )}
            </Box>
          </Flex>

          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                >
                  {user?.username}
                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text
                  fontSize={"xs"}
                  color={"gray.light"}
                  width={36}
                  textAlign={"right"}
                >
                  {formatDistanceToNow(new Date(post.createdAt))} ago
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
                          <BsXSquare />
                          <Text ml={2} color={"gray.light"}>
                            Hide Post
                          </Text>
                        </MenuItem>
                        <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                          <Flex>
                            <MdContentCopy />
                            <Text color={"gray.light"} ml={2}>Copy Link</Text>
                          </Flex>
                        </MenuItem>
                        {currentUser?._id === user._id && (
                          <MenuItem bg={"gray.dark"} onClick={handleDeletePost}>
                            <Flex>
                              <DeleteIcon />
                              <Text ml={2} color={"gray.light"}>
                                Delete
                              </Text>
                            </Flex>
                          </MenuItem>
                        )}
                      </MenuList>
                    </Portal>
                  </Menu>
                </Flex>
              </Flex>
            </Flex>
            <Text textAlign={"left"} fontSize={"sm"}>
              {post.text}
            </Text>
            {post.img && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={post.img} w={"full"} />
              </Box>
            )}
            <Flex gap={3} my={1}>
              {" "}
              <Actions post={post} />
            </Flex>
          </Flex>
        </Flex>
      </Link>
    );
  }
};

export default Post;
