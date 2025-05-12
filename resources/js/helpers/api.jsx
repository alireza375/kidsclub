import axios from "axios";

//apply base url for axios
// const API_URL = "http://127.0.0.1:8000/api";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const axiosApi = axios.create({
    baseURL: API_URL,
    validateStatus: function (status) {
        return status >= 200 && status < 600; // default
    },
});

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export async function get(url, data, config = {}, token_name = "token") {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
        localStorage.getItem(token_name) ?? ""
    }`;
    return await axiosApi
        .get(url, { ...config, params: { ...data } })
        .then((response) => response.data);
}
export async function postForm(url, data, config = {}) {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token") ?? ""
      }`;
    axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data";
    let formData = convertObjectToFormData(data);
    return axiosApi
      .post(url, formData, { ...config })
      .then((response) => response.data);
  }

export async function post(url, data, config = {}, token_name = "token") {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
        localStorage.getItem(token_name) ?? ""
    }`;
    return axiosApi
        .post(url, convertObjectToFormData(data), { ...config })
        .then((response) => response.data);
}
// export async function newPost(url, data, config = {}, token_name = "token") {
//     axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
//         localStorage.getItem(token_name) ?? ""
//     }`;
//     return axiosApi
//         .post(url, {...data}, { ...config })
//         .then((response) => response.data);
// }
export async function newPost(url, data, config = {}, token_name = "token") {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
        localStorage.getItem(token_name) ?? ""
    }`;

    // Ensure Content-Type is application/json
    if (!config.headers) {
        config.headers = {};
    }
    config.headers["Content-Type"] = "application/json";

    return axiosApi
        .post(url, data, config) // Directly send `data` in JSON format
        .then((response) => response.data);
}

// export async function put(url, data, config = {}, token_name = "token") {
//     axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
//         localStorage.getItem(token_name) ?? ""
//     }`;
//     return axiosApi
//         .put(url, { ...data }, { ...config })
//         .then((response) => response.data);
// }
export async function put(url, data, config = {}, token_name = "token") {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
        localStorage.getItem(token_name) ?? ""
    }`;

    // Ensure Content-Type is application/json
    if (!config.headers) {
        config.headers = {};
    }
    config.headers["Content-Type"] = "application/json";

    return axiosApi
        .put(url, data, config) // Directly pass `data` in JSON format
        .then((response) => response.data);
}

export async function del(url, data, config = {}, token_name = "token") {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
        localStorage.getItem(token_name) ?? ""
    }`;
    return await axiosApi
        .delete(url, { ...config, params: data })
        .then((response) => response.data);
}

export const convertObjectToFormData = (object) => {
    let form_data = new FormData();
    for (let key in object) {
        if (object[key] !== null && object[key] !== undefined) {
            if (Array.isArray(object[key])) {
                object[key].forEach((item, index) => {
                    if (
                        typeof item === "object" &&
                        !isFile(item) &&
                        item !== null &&
                        item !== undefined
                    ) {
                        for (let sub_key in item) {
                            form_data.append(
                                `${key}[${index}][${sub_key}]`,
                                item[sub_key]
                            );
                        }
                    } else {
                        form_data.append(`${key}[${index}]`, item);
                    }
                });
            } else {
                form_data.append(key, object[key]);
            }
        }
    }
    return form_data;
};

function isFile(input) {
    return "File" in window && input instanceof File;
}

export const API_URL_FOR_IMAGE = import.meta.env.VITE_IMAGE_URL;
