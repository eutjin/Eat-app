import React, { useState, useContext, useReducer, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  Button,
  Title,
  Anchor,
  Card,
  TextInput,
  PasswordInput,
  Radio,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import {
  AiOutlineHome,
  AiOutlineCheckCircle,
  AiOutlineShop,
  AiOutlineUser,
} from "react-icons/ai";
import { RiGoogleFill, RiKakaoTalkFill } from "react-icons/ri";

import baseUrl from "../BaseUrl";
import baseUrlFrontend from "../BaseUrlFrontend";
import axios from "axios";
import { useGlobalContext } from "../context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import qs from "qs";

const { Kakao } = window;
const Login = () => {
  const { vendor, setVendor, user, setUser } = useGlobalContext();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const [res, setRes] = useState({});
  const [kakaoCode, setKakaoCode] = useState("");
  const [kakaoProfile, setKakaoProfile] = useState({});

  const REST_API_KEY = "a6a408f451db7109750f51393291785f";
  const REDIRECT_URI = baseUrlFrontend + "/login"

  // const REDIRECT_URI = process.env.REACT_APP_NODE_ENV === "production"
  // ? "https://whale-app-dbqd9.ondigitalocean.app/login"
  // : "http://localhost:3000/login" ;


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem("vendor");
    window.localStorage.removeItem("user");
    console.log("destroyLS");
    setVendor("");
    setUser("");

    if (userType == "vendor") {
      await loginVendor(formData);
    } else if (userType == "user") {
      await loginUser(formData);
    }

    await navigate("/about");
  };

  const loginVendor = async (formData) => {
    const response = await axios
      .post(baseUrl + "/api/vendor/login", formData)
      .then(function (response) {
        localStorage.setItem("vendor", JSON.stringify(response.data));
        setVendor(response.data);
        console.log("responselogin", response.data);
        // setUser(response.data)

        return response.data;
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  };

  const loginUser = async (formData) => {
    const response = await axios
      .post(baseUrl + "/api/user/login", formData)
      .then(function (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        console.log("responselogin", response.data);
        // setUser(response.data)

        return response.data;
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  };

  // const handleGoogleLogin = (response) => {
  //   console.log(response);
  //   if (response.credential) {
  //     const decodedJwt = jwt_decode(response.credential);
  //     console.log(decodedJwt);

  //     const formData = {
  //       email: decodedJwt.email,
  //       password: decodedJwt.sub,
  //     };
  //     console.log("form", formData);

  //     if (userType == "vendor") {
  //       loginVendor(formData);
  //     } else if (userType == "user") {
  //       loginUser(formData);
  //     }
  //   } else console.log("google login went wrong...");
  // };

  const loginToGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("we", tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      const formData = {
        email: userInfo.data.email,
        password: userInfo.data.sub,
      };
      console.log("form", formData);

      if (userType == "vendor") {
        loginVendor(formData);
      } else if (userType == "user") {
        loginUser(formData);
      }
      navigate("/about");
      console.log(userInfo);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  //kakaoLogin
  function loginWithKakao() {
    Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
    });
  }

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
  };

  useEffect(() => {
    window.localStorage.removeItem("vendor");
    window.localStorage.removeItem("user");
    console.log("destroyLS");
    setVendor("");
    setUser("");
    if (kakaoProfile.id) {
      let formData = {
        email: `${kakaoProfile.id}@${kakaoProfile.id}.com`,
        password: `${kakaoProfile.id}`,
      };

      if (userType == "vendor") {
        loginVendor(formData);
      } else if (userType == "user") {
        loginUser(formData);
      }
      navigate("/about");
    }
  }, [kakaoProfile]);

  return (
    <>
      <Card className={styles.card}>
        <Title align="center" order={2}>
          Welcome Back!
        </Title>
        <Text align="center">Log-In to get started</Text>
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
                Business owners looking to advertise their store on the platform
              </div>
            </div>
          </div>
        </div>

        <Text className={styles.middleText}>Enter credentials</Text>
        <form onSubmit={onSubmit} className={styles.formInputGroup}>
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
          {/* <Radio.Group
            value={userType}
            onChange={setUserType}
            name="favoriteFramework"
            label="Select account type"
            // description="This is anonymous"
            withAsterisk
          >
            <Radio value="user" label="I am a customer" />
            <Radio value="vendor" label="I am a store owner" />
          </Radio.Group> */}
          <Button type="submit" fullWidth mt="xl" size="md">
            Submit
          </Button>
        </form>
        <Text className={styles.middleText}>or continue with</Text>
        {/* <GoogleLogin onSuccess={(response) => handleGoogleLogin(response)} /> */}
<div className={styles.socialLoginGroup}>
        <button className={styles.googleLogin} onClick={() => loginToGoogle()}>
          <RiGoogleFill size={20} />
          Login with Google
        </button>
        <button className={styles.kakaoLogin} onClick={loginWithKakao}>
          <RiKakaoTalkFill size={20} />
          Login with Kakao
        </button></div>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Don't have an account?{" "}
          <Anchor size="sm" ml={6} component={Link} to="/register">
            Register
          </Anchor>
        </Text>
      </Card>
    </>
  );
};

export default Login;
