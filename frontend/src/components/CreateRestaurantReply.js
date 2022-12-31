import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./CreateRestaurantReview.module.css";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
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
  LoadingOverlay,
  Avatar,
} from "@mantine/core";
import {
  AiOutlineCamera,
  AiFillStar,
  AiOutlineCheckCircle,
  AiOutlineCheck,
} from "react-icons/ai";
import baseUrl from "../BaseUrl";
import axios from "axios";
import dayjs from "dayjs";
import { useGlobalContext } from "../context";

function CreateRestaurantReply({
  storeId,
  reviewId,
  setIsReply,
  getAllReply,
  replyToEdit,
  setReplyToEdit,
  setReviewToReply,
}) {
  const { allStores, vendor, setVendor, user, setUser, getAllStores } =
    useGlobalContext();
  const [text, setText] = useState("");

  useEffect(()=>{
if(replyToEdit && replyToEdit._id){
  setText(replyToEdit.replyText)
}
  }, [])

  console.log("REPLYY TO EDIT", replyToEdit);
  
  
  const postReply = async () => {
    const reply = { storeId: storeId, reviewId: reviewId, replyText: text };
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .post(baseUrl + `/api/reply`, reply, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("reply gud");
          console.log(response.data);
          getAllReply();
          setIsReply(false);
        }
      })
      .catch(function (error) {
        console.log(error.response.status);
      });
  };

  const editReply = async () => {
    console.log("EDIT REPLY@")
    const reply= {replyText: text}
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .put(baseUrl + `/api/reply/${replyToEdit._id}`, reply, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("menu");
          console.log(response.data);
          getAllReply();
          setReplyToEdit({});
          setReviewToReply("");
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  };

  const handleCreateReply = () => {
    if(replyToEdit && replyToEdit._id){
      editReply()
      console.log("EDIT REPLY");
    }else{
      postReply()
      console.log("POST REPLY");
    }
    console.log("lll");
  };

  const handleCancelButton = () => {
    setReplyToEdit({});
    setReviewToReply("");
  };

  return (
    <div className={styles.inputMenuContainer}>
      <input
        className={styles.textInput}
        spellcheck="false"
        placeholder="Write a review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></input>
      <div className={styles.buttonsGroup}>
        <button className={styles.inputButton} onClick={handleCreateReply}>
          Add
        </button>
        <button className={styles.inputButton} onClick={handleCancelButton}>
          Cancel
        </button>
        {/* <button
          onClick={() => setCreateReview(false)}
          className={styles.cancelButton}
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
}

export default CreateRestaurantReply;
