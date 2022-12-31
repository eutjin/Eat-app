import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./About.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  AppShell,
  Card,
  Divider,
  UnstyledButton,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import AddStore from "../components/AddStore";
import { AiOutlinePlus } from "react-icons/ai";
import { useGlobalContext } from "../context";
import axios from "axios";
import baseUrl from "../BaseUrl";

const About = () => {
  const navigate = useNavigate();
  const { vendor } = useGlobalContext();
  const [vendorStores, setVendorStores] = useState([]);
  const [vendorAuth, setVendorAuth] = useState("");

  useEffect(() => {
    
    getVendor();
    
    console.log("aiya")
  }, []);

  useEffect(()=>{
    getStores();
  }, [vendorAuth])

  const getStores = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .get(baseUrl + "/api/store", config)
      .then(function (response) {
        setVendorStores(response.data);
      });
  };

  const getVendor = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .get(baseUrl + "/api/vendor/me", config)
      .then(function (response) {
        // setVendorStores(response.data);
        console.log("getme", response.data);
        setVendorAuth(response.data);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        if ((error.response.data.message = "TokenExpiredError")) {
          // localStorage.removeItem("vendor");
          console.log("shitssss");
          setVendorAuth("");
        }
      });
  };

  return (
    <>
      {vendorAuth ? (
        <Card className={styles.card}>
          <div className={styles.title}>
            <Text className={styles.titleText}>My Stores</Text>
            <AiOutlinePlus
              className={styles.titleIcon}
              onClick={() => navigate("/store")}
            />
          </div>
          <Divider />

          <div className={styles.allStoreContainer}>
            {vendorStores.length > 0
              ? vendorStores.map((item) => (
                  <Card className={styles.cardSingle}>
                    <Link to={`/about/${item._id}`} state={item}>
                      <Text>{item.storeName}</Text>
                    </Link>
                  </Card>
                ))
              : null}
            {/* <Card className={styles.cardSingle}>Add Store</Card>

        <Card className={styles.cardSingle}>ff</Card> */}
          </div>
        </Card>
      ) : (
        <div>
          <Text>Login or SignUp to start</Text>
          <div>
            <Link to="/login">
              <button>login</button>
            </Link>
            <Link to="/register">
              <button>sign up</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default About;
