import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
import { useParams } from "react-router-dom";

const CreatePost = () => {
  const  {username}  = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const user = useRecoilValue(userAtom);
  const Max_Char = 500;
  const [remainingChar, setRemainingChar] = useState(Max_Char);
  const imgRef = useRef(null);
  const [h, setH] = useState("110px");
  const [posts, setPosts] = useRecoilState(postAtom);
  

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > Max_Char) {
      const truncateText = inputText.slice(0, Max_Char);
      setPostText(truncateText);
      setRemainingChar(0);
    } else {
      if (e.target.scrollHeight > 110) {
        setH("inherit");
        setH(`${e.target.scrollHeight}px`);
      }
      setPostText(inputText);
      setRemainingChar(Max_Char - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      onClose();

      showToast("Success", "Post created successfully", "success");
      if(!username) setPosts([data, ...posts]);
      if (username === user.username) setPosts([data, ...posts]);
      setPostText("");
      setImgUrl(null);
      setH("110px");
      setRemainingChar(Max_Char);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>
      <form>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <Textarea
                  h={h}
                  overflow={"hidden"}
                  resize={"none"}
                  placeholder="What do you think?"
                  onChange={handleTextChange}
                  value={postText}
                />
                <Text
                  fontSize={"xs"}
                  fontWeight={"bold"}
                  textAlign={"right"}
                  m={1}
                  color={"gray.800"}
                >
                  {remainingChar}/{Max_Char}
                </Text>

                <Input
                  type="file"
                  hidden
                  ref={imgRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <BsFillImageFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                  onClick={() => {
                    imgRef.current.click();
                  }}
                ></BsFillImageFill>
              </FormControl>
              {imgUrl && (
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={imgUrl} alt="Select image" />
                  <CloseButton
                    onClick={() => {
                      setImgUrl(null);
                    }}
                    bg={"gray.800"}
                    position={"absolute"}
                    top={2}
                    right={2}
                  />
                </Flex>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleCreatePost}
                isLoading={isLoading}
                type={isLoading ? "button" : "submit"}
              >
                Post
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>
    </>
  );
};

export default CreatePost;
