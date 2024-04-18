import  { useState } from 'react'
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const useHandleFollow = (user) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [following,setFollowing] = useState(user.followers.includes(currentUser?._id||""))
  const [updating,setUpdating] = useState(false)

    const handleFollow =async()=>{
        if(!currentUser){
          showToast("Error", "Please login to follow", "error");
          return;
        }
        setUpdating(true)
        try {
          const res = await fetch(`/api/users/follow/${user._id}`,{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            
          })
          const data = await res.json()
          if(data.error){
            showToast("Error", data.error, "error");
            return
          }
          if(following){
            showToast("Success", `Unfollow ${user.name}`, "success")
            user.followers = user.followers.filter(item => item !== currentUser?._id)
          }
          else{
            showToast("Success", `Follow ${user.name}`, "success")
            user.followers.push(currentUser?._id)
          }
          setFollowing(!following)
          console.log(data)
        } catch (error) {
          showToast("Error", error, "error");
        }finally{
          setUpdating(false)
        }
      }
  return {handleFollow,updating,following}
}

export default useHandleFollow