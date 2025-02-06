import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

// Upload Image - Extract to different file
const uploadImage = (img: File) => {
    const formData = new FormData();

    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: { 'Content-Type': `${img.type}` },
    });
    return { request };
};


export default { uploadImage }
