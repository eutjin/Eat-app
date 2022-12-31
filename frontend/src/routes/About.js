import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./About.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  AppShell,
  Card,
  Divider,
  UnstyledButton,
  Button,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  Title,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import AddStore from "../components/AddStore";
import { AiOutlinePlus, AiOutlineAppstore, AiOutlineUnorderedList } from "react-icons/ai";
import { useGlobalContext } from "../context";
import axios from "axios";
import baseUrl from "../BaseUrl";
import baseUrlFrontend from "../BaseUrlFrontend";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RestaurantSingle from "../components/RestaurantSingle";
import qs from "qs";
import {ReactComponent as Peep1} from "../assets/peep1.svg"
import {ReactComponent as Peep2} from "../assets/peep2.svg"
import {ReactComponent as Peep3} from "../assets/peep3.svg"
import {ReactComponent as Peep4} from "../assets/peep4.svg"
import {ReactComponent as Peep5} from "../assets/peep5.svg"

// const { Kakao } = window;
const About = () => {
  const navigate = useNavigate();
  const { vendor, setVendor,user, allStores, setUser } = useGlobalContext();
  const [vendorStores, setVendorStores] = useState([]);
  const [vendorAuth, setVendorAuth] = useState("");
  const [userStoreList, setUserStoreList] = useState([]);
  const [kakaoCode, setKakaoCode] = useState("");
  const [storeGridView, setStoreGridView]= useState(false);

  const REST_API_KEY = "a6a408f451db7109750f51393291785f";
  const REDIRECT_URI = baseUrlFrontend+"/about";

  // useEffect(() => {
  //   getVendor();

  //   console.log("aiya");
  // }, []);

  // useEffect(() => {
  //   getStores();
  // }, [vendorAuth]);

  useEffect(() => {
    if (vendor) {
      getStores();
      setStoreGridView(vendor.gridView)
    }

    // if(vendor.gridView){
    //   setStoreGridView(true)
    // }
  }, []);

//   useEffect(()=>{
// console.log("vendr Cnae")
//   }, [vendor])

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

    //   // Kakao Javascript SDK 초기화
    //   window.Kakao.init(REST_API_KEY);
    //   // access token 설정
    //   window.Kakao.Auth.setAccessToken(res.data.access_token);
    //  console.log("myres",res.data.access_token)
  };

  useEffect(() => {
    if (user) {
      console.log("a", allStores);
      const favStores = allStores.filter((item) =>
        user.favourites.includes(item._id)
      );
      setUserStoreList(favStores);
      console.log("123", favStores);
    }
  }, [allStores, user]);

  const getStores = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .get(baseUrl + "/api/store", config)
      .then(function (response) {
        console.log("GET STORES", response)
        setVendorStores(response.data);
      }).catch(function (error) {
        console.log(error.response);
        // showNotification({
        //   title: "Menu Registration Error",
        //   message: error.response.data.message,
        //   color: "red",
        // });
        if(error.response.status==401){
          HandleLogout()
        }
      });
  };

  const HandleLogout = () => {
    window.localStorage.removeItem("vendor");
    window.localStorage.removeItem("user");
    console.log("logout");
    setVendor("");
    setUser("")
    // setMenuOpen(false);
    // handleKakaoLogout()
    // navigate("/about")
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

  const handleStoreView=async()=>{
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };
    console.log("ddd", config)
    const preference={gridView: !storeGridView}
    await axios.post(baseUrl + "/api/vendor/preference", preference, config).then(function(response){
      if (response.data.success) {
    
        console.log(response.data);
       setVendor({...vendor, gridView: response.data.updatedVendor.gridView})
       setStoreGridView((prev)=>!prev)
      }
    }).catch(function (error) {
      console.log("grid success error")
    })
    
    
  }

  return (
    <>
      {vendor && <Card className={styles.card}>
        <div className={styles.title}>
          <Text className={styles.titleText}>About</Text>
          {/* <AiOutlinePlus
            className={styles.titleIcon}
            onClick={() => navigate("/store")}
          /> */}
        </div>
        <Divider />
        <div className={styles.aboutContent}>
        <span>Name: {vendor.firstname} {vendor.familyname}</span>
        <span>Email: {vendor.email}</span>
        <span>Store: {vendorStores.length} stores</span>
       
        </div>
        {/* <div className={styles.title}>vv</div> */}
      </Card>
}
      
      {vendor || user ? (
        vendor ? (
          <Card className={styles.card}>
            <div className={styles.title}>
              <Text className={styles.titleText}>My Stores</Text>

<div className={styles.buttonGroup}>
  <button className={styles.iconButtonContainer} onClick={()=>handleStoreView()}>{storeGridView? <AiOutlineUnorderedList size={20}/>: <AiOutlineAppstore size={20}/>} </button>
  <button className={styles.iconButtonContainer}onClick={() => navigate("/store")}><AiOutlinePlus
                className={styles.titleIcon}
                
              /></button>
</div>

              

            </div>
            <Divider />

            <DragDropContext>
              <Droppable droppableId="foodtype">
                {(provided) => (
                  <div
                    className={styles.allStoreContainer}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {vendorStores.length > 0 ? (
                      vendorStores.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              className={storeGridView? styles.cardSingleGrid: styles.cardSingleNoGrid}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: snapshot.isDragging
                                  ? "grey"
                                  : null,
                              }}
                            >
                              <Link to={`/about/${item._id}`} state={item}>
                                <Text className={styles.cardSingleText}>
                                  {item.storeName}
                                </Text>
                              </Link>
                            </Card>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <Card className={styles.cardSingle}>no store</Card>
                    )}

                    {/* <Card className={styles.cardSingle}>Add Store</Card>

        <Card className={styles.cardSingle}>ff</Card> */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        ) : (
          <Card className={styles.card}>
            {" "}
            <div className={styles.title}>
              <Text className={styles.titleText}>User</Text>
            </div>
            <Divider />
            <div className={styles.allStoreContainer}>
              {user.favourites.length > 0
                ? userStoreList.map((item) => <RestaurantSingle store={item} />)
                : null}
            </div>
          </Card>
        )
      ) : (
        // <div>
        //   <Text>Login or SignUp to start</Text>
        //   <div>
        //     <Link to="/login">
        //       <button>login</button>
        //     </Link>
        //     <Link to="/register">
        //       <button>sign up</button>
        //     </Link>
        //   </div>
        // </div>

        <Card className={styles.cardNoLogin}>
          <Title align="center" order={2}>
            Welcome Back!
          </Title>
          <Text align="center">Log-In to get started</Text>
          <div className={styles.noLoginContent}><Peep1/><Peep2/><Peep3/></div>
          {/* <div className={styles.noLoginContent}><div><Peep1/></div><div><Peep2/></div><div><Peep3/></div></div> */}
          <div className={styles.noLoginButtonGroup}>
            <div className={styles.noLoginButtonContainer}>
              <Link to="/login">
                <Button className={styles.noLoginButton}>login</Button>
              </Link>
            </div>
            <div className={styles.noLoginButtonContainer}>
              <Link to="/register">
                <Button className={styles.noLoginButton}>sign up</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default About;
