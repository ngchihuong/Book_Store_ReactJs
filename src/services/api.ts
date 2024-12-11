import axios from "services/axios.customize";

export const loginApi = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 3000 ///.... 
        }
    })
}
export const registerApi = (fullName: string, password: string, email: string, phone: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, password, email, phone })
}
export const fetchAccountApi = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 3000
        }
    })
}

export const logoutApi = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<ILogin>>(urlBackend)
}
export const getUsersApi = (query: string) => {
    const urlBackend = `/api/v1/user${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}
export const createUserApi = (fullName: string, password: string, email: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.post<IBackendRes<ICreateUser>>(urlBackend, { fullName, password, email, phone })
}