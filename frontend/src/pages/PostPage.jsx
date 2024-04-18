import {
  Flex,
  Avatar,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Navigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
import { Actions, Comment } from "../components";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const { pId } = useParams();
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom)

  const currentPost = posts[0];
  useEffect(() => {
    const getUserPost = async () => {
      setFetchingPosts(true);
      setPosts([])
      try {
        const res = await fetch(`/api/posts/${pId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetchingPosts(false);
      }
    };

    getUserPost();
  }, [pId, showToast,setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      showToast("Success", "Post deleted", "success");
      Navigate(`/${user.username}`);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!currentPost) return null;

  if (fetchingPosts)
    return (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"} />
      </Flex>
    );

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            cursor={"pointer"}
            src={user.profilePic}
            size={"md"}
            name={user.name}
            onClick={() => {
              Navigate(`/${user.username}`);
            }}
          />
          <Flex>
            <Text
              cursor={"pointer"}
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={() => {
                Navigate(`/${user.username}`);
              }}
            >
              {user.username}
            </Text>
            <Image src="/public/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            color={"gray.light"}
            width={36}
            textAlign={"right"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          <Flex onClick={(e) => e.preventDefault()}>
            <Menu>
              <MenuButton>
                <BsThreeDots size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
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

      <Text my={3} textAlign={"left"}>
        {currentPost.text}
      </Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[currentPost.replies.length-1]._id}
        />
      ))}
    </>
  );
};

export default PostPage;
