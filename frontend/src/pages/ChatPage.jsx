import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {conversationAtom,selectedConversationAtom,} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { GiConversation } from "react-icons/gi";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";
import { Conversation, MessageContainer } from "../components";

const ChatPage = () => {
  const { onlineUsers, socket } = useSocket();
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { sendingMessage } = useSocket(); 


  useEffect(() => {
    socket?.on("messageSeen", ({ conversationId }) => {
      setConversations(prev => {
        const updateConversation = prev.map(conversation => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true
              }
            }

          }
          return conversation
        })
        return updateConversation
      })
    })
  }, [socket, setConversations])

  useEffect(() => {
    const getConversation = async () => {
      if (loadingConversations) return
      setLoadingConversations(true)

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
      } finally {
        setLoadingConversations(false);
        if (sendingMessage != null)
          await handleConversationSearch(sendingMessage)
      }
    };

    getConversation()
  }, [showToast, setConversations]);



  const handleConversationSearch = async (username) => {
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${username}`)
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      const messageYourSelf = data._id === currentUser._id;
      if (messageYourSelf) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === data._id
      );


      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: data._id,
          username: data.username,
          userProfilePic: data.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        participants: [
          {
            _id: data._id,
            userId: data._id,
            username: data.username,
            profilePic: data.profilePic,
            mock: true,
          },
        ],
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: data._id,
      }
      setConversations(p => [...p.filter(m =>m.mock !==true), mockConversation])
      console.log(mockConversation.participants[0])
      setSelectedConversation(mockConversation.participants[0]);

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "full" }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            textAlign={"left"}
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your conversation
          </Text>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleConversationSearch(searchText)
          }}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={(e) => {
                  e.preventDefault();
                  handleConversationSearch(searchText)
                }}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
