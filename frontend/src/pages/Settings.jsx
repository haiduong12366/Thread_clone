import { Button, Flex, Text } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';

const Settings = () => {
    const showToast = useShowToast();
    const logout = useLogout()

    const freezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?")) return
        try {
            const res = await fetch(`/api/users/freeze`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            if (data.success) {
                await logout()
                showToast("Success", data.success, "success");
                return;
            }
        } catch (error) {
            showToast("Error", error, "error");
        }
    }

    return (<>
        <Text my={1} fontWeight={"bold"} textAlign={"left"}>Freeze Your Account</Text>
        <Text my={1} textAlign={"left"}>You can unfreeze your account anytime by logging in.</Text>
        <Flex>
            <Button size={"sm"} colorScheme={"red"} onClick={freezeAccount}>Freeze</Button></Flex>
    </>
    )
}

export default Settings