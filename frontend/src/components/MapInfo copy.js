import React, { useEffect, useState, useRef } from "react";
import styles from "./MapInfo.module.css";
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
} from "react-icons/ai";
import { useGlobalContext } from "../context";
import { addressSearch } from "./addressSearch";
import { ReactComponent as NoResult } from "../assets/noResult.svg";
import { ReactComponent as Sit1 } from "../assets/sit1.svg";
import { ReactComponent as Sit2 } from "../assets/sit2.svg";
import { ReactComponent as Sit3 } from "../assets/sit3.svg";

function MapInfo() {
  const navigate = useNavigate();
  const {
    clickedStoreCoord,
    setClickedStoreCoord,
    currentCoord,
    setCurrentCoord,
    nearbyStores,
    setNearbyStores,
  } = useGlobalContext();
  const [queryFood, setQueryFood] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [menu, setMenu] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [queryResult, setQueryResult] = useState(false);
  const [queryType, setQueryType] = useState("food");
  const [nearbyStoresMenu, setNearbyStoresMenu] = useState([]);
  const [addressError, setAddressError]= useState(false)
  const ref = useRef(null);

  useEffect(() => {
    if (menu.length > 0) {
      setToggle(true);
    }
  }, [menu]);

  useEffect(() => {
    const filteredArr = [];
    console.log(menu, nearbyStores);
    for (let i = 0; i < menu.length; i++) {
      console.log("XX", menu[i]._id);
      for (let j = 0; j < nearbyStores.length; j++) {
        console.log("YY", nearbyStores[j]._id);
        if (menu[i].storeId._id === nearbyStores[j]._id) {
          console.log("yahoo");
          filteredArr.push(menu[i]);
        }
      }
    }
    setNearbyStoresMenu(filteredArr);
    console.log("seeMe", filteredArr, menu, nearbyStores);
  }, [menu, nearbyStores]);

  const getSearchMenu = async () => {
    const searchData = { date: new Date(), query: queryFood }; //get today
    // console.log("daydate", dateData);
    // console.log("get day menu", dateData);
    const response = await axios
      .post(baseUrl + `/api/menu/search`, searchData)
      .then(function (response) {
        if (response.data.success) {
          console.log("");
          console.log("newwwww", response.data);
          setMenu(response.data.foodArray);
        } else if (!response.data.success) {
          console.log("no result bruh");
          // console.log("newwwww", response.data);
          setMenu(response.data.foodArray);
        }
      })
      .catch(function (error) {
        console.log("fail", error.response.data.message);
      });
  };

  const handleQueryFood = () => {
    getSearchMenu();
    setToggle(true);
  };

  const handleQueryMenu = (item) => {
    console.log("menu", item.storeId.storeCoordinate);
    // navigate("/", { state: item.storeId.storeCoordinate });
    setClickedStoreCoord(item.storeId.storeCoordinate);
    // navigate("/");
  };
  const dropIn = {
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      y: "0",
      opacity: 0,
    },
  };

  const handleRight = () => {
    const e = ref.current;
    e.scrollLeft += 160;
  };

  const handleLeft = () => {
    const e = ref.current;
    e.scrollLeft -= 160;
  };

  // useEffect(() => {
  //   if (queryAddress.length > 0) {
  //     setClickedStoreCoord({});
  //     addressSearch(queryAddress, (item) => {
  //       console.log("calc1", item);
  //       console.log("calc2", item.hasOwnProperty("La"));
  //       if (item.hasOwnProperty("La")) {
  //         // setAddressValidation("ADD_VALID")
  //         // setAddressError(false)
  //         setCurrentCoord({ lat: item.Ma, lng: item.La });
  //       } else {
  //         // setAddressValidation(item)
  //         // setAddressError(true)
  //         setCurrentCoord({});
  //       }
  //     });
  //   }
  // }, [queryAddress]);

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
          setCurrentCoord({ lat: item.Ma, lng: item.La });
        } else {
          // setAddressValidation(item)
          // setAddressError(true)
          // setCurrentCoord({});
          setAddressError(true)
        }
      });
    }
  };

  const handleSearchType = (e) => {
    if (e.target.dataset.value) {
      setQueryType(e.target.dataset.value);
    }
  };

  const handleClearFoodQuery = () => {
    setQueryFood("");
    setMenu([]);
  };

  const handleClearAddressQuery=()=>{
    setQueryAddress("");
  }

  const handleClickOverlay = (e) => {
    console.log(e.target.id);

    if (e.target.id == "overlayContainer") {
      setAddressError(false)
    }
  };

  return (<>
    <motion.div
      variants={dropIn}
      animate="visible"
      exit="exit"
      className={
        window.location.pathname === "/"
          ? toggle
            ? styles.infoContainer
            : styles.infoContainerMini
          : styles.infoContainerHide
      }
    >
      <div className={styles.infoContainerContent}>
        <div className={styles.searchComponent}>
          <div
            className={styles.searchTitle}
            onClick={(e) => handleSearchType(e)}
          >
            <div className={styles.searchTitleNavigation}>
              <div
                className={
                  queryType == "food"
                    ? styles.searchNavigationActive
                    : styles.searchNavigation
                }
                data-value="food"
              >
                Food Type
              </div>
              <div
                className={
                  queryType == "location"
                    ? styles.searchNavigationActive
                    : styles.searchNavigation
                }
                data-value="location"
              >
                Location
              </div>
              <div
                className={
                  queryType == "price"
                    ? styles.searchNavigationActive
                    : styles.searchNavigation
                }
                data-value="price"
              >
                Price
              </div>
            </div>
            <button
              className={styles.infoContainerBtn}
              onClick={() => setToggle(!toggle)}
            >
              {toggle ? <AiOutlineClose /> : <AiOutlineUp />}
            </button>
          </div>

          {queryType == "food" && (
            <div className={styles.searchBar}>
              <input
                placeholder="Search food..."
                value={queryFood}
                onChange={(e) => setQueryFood(e.target.value)}
              ></input>
<div className={styles.searchButtonGroup}>
              {queryFood.length>0 &&  <div
                className={styles.clearQueryButton}
                onClick={handleClearFoodQuery}
              >
                <AiOutlineClose size={14} />
              </div>}
             
              <div onClick={() => handleQueryFood()}>
                <AiOutlineSearch className={styles.searchBarIcon} />
              </div></div>
            </div>
          )}

          {queryType == "location" && (
            <div className={styles.searchBar}>
              <input
                placeholder="Search location..."
                value={queryAddress}
                onChange={(e) => setQueryAddress(e.target.value)}
              ></input>


<div className={styles.searchButtonGroup}>
{queryAddress.length>0 &&  <div
                className={styles.clearQueryButton}
                onClick={handleClearAddressQuery}
              >
                <AiOutlineClose size={14} />
              </div>}
              <div onClick={() => handleQueryAddress()}>
                <AiOutlineSearch className={styles.searchBarIcon} />
              </div></div>
            </div>
          )}

          {toggle && (
            <div className={styles.menuSectionContainer}>
              {/* <div className={styles.menuSectionLength}>ff</div> */}
              <div className={styles.menuSection} ref={ref}>
                {nearbyStoresMenu.length > 0 ? (
                  nearbyStoresMenu.map((item) => (
                    <div
                      className={styles.menuContainer}
                      onClick={() => handleQueryMenu(item)}
                    >
                      <div className={styles.menuContainerContent}>
                        <div className={styles.menuContainerTitle}>
                          <div className={styles.menuContainerName}>
                            {item.storeId.storeName}
                          </div>
                          <div className={styles.menuContainerRating}>
                            <AiFillStar />{" "}
                            {parseFloat(item.storeId.storeRatingVal).toFixed(1)}
                          </div>
                        </div>
                        {item && (
                          <div className={styles.menuContainerFoodlist}>
                            {item.menuItems.map((foodItem) => (
                              <div>{foodItem.foodName}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <Sit1 width={140} height={170} />
                    <Sit2 width={140} height={170} />
                    xxx
                  </div>
                )}
              </div>

              {nearbyStoresMenu.length > 0 && (
                <div className={styles.menuLengthOverlay}>
                  {nearbyStoresMenu.length} stores
                </div>
              )}
              {menu.length > 0 && (
                <div className={styles.calendarButtonGroup}>
                  <button
                    className={styles.calendarButton}
                    onClick={() => handleLeft()}
                  >
                    <AiOutlineLeft />
                  </button>
                  <div className={styles.verticalBorder}></div>
                  <button
                    className={styles.calendarButton}
                    onClick={() => handleRight()}
                  >
                    <AiOutlineRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
     
      {/* <div
      className={
        window.location.pathname === "/"
          ? (menu.length >0? styles.infoContainer: styles.infoContainerMini)
          : styles.infoContainerHide
      }
    >
      <div className={styles.infoContainerContent}>
        <div className={styles.searchComponent}>
          <div className={styles.searchTitle}>Search</div>

          <div className={styles.searchBar}>
            <input
              placeholder="add menu item"
              value={queryFood}
              onChange={(e) => setQueryFood(e.target.value)}
            ></input>
            <button onClick={()=>handleQueryFood()}>OK</button>
            <button onClick={()=>setToggle(!toggle)}>OK</button>
          </div>
          <div className={styles.menuSection}>
            {menu.length>0 ? (
                menu.map((item)=>(<div className={styles.menuContainer} onClick={()=>handleQueryMenu(item)}>
                    <div className={styles.menuContainerContent}>
                    <div>{item.storeId.storeName}</div>
                    {item && <div>{item.menuItems.map((foodItem)=>(<div>{foodItem.foodName}</div>))}</div>}

                    </div>
                  
                    </div>))
            ):(<div>ff</div>)}
            
          </div>
        </div>
      </div>
    </div> */}
    </motion.div>
     {addressError && (
      <div
        id="overlayContainer"
        className={styles.overlayContainer}
        onClick={(e) => handleClickOverlay(e)}
      >
        <div className={styles.addressErrorModal}>
          <div className={styles.addressErrorModalTop}>
        <div className={styles.addressErrorModalHeader}>Address not found!</div>
        <div className={styles.addressErrorModalContent}>Ensure that address is correct and proceed.</div></div>
        <Sit2 width={140} height={170} />
        <button className={styles.addressErrorModalButton} onClick={()=>setAddressError(false)}>Back</button>
        </div>
      </div>
    )}</>
  );
}

export default MapInfo;
