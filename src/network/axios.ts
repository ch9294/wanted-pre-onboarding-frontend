import axios, {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";


// const baseURL = process.env.WANTED_PRE_ONBOARDING_INTERNSHIP_BASE_URL;
const baseURL: string = "https://www.pre-onboarding-selection-task.shop/";

const mainConfig: AxiosRequestConfig = {
    baseURL,
    headers: {"Content-Type": "application/json"},
    timeout: 3000,
}

const userConfig: AxiosRequestConfig = {
    baseURL,
    headers: {"Content-Type": "application/json"},
    timeout: 3000,
}

const mainApi = axios.create(mainConfig);
const userApi = axios.create(userConfig);
mainApi.interceptors.request.use((config) => {
    const jwt = localStorage.getItem("wanted-access-token");

    if (config.headers && jwt) {
        const newConfig = {
            ...config,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        return newConfig as InternalAxiosRequestConfig;
    }
    return config;
}, (error) => {

});


const responseFulfilledInterceptor = (response: AxiosResponse<any, any>) => {

    return response;
};

const responseRejectedInterceptor = (error: AxiosError) => {
    const code = error.code;

    if (code === "ECONNABORTED") { // timeout일 경우
        console.log("타임아웃 에러 발생하였습니다");
    }
    return Promise.reject(error);
}

userApi.interceptors.response.use(responseFulfilledInterceptor, responseRejectedInterceptor)


export {userApi, mainApi};