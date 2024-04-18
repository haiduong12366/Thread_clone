import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { conversationAtom } from "../atoms/messagesAtom";

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom)
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useRecoilState(conversationAtom);

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
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([])
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1>Follow some users too see the feed</h1>
        )}
        {loading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}</Box>
      <Box flex={30} display={{
        base: "none",
        md: "block"
      }}>
        <SuggestedUsers />

      </Box>
    </Flex>
  );
};

export default HomePage;
