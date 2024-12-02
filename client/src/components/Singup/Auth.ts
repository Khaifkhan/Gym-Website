export const setAuthToken=(token:string)=>{
    document.cookie=`token=${token};path=/; HttpOnly; Secure`;
};

