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
  AiOutlineSetting,
} from "react-icons/ai";
import { Slider } from "@mantine/core";
import { useGlobalContext } from "../context";
import { addressSearch } from "./addressSearch";

function MapControlTop() {
  const { radiusValue, setRadiusValue, radiusControlActive, setRadiusControlActive,sortControlActive, setSortControlActive, ratingControlActive, setRatingControlActive } = useGlobalContext();
  // const [radiusControlActive, setRadiusControlActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(radiusValue/20);

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
  return (
    <>
      {/* <div className={styles.mapControlContainer}>
        <div className={styles.mapControlBtn1}>Center</div>
        <div
          className={styles.mapControlBtn1}
          onClick={() => handleRadiusControlBtn()}
        >
          radius
        </div>
        <div className={styles.mapControlBtn1}>zz</div>
        <div className={styles.mapControlBtn1}>zz</div>
      </div> */}
{window.location.pathname!="/eats" && <div
        className={styles.radiusControlBtn}
        onClick={() => handleRadiusControlBtn()}
      >
        <AiOutlineSetting size={24} />
      </div>}
      

      {radiusControlActive && (
        <div
          id="overlayContainer"
          className={styles.overlayContainer}
          onClick={(e) => handleClickOverlay(e)}
        >
          <div className={styles.radiusControlModal}>
            <div className={styles.modalHeader}>Radius Control</div>
            <div className={styles.modalContent}>
            <div className={styles.radiusTop}>Within</div>
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
            <button className={styles.modalCloseBtn} onClick={()=>setRadiusControlActive(false)}>Close</button>
          </div>
        </div>
      )}

      {/* <div className={styles.radiusControlContainer}>vv</div> */}
    </>
  );
}

export default MapControlTop;
