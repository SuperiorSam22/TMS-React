import axios from "axios";
import { jwtDecode } from "jwt-decode";

const rootUrl = "http://localhost:8000/api/";
const loginUrl = rootUrl + "users/login";
const userProfileUrl = "http://localhost:8000/api/users";
const logoutUrl = rootUrl + "user/logout";
const newAccessJWT = rootUrl + "tokens";
const userVerificationUrl = userProfileUrl + "/verify";

export const userRegistration = (frmData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(userProfileUrl, frmData);

      resolve(res.data);

      if (res.data.status === "success") {
        resolve(res.data);
      }
    } catch (error) {
      reject(error);
    }
  });
};



export const userRegistrationVerification = (frmData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.patch(userVerificationUrl, frmData);

      resolve(res.data);
      if (res.data.status === "success") {
        resolve(res.data);
      }
    } catch (error) {
      reject({ status: "error", message: error.error });
    }
  });
};

export const userLogin = (frmData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(loginUrl, frmData);
      
      if (res.status === 200) {
        const token = res.data.token;
        const user = jwtDecode(token);
        console.log("USER: ", user);
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("accessJWT", res.data.token);
        resolve(res.data);
      }
    } catch (error) {
      reject(error, ()=> console.log("reject :", error));
    }
  });
};

export const fetchUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const accessJWT = sessionStorage.getItem("accessJWT");
      console.log(accessJWT);
      
      if (!accessJWT) {
        reject("Token not found!");
      }

      const res = await axios.get(userProfileUrl, {
        headers: {
          Authorization: accessJWT,
        },
      });

      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  });
};

export const fetchNewAccessJWT = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { refreshJWT } = JSON.parse(localStorage.getItem("crmSite"));

      if (!refreshJWT) {
        reject("Token not found!");
      }

      const res = await axios.get(newAccessJWT, {
        headers: {
          Authorization: refreshJWT,
        },
      });

      if (res.data.status === "success") {
        sessionStorage.setItem("accessJWT", res.data.accessJWT);
      }

      resolve(true);
    } catch (error) {
      if (error.message === "Request failed with status code 403") {
        localStorage.removeItem("crmSite");
      }

      reject(false);
    }
  });
};

export const userLogout = async() => {
  // Remove the token from session storage
  sessionStorage.removeItem('accessJWT');

  // Optionally, call the logout API
  fetch('http://localhost:8000/api/user/logout', {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
    // Redirect to login or home page
    window.location.href = '/';
  })
  .catch(error => console.error('Error:', error));
}

