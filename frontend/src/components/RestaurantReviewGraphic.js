import React, { useState, useContext, useReducer, useEffect } from "react";

import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
 Rating
} from "@mantine/core";
import {
  AiFillStar,
  AiFillEdit,
  AiFillDelete,
  AiOutlineRight,
  AiOutlineLeft,
} from "react-icons/ai";
import baseUrl from "../BaseUrl";
import axios from "axios";
import dayjs from "dayjs";
import { useGlobalContext } from "../context";
import styles from "./RestaurantReviewGraphic.module.css";

function RestaurantReviewGraphic({ allReview, ratingVal, ratingQty }) {
  const [reviewBarValues, setReviewBarValues] = useState({
    1: { percent: 0, quantity: 0, rating: "1" },2: { percent: 0, quantity: 0, rating: "2" },3: { percent: 0, quantity: 0, rating: "3" },4: { percent: 0, quantity: 0, rating: "4" },5: { percent: 0, quantity: 0, rating: "5" },
  });
  console.log("allReview1", Object.keys(reviewBarValues).length);

  useEffect(() => {

   
    let reviewData = allReview.reduce((total, item) => {
      console.log("rrr", total);
      const { reviewRating } = item;

      if (!total[reviewRating]) {
        total[reviewRating] = {
          rating: reviewRating,
          quantity: 1,
          percent: (1 / allReview.length) * 100,
        };
      } else {
        total[reviewRating] = {
          ...total[reviewRating],
          quantity: total[reviewRating].quantity + 1,
          percent:
            ((total[reviewRating].quantity + 1) / allReview.length) * 100,
        };
      }
      return total;
    }, {});

    if(Object.keys(reviewData).length>0){
      console.log("hh")
      setReviewBarValues(reviewData);
    }
    
    //     for(let i=1; i<6; i++){
    //        reviewData[i]={...reviewData[i], percent: (reviewData[i].quantity)/allReview.length}
    // console.log("ass", reviewData[i][rating])
    //     }

    console.log("reviewData", reviewData[5]);
  
    // if(reviewData){
    //     console.log("lll",Object.keys(reviewData).length)
    // }
  }, [allReview]);

  //   useEffect(()=>{
  //     const reviewData= reviewBarValues
  //     console.log("kkk", reviewData)
  //     for(let i=1; i<6; i++){
  //         reviewData[i]={...reviewData[i], percent: (reviewData[i].quantity)/allReview.length}
  // //  console.log("ass", reviewData[i][rating])
  //      }

  //   }, [reviewBarValues])
  const renderBar = (i) => {

        return (
        
            <div className={styles.singleBar}>
              <div className={styles.singleBarLeft}>{reviewBarValues[i]? (`${reviewBarValues[i].rating}점`):(`${i}점`)}
                
              </div>
              <div className={styles.singleBarContainer}>

               
                <div
                  className={styles.singleBarProgress}
                  style={reviewBarValues[i]?({ width: `${reviewBarValues[i].percent.toFixed(2)}%` }):({width: "0%"})}
                ></div>
              </div>
              <div className={styles.singleBarRight}>
                {reviewBarValues[i]? (`${reviewBarValues[i].quantity}`):(0)}
              </div>
            </div>
          );
  
      
    
  };

  return (
    // {reviewBarValues.length}
    <>
      {Object.keys(reviewBarValues).length > 0 && ratingVal ?(
        <div className={styles.reviewGraphicContainer}>
          <div className={styles.reviewStarContainer}>
          <div className={styles.reviewStarHeader}>Review rating:</div>
            <Rating value={ratingVal} fractions={10} size="lg" readOnly />
          <div className={styles.reviewStarText}>{ratingVal.toFixed(1)}/5</div></div>
          <div className={styles.reviewBarContainer}>
            {renderBar(1)}
            {renderBar(2)}
            {renderBar(3)}
            {renderBar(4)}
            {renderBar(5)}
           
          </div>
        </div>
      ):(
        <div className={styles.reviewGraphicContainer}>
        <div className={styles.reviewStarContainer}>
        <div className={styles.reviewStarHeader}>Review rating:</div>
          <Rating value={0} fractions={10} size="lg" readOnly />
        <div className={styles.reviewStarText}>0/5</div></div>
        <div className={styles.reviewBarContainer}>
          {renderBar(1)}
          {renderBar(2)}
          {renderBar(3)}
          {renderBar(4)}
          {renderBar(5)}
         
        </div>
      </div>
      )}
    </>
  );
}

export default RestaurantReviewGraphic;
