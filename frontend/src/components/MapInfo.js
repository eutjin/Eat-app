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
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { useGlobalContext } from "../context";
import { addressSearch } from "./addressSearch";
import { ReactComponent as NoResult } from "../assets/noResult.svg";
import { ReactComponent as Sit1 } from "../assets/sit1.svg";
import { ReactComponent as Sit2 } from "../assets/sit2.svg";
import { ReactComponent as Sit3 } from "../assets/sit3.svg";

const getQueryHistory = () => {
  let storage = localStorage.getItem("queryHistory");
  if (storage) {
    return JSON.parse(storage);
  } else {
    return "";
  }
};
function MapInfo() {
  const navigate = useNavigate();
  const {
    clickedStoreCoord,
    setClickedStoreCoord,
    currentCoord,
    setCurrentCoord,
    nearbyStores,
    setNearbyStores,
    searchMode,
    setSearchMode,
    toggle,
    setToggle,
  } = useGlobalContext();
  const [queryFood, setQueryFood] = useState("");

  const [menu, setMenu] = useState([]);
  // const [toggle, setToggle] = useState(true);
  const [queryResult, setQueryResult] = useState(false);
  const [queryType, setQueryType] = useState("food");
  const [nearbyStoresMenu, setNearbyStoresMenu] = useState([]);
  const [queryHistory, setQueryHistory] = useState(getQueryHistory());
  const [showSearchResult, setShowSearchResult] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (menu.length > 0) {
      setToggle(true);
    }
  }, [menu]);

  useEffect(() => {
    localStorage.setItem("queryHistory", JSON.stringify(queryHistory));
  }, [queryHistory]);

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
    if (!queryHistory.includes(queryFood)) {
      setQueryHistory([...queryHistory, queryFood]);
    }
    setShowSearchResult(true);
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

  const handleSearchType = (e) => {
    if (e.target.dataset.value) {
      setQueryType(e.target.dataset.value);
    }
  };

  const handleClearFoodQuery = () => {
    setQueryFood("");
    setMenu([]);
  };

  const handleClickOverlay = (e) => {
    console.log(e.target.id);

    if (e.target.id == "overlayContainer") {
      // setAddressError(false);
    }
  };

  const handleClearHistory = () => {
    setQueryHistory([]);
  };

  return (
    <>
      <div
        className={
          window.location.pathname === "/"
            ? toggle
              ? styles.infoContainer
              : styles.infoContainerHide
            : styles.infoContainerHide
        }
      >
        <div className={styles.infoContainerContent}>
         
          

          <div className={styles.searchComponent}>
            {!showSearchResult ? (
              <>
               <div className={styles.searchSectionHeader}>
            <div className={styles.searchSectionText}>Search</div>
            <div className={styles.searchSectionClose} onClick={()=>setToggle(false)}><AiOutlineClose size={22}/></div>
            
          </div>
                <div className={styles.searchBar}>
                  <input
                    placeholder="Search food..."
                    value={queryFood}
                    onChange={(e) => setQueryFood(e.target.value)}
                  ></input>
                  <div className={styles.searchButtonGroup}>
                    {queryFood.length > 0 && (
                      <div
                        className={styles.clearQueryButton}
                        onClick={handleClearFoodQuery}
                      >
                        <AiOutlineClose size={14} />
                      </div>
                    )}

                    <div onClick={() => handleQueryFood()}>
                      <AiOutlineSearch className={styles.searchBarIcon} />
                    </div>
                  </div>
                </div>

                <div className={styles.searchRecent}>
                  <div className={styles.searchRecentTitle}>
                    Recent Searches
                    {queryHistory.length > 0 && (
                      <div
                        className={styles.searchRecentClear}
                        onClick={() => handleClearHistory()}
                      >
                        Clear
                      </div>
                    )}
                  </div>
                  <div className={styles.searchRecentKeyGroup}>
                    {queryHistory.length > 0 &&
                      queryHistory.map((item) => (
                        <div
                          className={styles.optionSingle}
                          onClick={() => setQueryFood(item)}
                        >
                          {item}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.menuSectionContainer}>
                <div className={styles.menuSectionBack}>
                  <AiOutlineArrowLeft
                    size={22}
                    onClick={() => setShowSearchResult(false)}
                  />
                </div>
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
                              {parseFloat(item.storeId.storeRatingVal).toFixed(
                                1
                              )}
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
                    <div>No search Results</div>
                  )}
                </div>

                {nearbyStoresMenu.length > 0 && (
                  <div className={styles.menuLengthOverlay}>
                    {nearbyStoresMenu.length} stores
                  </div>
                )}
                {nearbyStoresMenu.length > 0 && (
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
      </div>
    </>
  );
}

export default MapInfo;
