import React from "react";
import { Link, Redirect, Route, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useGlobalContext } from "../context";
import {
  Anchor,
  PasswordInput,
  Title,
  Radio,
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  Textarea,
  TextInput,
  Button,
  Select,
  Modal,
  Card,
} from "@mantine/core";
import {
  AiOutlineHome,
  AiOutlineCheckCircle,
  AiOutlineShop,
  AiOutlineUser,
} from "react-icons/ai";
import { RiGoogleFill, RiKakaoTalkFill } from "react-icons/ri";
import baseUrl from "../BaseUrl";
import { showNotification } from "@mantine/notifications";
import styles from "./Login.module.css";
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import qs from "qs";
import jwt_decode from "jwt-decode";
import baseUrlFrontend from "../BaseUrlFrontend";

const { Kakao } = window;
const Register = () => {
  const navigate = useNavigate();
  const { vendor, setVendor, user, setUser } = useGlobalContext();
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    firstname: "",
    familyname: "",
    email: "",
    password: "",
    password2: "",
  });
  const [kakaoCode, setKakaoCode] = useState("");
  const [kakaoProfile, setKakaoProfile] = useState({});
  const [kakaoRegModal, setKakaoRegModal] = useState(false);

  const { firstname, familyname, email, password, password2 } = formData;

  const REST_API_KEY = "a6a408f451db7109750f51393291785f";
  const REDIRECT_URI = baseUrlFrontend + "/register"

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    console.log("11", firstname);

    // if (!firstname || !familyname || !email){
    //     showNotification({
    //         title: 'Incomplete form',
    //         message: 'Make sure there are no empty fields!',
    //         color: 'red',

    //       })
    //   console.log("password fucked");
    // }
    if (userType == "") {
      showNotification({
        title: "User type error",
        message: "Make sure user type is selected!",
        color: "red",
      });
      console.log("password fucked");
    }

    if (password != password2) {
      showNotification({
        title: "Password Error",
        message: "Make sure both passwords are the same!",
        color: "red",
      });
      console.log("password fucked");
    } else {
      const regData = {
        firstname,
        familyname,
        email,
        password,
      };

      window.localStorage.removeItem("vendor");
      window.localStorage.removeItem("user");
      console.log("destroyLS");
      setVendor("");
      setUser("");

      if (userType == "vendor") {
        registerVendor(regData);
      } else if (userType == "user") {
        registerUser(regData);
      }
    }
  };

  //register new vendorr
  const registerVendor = async (regData) => {
    const response = await axios
      .post(baseUrl + "/api/vendor/register", regData)
      .then(function (response) {
        localStorage.setItem("vendor", JSON.stringify(response.data));
        setVendor(response.data);
        // history.push("/about")
        navigate("/about");
        return response.data;
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        showNotification({
          title: "Registration Error",
          message: error.response.data.message,
          color: "red",
        });
      });
  };

  const registerUser = async (regData) => {
    const response = await axios
      .post(baseUrl + "/api/user/register", regData)
      .then(function (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        // history.push("/about")
        navigate("/about");
        return response.data;
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        showNotification({
          title: "Registration Error",
          message: error.response.data.message,
          color: "red",
        });
      });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("we", tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      const regData = {
              firstname: userInfo.data.given_name,
              familyname: userInfo.data.family_name,
              email: userInfo.data.email,
              password: userInfo.data.sub,
            };
            console.log("reg", regData);
      
            if (userType == "vendor") {
              registerVendor(regData);
            } else if (userType == "user") {
              registerUser(regData);
            }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  // const handleGoogleLogin = (response) => {
  //   console.log(response);
  //   if (response.credential) {
  //     const decodedJwt = jwt_decode(response.credential);
  //     console.log(decodedJwt);

  //     const regData = {
  //       firstname: decodedJwt.given_name,
  //       familyname: decodedJwt.family_name,
  //       email: decodedJwt.email,
  //       password: decodedJwt.sub,
  //     };
  //     console.log("reg", regData);

  //     if (userType == "vendor") {
  //       registerVendor(regData);
  //     } else if (userType == "user") {
  //       registerUser(regData);
  //     }
  //   } else console.log("google login went wrong...");
  // };

  // kakao
  function loginWithKakao() {
    Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
    });
  }

  const handleKakaoLogout = () => {
    Kakao.Auth.logout()
      .then(function (response) {
        console.log("log1", Kakao.Auth.getAccessToken()); 
        console.log("logZ", response);// null
      })
      .catch(function (error) {
        console.log("Not logged in.");
      });

    Kakao.API.request({
      url: "/v1/user/unlink",
    })
      .then(function (response) {
        console.log("log2", response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // const loginWithKakao = () => {

  //   const scope = "profile_nickname,profile_image, account_email";
  //   Kakao.Auth.login({
  //     scope,
  //     // success는 인증 정보를 응답(response)으로 받는다.
  //     success: function (response) {
  //      //카카오 SDK에 사용자 토큰을 설정한다.
  //       window.Kakao.Auth.setAccessToken(response.access_token);
  //       console.log(`is set?: ${window.Kakao.Auth.getAccessToken()}`);

  //       var ACCESS_TOKEN = window.Kakao.Auth.getAccessToken();

  //       window.Kakao.API.request({
  //       url: "/v2/user/me",
  //       success: function ({ kakao_account }) {
  //         //어떤 정보 넘어오는지 확인
  //         console.log(kakao_account);
  //         const {  email,profile } = kakao_account;

  //         console.log(email);
  //         console.log(`responsed img: ${profile.profile_image_url}`);
  //         console.log(profile.nickname);

  //         axios({
  //           method: "post",
  //           url: "/auth/sns",
  //           data: {
  //             "id": email,
  //             "nickname": profile.nickname,
  //             "image" :profile.profile_image_url,
  //           },
  //         })
  //           .then((res) => {
  //             console.log(res);
  //             // history.push("/main/feed");
  //           })
  //           .catch((error) => {
  //             // console.log(error);
  //             console.error(error);
  //             alert("카카오 로그인 에러?");
  //           });

  //       },
  //       fail: function (error) {
  //         console.log(error);
  //       },
  //     });

  //     },
  //     fail: function (error) {
  //       console.log(error);
  //     },
  //   });

  // };

  useEffect(() => {
    const uri = window.location.href;
    const authCode = uri.split("=");
    console.log("uri", authCode);

    if ((authCode.length = 2)) {
      setKakaoCode(authCode[1]);
    }
  }, []);

  useEffect(() => {
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: kakaoCode,
      client_secret: "0dN1XgfKEbIaLSeh1ziwmIFwq8a2sIKt",
    });
    getToken(payload);
    console.log("kkcode", kakaoCode);
  }, [kakaoCode]);

  const getToken = async (payload) => {
    console.log(payload);

    // access token 가져오기
    await axios
      .post("https://kauth.kakao.com/oauth/token", payload)
      .then(function (response) {
        console.log(response);
        // window.Kakao.init(REST_API_KEY);
        window.Kakao.Auth.setAccessToken(response.data.access_token);
      });
    let data = await window.Kakao.API.request({
      url: "/v2/user/me",
    });
    console.log("me", data);
    setKakaoProfile(data);

    //   // Kakao Javascript SDK 초기화
    //   window.Kakao.init(REST_API_KEY);
    //   // access token 설정
    //   window.Kakao.Auth.setAccessToken(res.data.access_token);
    //  console.log("myres",res.data.access_token)
  };

  useEffect(() => {
    console.log("kakao", kakaoProfile);
    if (kakaoProfile.id) {
      setKakaoRegModal(true);
      console.log("truth");

      setFormData({
        firstname: "",
        familyname: "",
        email: `${kakaoProfile.id}@${kakaoProfile.id}.com`,
        password: `${kakaoProfile.id}`,
        password2: `${kakaoProfile.id}`,
      });
    }
  }, [kakaoProfile]);

  return (
    <>
      <GoogleOAuthProvider clientId="858348363721-rsfar8gs4qdru48a1q7fn817vpcrpi7o.apps.googleusercontent.com">
        <Card className={styles.card}>
          <Title align="center" order={2}>
            Welcome!
          </Title>
          <Text align="center">Sign-up to get started</Text>
          <div className={styles.userTypeTitle}>Choose your account type:</div>
          <div className={styles.userTypeContainer}>
            <div
              id="user"
              className={
                userType == "user"
                  ? styles.userTypeSingleActive
                  : styles.userTypeSingle
              }
              onClick={() => setUserType("user")}
            >
              <div className={styles.userTypeSingleIcon}>
                <AiOutlineUser />
              </div>
              <div className={styles.userTypeSingleContent}>
                <div className={styles.contentTitle}>Normal</div>
                <div className={styles.contentDescription}>
                  General users looking for the next best place to have a good
                  meal
                </div>
              </div>
            </div>
            <div
              id="vendor"
              className={
                userType == "vendor"
                  ? styles.userTypeSingleActive
                  : styles.userTypeSingle
              }
              onClick={() => setUserType("vendor")}
            >
              <div className={styles.userTypeSingleIcon}>
                <AiOutlineShop />
              </div>
              <div className={styles.userTypeSingleContent}>
                <div className={styles.contentTitle}>Business</div>
                <div className={styles.contentDescription}>
                  Business owners looking to advertise their store on the
                  platform
                </div>
              </div>
            </div>
          </div>
          <Text className={styles.middleText}>Enter credentials</Text>
          <form onSubmit={onSubmit} className={styles.formInputGroup}>
            <TextInput
              my={10}
              type="text"
              label="Your first name"
              id="firstname"
              name="firstname"
              placeholder="enter your firstname"
              value={firstname}
              onChange={onChange}
            />
            <TextInput
              my={10}
              type="text"
              label="Your familyname"
              id="familyname"
              name="familyname"
              placeholder="enter your familyname"
              value={familyname}
              onChange={onChange}
            />

            <TextInput
              my={10}
              type="email"
              label="Your Email"
              id="email"
              name="email"
              placeholder="enter your email"
              value={email}
              onChange={onChange}
            />

            <PasswordInput
              my={10}
              label="Password"
              id="password"
              name="password"
              placeholder="enter your password"
              value={password}
              onChange={onChange}
            />

            <PasswordInput
              my={10}
              label="Confirm password"
              id="password2"
              name="password2"
              placeholder="confirm password"
              value={password2}
              onChange={onChange}
            />

            <Button type="submit" fullWidth mt="xl" size="md">
              Submit
            </Button>
          </form>
          <Text className={styles.middleText}>Enter credentials</Text>

          <div className={styles.socialLoginGroup}>
          <button className={styles.googleLogin} onClick={() => handleGoogleLogin()}>
          <RiGoogleFill size={20} />
          Signup with Google
        </button>

          <button className={styles.kakaoLogin} onClick={loginWithKakao}>
          <RiKakaoTalkFill size={20} />
          Signup with Kakao
        </button></div>

 {/* <a id="kakao-login-btn" onClick={loginWithKakao}>
            <img
              src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
              width="222"
              alt="Kakao login button"
            />
          </a> */}
        {/* <GoogleLogin onSuccess={(response) => handleGoogleLogin(response)} /> */}
         
          <p id="token-result"></p>
          {/* <button onClick={() => handleKakaoLogout()}>KakaoLogout</button> */}
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Already have an account?{" "}
            <Anchor size="sm" ml={6} component={Link} to="/login">
              Login
            </Anchor>
          </Text>
        </Card>{" "}
      </GoogleOAuthProvider>

      <Modal
        opened={kakaoRegModal}
        onClose={() => setKakaoRegModal(false)}
        title="Introduce yourself!"
      >
        {kakaoProfile.id ? (
          <div>Welcome {kakaoProfile.kakao_account.profile.nickname}</div>
        ) : null}
        <TextInput
          my={10}
          type="text"
          label="Your first name"
          id="firstname"
          name="firstname"
          placeholder="enter your firstname"
          value={firstname}
          onChange={onChange}
        />
        <TextInput
          my={10}
          type="text"
          label="Your familyname"
          id="familyname"
          name="familyname"
          placeholder="enter your familyname"
          value={familyname}
          onChange={onChange}
        />
        <Button onClick={onSubmit} fullWidth mt="xl" size="md">
          Submit
        </Button>
      </Modal>
    </>
  );
};

export default Register;
