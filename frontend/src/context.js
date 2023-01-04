import React, { useEffect, useState, useContext } from "react";
import baseUrl from "./BaseUrl";
import axios from "axios";
const AppContext = React.createContext();

const getLocalStorageVendor = () => {
  let storage = localStorage.getItem("vendor");
  if (storage) {
    return JSON.parse(storage);
  } else {
    return "";
  }
};

const getLocalStorageUser = () => {
  let storage = localStorage.getItem("user");
  if (storage) {
    return JSON.parse(storage);
  } else {
    return "";
  }
};

const AppProvider = ({ children }) => {
  const [vendor, setVendor] = useState(getLocalStorageVendor());
  const [user, setUser] = useState(getLocalStorageUser());
  const [allStores, setAllStores] = useState([]);
  const [navState, setNavState] = useState("home");
  const [clickedStoreCoord, setClickedStoreCoord] = useState({});
  const [currentCoord, setCurrentCoord] = useState({});
  const [nearbyStores, setNearbyStores] = useState([]);
  const [nearbyStores2, setNearbyStores2] = useState([]); //after adding distance
  const [sortedStores, setSortedStores] = useState([]); //from nearbyStores2

  const [radiusValue, setRadiusValue] = useState(1000);
  const [toggle, setToggle] = useState(false);
  const [sortType, setSortType] = useState("");
  const [rating, setRating] = useState("all");

  const [radiusControlActive, setRadiusControlActive] = useState(false);
  const [sortControlActive, setSortControlActive] = useState(false);
  const [ratingControlActive, setRatingControlActive] = useState(false);
  const [viewType, setViewType] = useState("");

  useEffect(() => {
    getAllStores();
    // getGeolocation()
  }, []);

  useEffect(() => {
    getGeolocation();
  }, [allStores]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    // console.log("NEARBY STORES", nearbyStores2)
    // const sortedArrDistance= nearbyStores2.sort((a,b)=>(a.distance-b.distance))
    // console.log("SORTED ARR", sortedArrDistance)

    // const sortedArrRating= nearbyStores2.sort((a,b)=>(b.storeRatingVal-a.storeRatingVal))
    // console.log("SORTED ARR2", sortedArrRating)
    const sortArr = [...nearbyStores2];

    if (sortType == "rating") {
      sortArr.sort((a, b) => b.storeRatingVal - a.storeRatingVal);
      setSortedStores(sortArr);
    } else if (sortType == "review") {
      sortArr.sort((a, b) => b.storeRatingQty - a.storeRatingQty);
      setSortedStores(sortArr);
    } else if (sortType == "distance") {
      sortArr.sort((a, b) => a.distance - b.distance);
      setSortedStores(sortArr);
    } else {
      setSortedStores([...nearbyStores2]);
    }
  }, [nearbyStores2, sortType]);

  useEffect(() => {
    localStorage.setItem("vendor", JSON.stringify(vendor));
  }, [vendor]);

  const getAllStores = async () => {
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${vendor.token}`,
    //   },
    // };
    console.log("i ran");
    const response = await axios
      .get(baseUrl + "/api/store/allStore")
      .then(function (response) {
        console.log(response.data);
        setAllStores(response.data);
      });
  };

  // const getUser=async()=>{
  //   const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  // }



  const getGeolocation = () => {
    console.log("GEO RUN");

   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  };


  const success = (position) => {
    console.log("position", position.coords.latitude);
    setCurrentCoord({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setClickedStoreCoord({});
  };

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 1,
  };

  return (
    <AppContext.Provider
      value={{
        vendor,
        setVendor,
        allStores,
        navState,
        setNavState,
        getAllStores,
        user,
        setUser,
        clickedStoreCoord,
        setClickedStoreCoord,
        currentCoord,
        setCurrentCoord,
        nearbyStores,
        setNearbyStores,
        radiusValue,
        setRadiusValue,
        getGeolocation,
        nearbyStores2,
        setNearbyStores2,
        toggle,
        setToggle,
        sortType,
        setSortType,
        sortedStores,
        setSortedStores,
        rating,
        setRating,
        radiusControlActive,
        setRadiusControlActive,
        sortControlActive,
        setSortControlActive,
        ratingControlActive,
        setRatingControlActive,viewType, setViewType
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
