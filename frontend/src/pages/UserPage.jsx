import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/messagesAtom";
import postAtom from "../atoms/postAtom";

import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { Post, UserHeader } from "../components";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom)
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const setConversations = useSetRecoilState(conversationAtom);

  useEffect(() => {
    const getConversation = async () => {


      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data)

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getConversation()
  }, [showToast, setConversations]);

  useEffect(() => {
    const getUserPost = async () => {
      if(!user) return
      setFetchingPosts(true);
      setPosts([])
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getUserPost();
  }, [username, showToast,setPosts,user]);
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={24}></Spinner>
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts. </h1>}

      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} ></Post>
      ))}
    </>
  );
};

export default UserPage;
