
import { signupApi ,loginApi ,verifyTokenApi,logoutApi,searchUserApi,AddFriendApi, getFriendsApi, getMessagesApi} from "./Apis";
import axios from 'axios';

export const signUpService = async (formData) => {
    
    console.log(formData); // Make sure `signup` is defined and has the correct value
    try {
        const response = await axios.post(signupApi, {formData}); // Use `signup` instead of `signUp`
        return response;
    } catch (error) {

        throw error;
    }
};

export const loginService = async (email,password) =>{
    try{
        const response = await axios.post(loginApi,{email,password},{
            withCredentials:true
        });
        return response;
    }catch(error){
        
        throw error;
    }
}
export const verifyTokenService = async()=>{
    try{
        const responce  = await axios.post(verifyTokenApi,null,{
            withCredentials:true
        });
        return responce
    }
    catch(error){
        console.log(error);
        throw error;
    }
}
export const logoutService = async()=>{
    try{
        const responce = await axios.get(logoutApi,{
            withCredentials:true
        })
        return responce;
    }catch(error){
        console.log(error);
        throw error;
    }
}
export const SearchService = async(query)=>{
    try{
        const response = axios.post(searchUserApi,{query},{
            withCredentials:true
        })
        return response;
    }catch(error){
        console.log(error)
        throw error;
    }
}
export const addfriendService = async(item)=>{
    try{
        const responce = await axios.post(AddFriendApi,{item},{
            withCredentials:true
        });
        return responce
    }catch(error){
        console.log(error);
        throw error;
    }
}
export const getFriendsService = async()=>{
    try{
        const responce = await axios.get(getFriendsApi,{
            withCredentials:true
        });
        return responce;
    }catch(error){
        throw error
    }
}
export const getMessagesService = async(recipientId,page)=>{
    try{
        console.log("resId: "+recipientId);
        const responce = axios.post(getMessagesApi,{recipientId,page},{
            withCredentials:true
        })
        return responce
    }catch(error){
        console.log(error)
        throw error
    }
}