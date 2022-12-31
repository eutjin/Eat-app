import React, { useEffect, useState, useRef } from "react";
import styles from "./MapControlTop.module.css";
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
  AiOutlineSetting, AiOutlineCheck,
} from "react-icons/ai";
import { Slider } from "@mantine/core";
import { useGlobalContext } from "../context";
import { addressSearch } from "./addressSearch";

function MapControlSort() {
  const {
   sortType, setSortType, radiusControlActive, setRadiusControlActive,sortControlActive, setSortControlActive, ratingControlActive, setRatingControlActive
  } = useGlobalContext();

  const handleClickOverlay = (e) => {
    console.log(e.target.id);

    if (e.target.id == "overlayContainer") {
     setSortControlActive(false)
    }
  };

  const handleClickSort=(e)=>{
    console.log("SORT", e.target.id)
    setSortType(e.target.id)
    setSortControlActive(false)
  }
  return (
    <>
     
      {sortControlActive && (
        <div
          id="overlayContainer"
          className={styles.overlayContainer}
          onClick={(e) => handleClickOverlay(e)}
        >
          <div className={styles.sortControlModal}>
            <div className={styles.modalHeader}>Sort</div>
            <div className={styles.modalContent} onClick={(e)=>handleClickSort(e)}>
              <div id="rating" className={styles.sortItem}>Highest Rated {sortType=="rating" && <AiOutlineCheck size={20}/>}</div>
              <div  id="review" className={styles.sortItem}>Most Review {sortType=="review" && <AiOutlineCheck size={20}/>}</div>
              <div id="distance" className={styles.sortItem}>Closest {sortType=="distance" && <AiOutlineCheck size={20}/>}</div>
              <div id="popular" className={styles.sortItem}>Most Popular {sortType=="popular" && <AiOutlineCheck size={20}/>}</div>
            </div>
            <button className={styles.modalCloseBtn} onClick={()=>setSortControlActive(false)}>Close</button>
          </div>
        </div>
      )}

      {/* <div className={styles.radiusControlContainer}>vv</div> */}
    </>
  );
}

export default MapControlSort;
