import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./RestaurantSingle.module.css";
import { Link } from "react-router-dom";
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
import {
  AiOutlineHome,
  AiOutlinePhone,
  AiOutlineShop,
  AiOutlineHourglass,
  AiOutlineDollar,
  AiOutlineCrown,
  AiOutlineStar,
} from "react-icons/ai";
import { useGlobalContext } from "../context";

const RestaurantSingle = ({ store }) => {
  const { storeAddress, storeCoordinate, storeFee, storeHours, storePhone, storeName, _id, storeRatingQty, storeRatingVal, } =
    store;
    const { clickedStoreCoord, setClickedStoreCoord } = useGlobalContext();

  console.log("mystore", store);

  useEffect(()=>{
console.log(window.location.pathname)
  }, [])

  return (
    <>
      <Card className={`${styles.card} ${window.location.pathname=='/about'?styles.cardColor: null}`}>
        <Link to={`/eats/${_id}`} state={store}>
          <div className={styles.title}>
            <Text className={styles.titleName}>{storeName}</Text>
            <div className={styles.titleSub}>
              <Text className={styles.titleSubText}>후기 <strong>{parseFloat(storeRatingVal).toFixed(1)}</strong></Text>
              <Text className={styles.titleSubText}>리뷰 <strong>{storeRatingQty}</strong></Text>
              {store.distance &&  <Text className={styles.titleSubText}>거리 <strong>{Math.round(store.distance)}m</strong></Text>}
            </div>
          </div>
        </Link>
        <Divider />

        <div className={styles.titleInfoMain}>
          <div className={styles.titleInfoContainer}>
          <Link to={"/"} onClick={()=>setClickedStoreCoord(storeCoordinate)}>
            <div className={styles.titleInfo}>
            <div className={styles.titleInfoIconContainer}><AiOutlineShop className={styles.titleInfoIcon} /></div>
              <Text>{storeAddress}</Text>
            </div></Link>
          </div>
          <div className={styles.titleInfoContainer}>
            <div className={styles.titleInfo}>
            <div className={styles.titleInfoIconContainer}> <AiOutlineHourglass className={styles.titleInfoIcon} /></div>
              <Text>{storeHours}</Text>
            </div>
          </div>

          <div className={styles.titleInfoContainer}>
            <div className={styles.titleInfo}>
            <div className={styles.titleInfoIconContainer}> <AiOutlinePhone className={styles.titleInfoIcon} /></div>
              <Text>{storePhone}</Text>
            </div>
          </div>

          <div className={styles.titleInfoContainer}>
            <div className={styles.titleInfo}>
            <div className={styles.titleInfoIconContainer}><AiOutlineDollar className={styles.titleInfoIcon} /></div>
              <Text>{storeFee}</Text>
            </div>
          </div>
{/* 
          {store.distance &&
          <div className={styles.titleInfoContainer}>
          <div className={styles.titleInfo}>
          <div className={styles.titleInfoIconContainer}><AiOutlineDollar className={styles.titleInfoIcon} /></div>
            <Text>{Math.round(store.distance)}</Text>
          </div>
        </div>} */}
        </div>
      </Card>
    </>
  );
};

export default RestaurantSingle;
