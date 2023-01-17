import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./RestaurantDetail.module.css";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Card,
  Divider,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlinePhone,
  AiOutlineShop,
  AiOutlineHourglass,
  AiOutlineDollar,
  AiOutlineCrown,
  AiOutlineStar,
} from "react-icons/ai";
import {
  BsBookmarkPlus,
  BsBookmarkCheckFill,
  BsTelephonePlus,
  BsLink45Deg,BsGeoAlt,BsGeo,BsMap, BsPinMap
} from "react-icons/bs";

import baseUrl from "../BaseUrl";
import axios from "axios";
import dayjs from "dayjs";
import { useGlobalContext } from "../context";
import RestaurantDetailReview from "../components/RestaurantDetailReview";

const RestaurantDetail = () => {
  const { id } = useParams();
  const { allStores, vendor, setVendor, user, setUser, getAllStores, setClickedStoreCoord } =
    useGlobalContext();
  const location = useLocation();
  const [dayMenu, setDayMenu] = useState([]);
  const [dayMenuFood, setDayMenuFood] = useState([]);
  const [store, setStore] = useState({});
  const [imageSrc, setImageSrc] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("4");
  const [favouritedStore, setFavouritedStore] = useState(false);
  // const { storeAddress, storeFee, storeHours, storePhone, storeName, _id } =
  //   store;

  useEffect(() => {
    
    getDayMenu();
    // setStore(location.state);
    console.log("as", allStores);
    const thisStore = allStores.filter((item) => item._id == id);
    console.log("ts", thisStore);
    setStore(thisStore[0]);
    document.body.scrollTo(0, 0);
   
  }, []);

  useEffect(() => {
    if (user) {
      if (user.favourites.includes(id)) {
        setFavouritedStore(true);
      }
    }
   
  }, []);

  useEffect(() => {
    console.log("as", allStores);
    const thisStore = allStores.filter((item) => item._id == id);
    console.log("ts", thisStore);
    setStore(thisStore[0]);
  }, [allStores]);

  const getDayMenu = async () => {
    const dateData = { date: new Date() }; //get today
    console.log("daydate", dateData);
    console.log("get day menu", dateData);
    const response = await axios
      .post(baseUrl + `/api/menu/day/${id}`, dateData)
      .then(function (response) {
        if (response.data.success) {
          console.log("");
          console.log(response.data.menu);
          setDayMenu(response.data.menu);
          setDayMenuFood(response.data.menu[0].menuItems);
        }
      })
      .catch(function (error) {
        console.log("fail", error.response.data.message);
      });
  };

  function handleOnChange(changeEvent) {
    // const reader = new FileReader();

    // reader.onload = function(onLoadEvent) {
    //   setImageSrc(onLoadEvent.target.result);
    //   setUploadData(undefined);
    // }

    // reader.readAsDataURL(changeEvent.target.files[0]);
    setImageSrc([...imageSrc, changeEvent.target.files[0]]);
    console.log("targetfiles", changeEvent.target.files[0]);

    // var output = document.getElementById('output');
    // output.src = URL.createObjectURL(changeEvent.target.files[0]);
    // output.onload = function() {
    //   URL.revokeObjectURL(output.src) // free memory
    // }
  }

  async function handleImgUpload(event) {
    // event.preventDefault()
    // const form= event.currentTarget;
    // const fileInput= Array.from(form.elements).find(({name})=>name==="file")

    const formData = new FormData();
    // for (const file of fileInput.files){
    //   formData.append('file', file)
    // }
    for (let i = 0; i < imageSrc.length; i++) {
      formData.append("file", imageSrc[i]);

      formData.append("upload_preset", "myupload");
      console.log([...formData]);
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/dxdwnczxv/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());
      console.log(data);
      await setUploadData((uploadData) => [...uploadData, data.secure_url]);
    }
    console.log("uploadData", uploadData);
  }

  const handleAddItem = async () => {
    console.log("additem");
    await handleImgUpload();
  };

  useEffect(() => {
    if (imageSrc.length == uploadData.length && text && rating) {
      console.log("samesame");
      postReview();
    }
  }, [uploadData]);

  const postReview = async () => {
    const review = {
      reviewText: text,
      reviewRating: rating,
      reviewImage: uploadData,
    };
    console.log("review", review);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await axios
      .post(baseUrl + `/api/review/${id}`, review, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("review gud");
          console.log(response.data);
          getAllStores();
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        // showNotification({
        //   title: "Menu Registration Error",
        //   message: error.response.data.message,
        //   color: "red",
        // });
      });
  };

  const handleShareButton = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification({
      title: "Share",
      message: "Link copied to clipboard!",
      color: "green",
    });
  };

  const handleCallButton = () => {
    window.open("tel:8201030813591");
  };

  const handleSaveButton = () => {
    if (favouritedStore) {
      unsetFavouriteStore();
    } else {
      setFavouriteStore();
    }
  };

  const setFavouriteStore = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    console.log("usettoken", user.token);
    console.log("config", config);
    const response = await axios
      .post(baseUrl + `/api/user/favourite/${id}`, user, config)
      .then(function (response) {
        if (response) {
          console.log("fav gud");
          console.log("user", response.data.user);
          setUser((prev) => ({
            ...prev,
            favourites: response.data.user.favourites,
          }));
          setFavouritedStore(true);
          showNotification({
            title: "Added!",
            message: "Store added to favourites list",
            color: "green",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        showNotification({
          title: "Add Favourite Error",
          message: "Sign In to a Customer account to proceed",
          color: "red",
        });
      });
  };

  const unsetFavouriteStore = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    console.log("unset token", user.token);
    console.log("config", config);
    const response = await axios
      .post(baseUrl + `/api/user/unfavourite/${id}`, user, config)
      .then(function (response) {
        if (response) {
          console.log("unfav gud");
          console.log("user", response.data.user);
          setUser((prev) => ({
            ...prev,
            favourites: response.data.user.favourites,
          }));
          setFavouritedStore(false);
          showNotification({
            title: "Removed!",
            message: "Store removed from favourites list",
            color: "yellow",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        // showNotification({
        //   title: "Menu Registration Error",
        //   message: error.response.data.message,
        //   color: "red",
        // });
      });
  };
  return (
    <>
      {store && (
        <Card className={styles.card}>
          <div className={styles.title}>
            <Text className={styles.titleName}>{store.storeName}</Text>
            <div className={styles.titleSub}>
              <Text className={styles.titleSubText}>
                후기 {parseFloat(store.storeRatingVal).toFixed(1)}
              </Text>
              <Text className={styles.titleSubText}>
                리뷰 {store.storeRatingQty}
              </Text>
              
            </div>
          </div>

          <div className={styles.titleButtonContainer}>
            <div
              className={styles.titleButton}
              onClick={() => handleCallButton()}
            >
              <div className={styles.titleButtonIcon}>
                <BsTelephonePlus />
              </div>
              <Text>Call</Text>
            </div>
            <div
              className={styles.titleButton}
              onClick={() => handleSaveButton()}
            >
              <div className={styles.titleButtonIcon}>
                {favouritedStore ? <BsBookmarkCheckFill /> : <BsBookmarkPlus />}
              </div>
              <Text>Save</Text>
            </div>
            <Link to={"/"} onClick={()=>setClickedStoreCoord(store.storeCoordinate)}>
            <div
              className={styles.titleButton}
              
            >
              <div className={styles.titleButtonIcon}>
               <BsMap/>
              </div>
              <Text>Map</Text>
            </div></Link>
            <div
              className={styles.titleButton}
              onClick={() => handleShareButton()}
            >
              <div className={styles.titleButtonIcon}>
                <BsLink45Deg />
              </div>
              <Text>Share</Text>
            </div>
          </div>
          <Divider />

          <div className={styles.titleInfoMain}>
            <div className={styles.titleInfoContainer}>
              <div className={styles.titleInfo}>
                <AiOutlineShop className={styles.titleInfoIcon} />
                <Text>{store.storeAddress}</Text>
              </div>
            </div>
            <div className={styles.titleInfoContainer}>
              <div className={styles.titleInfo}>
                <AiOutlineHourglass className={styles.titleInfoIcon} />
                <Text>{store.storeHours}</Text>
              </div>
            </div>

            <div className={styles.titleInfoContainer}>
              <div className={styles.titleInfo}>
                <AiOutlinePhone className={styles.titleInfoIcon} />
                <Text>{store.storePhone}</Text>
              </div>
            </div>

            <div className={styles.titleInfoContainer}>
              <div className={styles.titleInfo}>
                <AiOutlineDollar className={styles.titleInfoIcon} />
                <Text>{store.storeFee}</Text>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* <Card className={styles.card}>
        <div className={styles.title}>
          <Text className={styles.titleName}>월정리해수욕장</Text>
          <div className={styles.titleSub}>
            <Text className={styles.titleSubText}>후기 4.1</Text>
            <Text className={styles.titleSubText}>리뷰 408</Text>
          </div>
        </div>

        <div className={styles.titleButtonContainer}>
          <div className={styles.titleButton}>
            <div className={styles.titleButtonIcon}>
              <AiOutlineCrown />
            </div>
            <Text>Call</Text>
          </div>
          <div className={styles.titleButton}>
            <div className={styles.titleButtonIcon}>
              <AiOutlineCrown />
            </div>
            <Text>Save</Text>
          </div>
          <div className={styles.titleButton}>
            <div className={styles.titleButtonIcon}>
              <AiOutlineCrown />
            </div>
            <Text>Share</Text>
          </div>
        </div>

        <Divider />

        <div className={styles.titleInfo}>
          <AiOutlineHeart className={styles.titleInfoIcon} />
          <Text>제주특별자치도 제주시 구좌읍 월정리 33-3</Text>
        </div>
        <div className={styles.titleInfo}>
          <AiOutlineHeart className={styles.titleInfoIcon} />
          <Text>영업중 월~금 18:00 ~ 01:00</Text>
        </div>
        <div className={styles.titleInfo}>
          <AiOutlineHeart className={styles.titleInfoIcon} />
          <Text>064-728-3394 대표번호</Text>
        </div>
        <div className={styles.titleInfo}>
          <AiOutlineHeart className={styles.titleInfoIcon} />
          <Text>가격 7000</Text>
        </div>
      </Card> */}

      {/* <Card className={styles.card}>
        <div className={styles.menuTitle}>
          <Text>메뉴 (lunch)</Text>
          <Text>18 August 2022</Text>
        </div>
        <Divider />
        <div className={styles.menuItem}>
          <Text>1. Spicy Pork</Text>
          <Text>2. Tempura</Text>
          <Text>3. Spicy Pork</Text>
          <Text>4. Tempura</Text>
          <Text>5. Spicy Pork</Text>
          <Text>6. Tempura</Text>
          <Text>7. Spicy Pork</Text>
          <Text>8. Tempura</Text>
        </div>
      </Card> */}

      {dayMenu.length > 0 ? (
        dayMenu.map((item) => (
          <Card className={styles.menuCard}>
            <div className={styles.menuTitle}>
              <div className={styles.menuDate}>
                <Text className={styles.dateDate2}>
                  {dayjs(item.date).format("DD")}
                </Text>
                <div className={styles.dateDividerVertical}>
                  <Text className={styles.dateMonth2}>
                    {dayjs(item.date).format("MMM")}
                  </Text>
                  <Text className={styles.dateMonth2}>
                    {dayjs(item.date).format("YYYY")}
                  </Text>
                </div>
                <div className={styles.menuTitle}>
                  <Text>메뉴 (lunch)</Text>
                </div>
              </div>
            </div>
            <Divider />
            <div className={styles.titleInfoMain}>
              {item.menuItems.map((food, index) => (
                <div className={styles.titleInfoContainer}>
                  <div className={styles.menuInfo}>
                    <Text>
                      {index + 1}. {food.foodName}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      ) : (
        <Card className={styles.menuCard}>
          <div className={styles.menuTitleNone}>
            <Text className={styles.menuNone}>No menu for today</Text>
          </div>
        </Card>
      )}

      {/* <div className={styles.inputMenuContainer}>
        <input
          className={styles.textInput}
          spellcheck="false"
          placeholder="add menu item"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <div className={styles.containerBottom}>
          <div className={styles.imageUploadGroup} onChange={handleOnChange}>
            <label className={styles.fileInput}>
              <input type="file" name="file" />
              photo
            </label>
            {imageSrc.length > 0 &&
              imageSrc.map((img) => {
                return (
                  <div>

                    <img className={styles.selectedImage} src={URL.createObjectURL(img)} alt={img.name} />
                  </div>
                )
              })
            }
          </div>
          <div className={styles.buttonsGroup}>
            <button
              disabled={text ? false : true}
              className={styles.inputButton}
              onClick={handleAddItem}
            >
              Add
            </button>
           
          </div>
        </div>
      </div> */}

      <RestaurantDetailReview storeId={id} store={store}/>
    </>
  );
};

export default RestaurantDetail;
