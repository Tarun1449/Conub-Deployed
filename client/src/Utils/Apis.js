const baseUrl = "https://conub.onrender.com";

//Authentication 
const signupApi = `${baseUrl}/api/auth/signup`;
const loginApi = `${baseUrl}/api/auth/login`;
const verifyTokenApi = `${baseUrl}/api/auth/authorize`;
const logoutApi = `${baseUrl}/api/auth/logout`;


//UserApi
const searchUserApi = `${baseUrl}/user/search`;
const AddFriendApi = `${baseUrl}/user/addfriend`;
const getFriendsApi = `${baseUrl}/user/friends`;


//Messages Related Api
const getMessagesApi = `${baseUrl}/messages/getmessages`;

module.exports = { baseUrl,signupApi,loginApi,verifyTokenApi,logoutApi,searchUserApi,AddFriendApi,getFriendsApi,getMessagesApi };
