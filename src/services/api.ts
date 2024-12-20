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
export const bulkCreateUserApi = (data: {
    fullName: string, password: string, email: string, phone: string
}[]) => {
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data)
}
export const updateUserApi = (_id: string, fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<ICreateUser>>(urlBackend, { _id, fullName, phone })
}
export const deleteUserApi = (_id: string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<ICreateUser>>(urlBackend)
}
export const getBooksApi = (query: string) => {
    const urlBackend = `/api/v1/book${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend)
}
export const getCategoryAPI = () => {
    const urlBackend = `/api/v1/database/category`;
    return axios.get<IBackendRes<string[]>>(urlBackend)
}
export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios<IBackendRes<{
        fileUploaded: string;
    }>>({
        method: "post",
        url: 'api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        }
    })
}
export const createBookAPI = (
    mainText: string, author: string, price: number, sold: number, quantity: number,
    category: string, thumbnail: string, slider: string[]
) => {
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<IRegister>>(urlBackend, {mainText, author, price,sold, quantity,category, thumbnail, slider})
}