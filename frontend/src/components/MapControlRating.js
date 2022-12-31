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

function MapControlRating() {
  const {
    rating, setRating, radiusControlActive, setRadiusControlActive,sortControlActive, setSortControlActive, ratingControlActive, setRatingControlActive
  } = useGlobalContext();

  const handleClickOverlay = (e) => {
    console.log(e.target.id);

    if (e.target.id == "overlayContainer") {
      setRatingControlActive(false)
    }
  };

  const handleClickSort=(e)=>{
    console.log("SORT", e.target.id)
    setRating(e.target.id)
   
    setTimeout(function() {
      setRatingControlActive(false)
    }, 500);
  }
  return (
    <>
     
      {ratingControlActive && (
        <div
          id="overlayContainer"
          className={styles.overlayContainer}
          onClick={(e) => handleClickOverlay(e)}
        >
          <div className={styles.sortControlModal}>
            <div className={styles.modalHeader}>Sort</div>
            <div className={styles.modalContent} onClick={(e)=>handleClickSort(e)}>
              <div id="all" className={styles.sortItem}>All {rating=="all" && <AiOutlineCheck size={20}/>}</div>
              <div  id="low" className={styles.sortItem}>3.5 {rating=="low" && <AiOutlineCheck size={20}/>}</div>
              <div id="mid" className={styles.sortItem}>4.0 {rating=="mid" && <AiOutlineCheck size={20}/>}</div>
              <div id="high" className={styles.sortItem}>4.5 {rating=="high" && <AiOutlineCheck size={20}/>}</div>
            </div>
            <button className={styles.modalCloseBtn} onClick={()=>setRatingControlActive(false)}>Close</button>
          </div>
        </div>
      )}

      {/* <div className={styles.radiusControlContainer}>vv</div> */}
    </>
  );
}

export default MapControlRating;
