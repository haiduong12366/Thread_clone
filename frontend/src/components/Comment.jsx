import { Flex, Avatar, Text,Divider } from "@chakra-ui/react";


const Comment = ({reply,lastReply}) => {
    return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} name={reply.username}/>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontStyle={"bold"}>{reply.username}</Text>
                
            </Flex>
            <Text textAlign={"left"}>{reply.text}</Text>
            
            
        </Flex>
        
    </Flex>{!lastReply ? <Divider my={4}/>:null }
    

    </>
  )
}

export default Comment