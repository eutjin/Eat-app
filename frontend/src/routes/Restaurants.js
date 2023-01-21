/*global kakao*/
import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./Restaurants.module.css";
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
  Slider, Loader
} from "@mantine/core";
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar, AiOutlineSliders
} from "react-icons/ai";
import RestaurantSingle from "../components/RestaurantSingle";
import { useGlobalContext } from "../context";
import MapControlTop from "../components/MapControlTop";
import MapAddressControl from "../components/MapAddressControl";
import MapControlSort from "../components/MapControlSort";
import MapControlRating from "../components/MapControlRating";

const Restaurants = () => {
  const {
    allStores,
    vendor,
    radiusValue,
    setRadiusValue,
    nearbyStores2,
    currentCoord,
    setNearbyStores2,sortedStores, setSortedStores, rating
  } = useGlobalContext();
  const allRestaurant = [1, 2, 3];
  const [radiusControlActive, setRadiusControlActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    setSliderValue(radiusValue / 20);
    document.body.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setRadiusValue(sliderValue * 20);
  }, [sliderValue]);

  const handleRadiusControlBtn = () => {
    setRadiusControlActive(!radiusControlActive);
  };

  const handleClickOverlay = (e) => {
    console.log(e.target.id);

    if (e.target.id == "overlayContainer") {
      setRadiusControlActive(!radiusControlActive);
    }
  };
  useEffect(() => {
    let currentPosition = new kakao.maps.LatLng(
      currentCoord.lat,
      currentCoord.lng
    );
    console.log("p1", currentPosition);

    let nearbyStore2 = [];
  
let allStoresCopy=[]
    if(rating=="low"){
      allStoresCopy=allStores.filter((item)=> item.storeRatingVal > 3.5)
    }else if(rating=="mid"){
      allStoresCopy=allStores.filter((item)=> item.storeRatingVal > 4)
    }else if(rating=="high"){
      allStoresCopy=allStores.filter((item)=> item.storeRatingVal > 4.5)
    }else{
      allStoresCopy=[...allStores]
    }
    console.log("COPY", allStoresCopy)

    allStoresCopy.forEach((item) => {
      let storePosition = new kakao.maps.LatLng(
        item.storeCoordinate.lat,
        item.storeCoordinate.lng
      );

      const poly = new kakao.maps.Polyline({
        path: [currentPosition, storePosition],
      });

      let distance = poly.getLength();
      // console.log("distance", distance)

      let itemMod = { ...item, distance };
      // console.log("mess", itemMod)
      if (distance < radiusValue) {
        nearbyStore2.push(itemMod);
      }
    });
    console.log("888", nearbyStore2);
    setNearbyStores2(nearbyStore2);
  }, [currentCoord, radiusValue, rating, allStores]);
  //
  // useEffect(() => {
  //   let currentPosition = new kakao.maps.LatLng(
  //     currentCoord.lat,
  //     currentCoord.lng
  //   );
  //   console.log("p1", currentPosition);

  //   let nearbyStore2 = [];
  //   allStores.forEach((item) => {
  //     let storePosition = new kakao.maps.LatLng(
  //       item.storeCoordinate.lat,
  //       item.storeCoordinate.lng
  //     );

  //     const poly = new kakao.maps.Polyline({
  //       path: [currentPosition, storePosition],
  //     });

  //     let distance = poly.getLength();
  //     // console.log("distance", distance)

  //     let itemMod = { ...item, distance };
  //     // console.log("mess", itemMod)
  //     if (distance < radiusValue) {
  //       nearbyStore2.push(itemMod);
  //     }
  //   });
  //   console.log("888", nearbyStore2);
  //   setNearbyStores2(nearbyStore2);
  // }, [currentCoord, radiusValue]);

  useEffect(()=>{
let arr=[...nearbyStores2]
console.log("NS1", arr)
const arr2= Object.values(arr).sort((a, b)=>{
  return a.distance-b.distance;
})
console.log("NS2", arr2)

  }, [nearbyStores2])

  return (
    <>
    <MapControlTop/>
      <MapAddressControl />
      <MapControlSort/>
      <MapControlRating/>
      {/* <div className={styles.restaurantsHeader}>
        <button className={styles.filterButton} onClick={() => handleRadiusControlBtn()}><AiOutlineSliders size={24}/>Distance</button>
      </div> */}

 
<div className={styles.restaurantListContainer}>

{sortedStores.length > 0
        ? sortedStores.map((item) => <RestaurantSingle store={item} />)
        : (<div className={styles.restaurantLoading}><Loader variant="dots" color="green" /></div>)}
</div>
     

{/* {nearbyStores2.length > 0
        ? nearbyStores2.map((item) => <RestaurantSingle store={item} />)
        : null} */}

      {/* {allStores.length>0 ?
allStores.map((item)=><RestaurantSingle store={item}/>): null
} */}

      {radiusControlActive && (
        <div
          id="overlayContainer"
          className={styles.overlayContainer}
          onClick={(e) => handleClickOverlay(e)}
        >
          <div className={styles.radiusControlModal}>
            <div className={styles.modalHeader}>Radius Control</div>
            <div className={styles.modalContent}>
              <div className={styles.radiusValue}>{radiusValue}</div>
              <div className={styles.radiusUnit}>meters</div>
            </div>
            <Slider
              value={sliderValue}
              onChange={setSliderValue}
              size="sm"
              showLabelOnHover={false}
              label={null}
              marks={[
                { value: 10, label: "0.2km" },
                { value: 25, label: "0.5km" },
                { value: 50, label: "1.0km" },
                { value: 75, label: "1.5km" },
                { value: 100, label: "2km" },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Restaurants;
