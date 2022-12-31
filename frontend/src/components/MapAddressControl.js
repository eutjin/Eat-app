/*global kakao*/
import React, { useEffect, useState, useRef } from "react";
import styles from "./MapAddressControl.module.css";
import baseUrl from "../BaseUrl";
import axios from "axios";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineSearch,
  AiFillStar,
  AiOutlineRight,
  AiOutlineLeft,
  AiOutlineUp,
  AiOutlineClose,
  AiOutlineSetting,
  AiFillCaretDown,
  AiOutlineEnvironment,
  AiOutlineArrowLeft,AiOutlineCloseCircle,
  AiOutlineCheck,AiOutlineReload, AiOutlineRedo
} from "react-icons/ai";
import { Slider } from "@mantine/core";
import { showNotification } from '@mantine/notifications';
import { useGlobalContext } from "../context";
import { addressSearch } from "./addressSearch";
import MapValid from "../MapValid";
import MapPositionCheck from "../MapPositionCheck";
import MapControlTop from "./MapControlTop";

const getLocalStorageCoord = () => {
    let storage = localStorage.getItem("currentCoordHistory");
    if (storage) {
      return JSON.parse(storage);
    } else {
      return "";
    }
  };

function MapAddressControl() {
  const {
    vendor,user,
    setVendor,
    allStores,
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
    setToggle,setRating,rating,  setSortType, sortType,radiusControlActive, setRadiusControlActive,sortControlActive, setSortControlActive, ratingControlActive, setRatingControlActive,viewType, setViewType
  } = useGlobalContext();
  const [addressText, setAddressText] = useState("");
  const [changeAddressModal, setChangeAddressModal] = useState(false);
  const [queryAddress, setQueryAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [currentCoordLocal, setCurrentCoordLocal] = useState({});
  const [addressTextLocal, setAddressTextLocal] = useState("");
  const [showPosition, setShowPosition] = useState(false);
  const [currentCoordHistory, setCurrentCoordHistory] = useState(getLocalStorageCoord());
  const navigate= useNavigate()


  useEffect(() => {
    geoFunction();
  }, [currentCoord]);

  useEffect(()=>{

if(window.location.pathname=="/eats"){
  setViewType("list")
}else if(window.location.pathname=="/"){
  setViewType("map")
}
  }, [])

  var geocoder = new kakao.maps.services.Geocoder();
  const geoFunction = () => {
    console.log("01", currentCoord);

    geocoder.coord2Address(currentCoord.lng, currentCoord.lat, callback);
  };

  var callback = function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      console.log(result, status);
      console.log(
        "그런 너를 마주칠까 " + result[0].address.address_name + "을 못가"
      );
      setAddressText(result[0].address.address_name);
    }
  };

  useEffect(() => {
    // geoFunctionLocal()
    var geocoder2 = new kakao.maps.services.Geocoder();
    var coord = new kakao.maps.LatLng(
      currentCoordLocal.lng,
      currentCoordLocal.lat
    );
    // console.log("jkjk", currentCoordLocal);
    console.log("jkjk1", currentCoordLocal.lng);

    var callbacklocal = function (result, status) {
      console.log("jkjk2", status);
      if (status === kakao.maps.services.Status.OK) {
        console.log(result, status);
        console.log(
          "그런 너를 마주칠까 " + result[0].address.address_name + "을 못가"
        );
        setAddressTextLocal(result[0].address.address_name);
      }
    };

    if (currentCoordLocal.lng && currentCoordLocal.lat) {
      geocoder2.coord2Address(
        currentCoordLocal.lng,
        currentCoordLocal.lat,
        callbacklocal
      );
    }
  }, [currentCoordLocal]);

  const coordToAddress = (coord, cb) => {
    console.log("gg", coord);
    let addressText = "";
    var geocoder2 = new kakao.maps.services.Geocoder();

    var callbacklocal = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        console.log("abc " + result[0].address.address_name + "을 못가");
        addressText = result[0].address.address_name;
        return cb(addressText);
      }
    };

    if (coord.lng && coord.lat) {
      geocoder2.coord2Address(coord.lng, coord.lat, callbacklocal);
    }
    // console.log("xyz",addressText)
    // console.log("xyz",addressText)
    // if(addressText.length>0){
    // return cb(addressText) }
  };

  //   useEffect(()=>{
  // console.log("shit",coordToAddress({lat: 37.501292545939954, lng: 126.91784463575152}, cb))
  //   }, [])

  //   const geoFunctionLocal=()=>{
  //     var coord = new kakao.maps.LatLng(currentCoordLocal.lng, currentCoordLocal.lat);
  //     // console.log("jkjk", currentCoordLocal);
  //     console.log("jkjk1", currentCoordLocal);
  //     geocoder.coord2Address(coord.getLng(), coord.getLat(), callbackLocal);
  //     //  console.log("jkjk1", currentCoordLocal);
  //   }

  //   var callbackLocal= function (result, status) {
  //     console.log("jkjk2", status);
  //     if (status === kakao.maps.services.Status.OK) {
  //       console.log(result, status);
  //       console.log(
  //         "그런 너를 마주칠까 " + result[0].address.address_name + "을 못가"
  //       );
  //       setAddressTextLocal(result[0].address.address_name);
  //     }
  //   };

  const handleSetAddress = () => {
    setChangeAddressModal(true);
  };

  const handleClearAddressQuery = () => {
    setQueryAddress("");
  };

  const handleQueryAddress = () => {
    console.log("o");
    if (queryAddress.length > 0) {
      setClickedStoreCoord({});
      addressSearch(queryAddress, (item) => {
        console.log("calc1", item);
        console.log("calc2", item.hasOwnProperty("La"));
        if (item.hasOwnProperty("La")) {
          // setAddressValidation("ADD_VALID")
          // setAddressError(false)
          setCurrentCoordLocal({ lat: item.Ma, lng: item.La });
        } else {
          // setAddressValidation(item)
          // setAddressError(true)
          // setCurrentCoord({});
          setAddressError(true);
          showNotification({
            title: 'Address Error',
            message: 'Enter a valid address in order to proceed',
            color: 'red',
            style: { zIndex: 1110},
          
          })
        }
      });
    }
  };

  const getGeolocationLocal = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  };

  const success = (position) => {
    console.log("position", position.coords.latitude);
    setCurrentCoordLocal({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 1,
  };

  const handleGetCurrentLocation = () => {
    getGeolocationLocal();
  };

  useEffect(() => {
    if (currentCoordLocal.lat) {
      setShowPosition(true);
    }
  }, [currentCoordLocal]);

  const handleSaveLocation = () => {
    console.log("maxxxx")
    setCurrentCoord(currentCoordLocal);
    setShowPosition(false);
    setQueryAddress("");
          addAddress();
         
if(currentCoordHistory==""){
  setCurrentCoordHistory([{ locationCoordinate: currentCoordLocal, locationAddress: addressTextLocal}])
}
    if(!currentCoordHistory.some((item)=>(item.locationAddress==addressTextLocal))){
        setCurrentCoordHistory([
            { locationCoordinate: currentCoordLocal, locationAddress: addressTextLocal },
            ...currentCoordHistory,
          ]);
    }
  };

  useEffect(()=>{
getAddress()
  }, [])

  const getAddress=async()=>{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await axios
      .get(baseUrl + "/api/address", config)
      .then(function (response) {
        console.log("babi", response);
        if (response.data.success) {

          console.log("get22", response.data);
          console.log(response.data);
          
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
  }

  const addAddress = async () => {
  
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const regData={locationCoordinate: currentCoordLocal, locationAddress: addressTextLocal}

    const response = await axios
      .post(baseUrl + "/api/address", regData, config)
      .then(function (response) {
        console.log("babi", response);
        if (response.data.success) {

          console.log("addresssssss");
          console.log(response.data);
          
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

  useEffect(()=>{
    localStorage.setItem("currentCoordHistory", JSON.stringify(currentCoordHistory));
  }, [currentCoordHistory])

// const testFunction=()=>{
//   console.log("PRESSED")
// }


const handleClearButton=()=>{
setRating("all")
setSortType("")
setRadiusValue(1000)
}

const handleMapView=()=>{
setViewType("map")
navigate("/")
}

const handleListView=()=>{
  setViewType("list")
  navigate("/eats")
}

const ratingText=() =>{
  if(rating=="all"){
    return (<>Rating</>)
  }else if(rating=="low"){
    return (<>Above 3.5</>)
  }else if(rating=="mid"){
    return (<>Above 4.0</>)
  }else if(rating=="high"){
    return (<>Above 4.5</>)
  }
  
}

const sortText=() =>{
  if(sortType==""){
    return (<>Sort</>)
  }else if(sortType=="rating"){
    return (<>Highest rated</>)
  }else if(sortType=="review"){
    return (<>Most reviews</>)
  }else if(sortType=="distance"){
    return (<>Closest</>)
  }else if(sortType=="popular"){
    return (<>Most popular</>)
  }
  
}
  return (
    <>
      <div className={styles.addressContainer}>
        <div  className={styles.topSectionGroup}>
        <div className={styles.addressGroup} onClick={() => handleSetAddress()}>
          <div className={styles.addressTextLogo}>
            <AiOutlineEnvironment size={20} />
          </div>
          <div className={styles.addressText}>{addressText}</div>
          <div className={styles.addressTextLogo}>
            <AiFillCaretDown />
          </div>
        </div>
        <div  className={styles.viewSelectorGroup}>
        <div  className={styles.viewSelector} onClick={()=>handleMapView()} style={viewType=="map"?{fontWeight: 600, color:"black"}:null}>Map</div>
        <div  className={styles.verticalBorder}></div>
        <div  className={styles.viewSelector} onClick={()=>handleListView()} style={viewType=="list"? {fontWeight: 600, color:"black"}:null}>List</div>
        </div>
        </div>
        <div className={styles.optionGroup}>
        {(rating!="all" || radiusValue!=1000 || sortType!="") && (<div
            className={styles.optionSingle}
            onClick={() => handleClearButton()}
          >
            <AiOutlineRedo size={16}/> Clear
          </div>)}
          <div
            className={radiusValue==1000? styles.optionSingle: styles.optionSingleColor}
            onClick={() => setRadiusControlActive(true)}
          >
            Distance
          </div>
          <div
            className={rating=="all"? styles.optionSingle: styles.optionSingleColor}
            onClick={() => setRatingControlActive(true)}
          >
            {ratingText()}
          </div>
          <div className={sortType==""? styles.optionSingle: styles.optionSingleColor}  onClick={() => setSortControlActive(true)}>{sortText()}</div>
          <div
            className={styles.optionSingle}
            onClick={() => setToggle((prev) => !prev)}
          >
            Search
          </div>
          
          
          
        </div>
      </div>

      {changeAddressModal && (
        <div id="overlayContainer" className={styles.overlayContainer}>
          <div className={styles.modalContainer}>
            {!showPosition ? (
              <>
                <div className={styles.modalHeader}>
                  <AiOutlineArrowLeft
                    size={20}
                    onClick={() => setChangeAddressModal(false)}
                  />
                  <div className={styles.headerText}>Address Setting</div>
                </div>

                <div className={styles.searchBarGroup}>
                  <div className={styles.searchBar}>
                    <input
                      placeholder="Search location..."
                      value={queryAddress}
                      onChange={(e) => setQueryAddress(e.target.value)}
                    ></input>

                    <div className={styles.searchButtonGroup}>
                      {queryAddress.length > 0 && (
                        <div
                          className={styles.clearQueryButton}
                          onClick={handleClearAddressQuery}
                        >
                          <AiOutlineClose size={14} />
                        </div>
                      )}
                      <div onClick={() => handleQueryAddress()}>
                        <AiOutlineSearch className={styles.searchBarIcon} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.modalButtonGroup}>
                  <button
                    className={styles.modalButton}
                    onClick={() => handleGetCurrentLocation()}
                  >
                    Find my location
                  </button>
                </div>

                {/* <div className={styles.modalAddressGroup}>
                <div className={styles.addressSingleGroup}>
                  <AiOutlineEnvironment size={20}/>{addressText}
                  </div>
                  <div className={styles.addressSingleGroup}>
                  <AiOutlineEnvironment size={20}/>{addressText}
                  </div>
                </div> */}

                {currentCoordHistory.length > 0 && (
                  <div className={styles.modalAddressGroup}>
                    {currentCoordHistory.map((item) => (
                      <div
                        className={styles.addressSingleGroup}
                        onClick={() => setCurrentCoord(item.locationCoordinate)}
                      ><div className={styles.addressSingleLeft}>
                        <AiOutlineEnvironment size={20} />
                        {item.locationAddress}</div>
                        <div>
                        {item.locationAddress== addressText && <AiOutlineCheck size={20} className={styles.addressSingleRight} />}<AiOutlineCloseCircle size={20}/></div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.modalMapContainer}>
                  <div className={styles.modalMapLeftBtn}>
                    <AiOutlineArrowLeft
                      size={24}
                      onClick={() => setShowPosition(false)}
                    />
                  </div>

                  <MapPositionCheck
                    coordinate={currentCoordLocal}
                    setCurrentCoordLocal={setCurrentCoordLocal}
                  />
                </div>
                <div className={styles.modalTextContainer}>
                  <div className={styles.modalAddress}>{addressTextLocal}</div>
                  <button
                    className={styles.locationSaveButton}
                    onClick={() => handleSaveLocation()}
                  >
                    Save location
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MapAddressControl;
