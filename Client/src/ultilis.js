import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const jwtTranslate = (cookiesAccessToken) => {
  if (!cookiesAccessToken) {
    console.log("Invalid access token");
    return null;
  }
  try {
    const decodedToken = jwtDecode(cookiesAccessToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};
export const uploadImage = async (formData) => {

	formData.append("upload_preset", 'upload');
	return await axios.post(
		`https://api.cloudinary.com/v1_1/dgvct4jhj/image/upload`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);
}
export const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror =  (error) => reject(error);
  })
}
