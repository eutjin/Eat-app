import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./RestaurantDetailReview.module.css";
import {
  Link,
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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
  Avatar,
  Modal,
  Badge,
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
import CreateRestaurantReview from "./CreateRestaurantReview";
import CreateRestaurantReply from "./CreateRestaurantReply";
import RestaurantReviewGraphic from "./RestaurantReviewGraphic";
import EditRestauratReview from "./EditRestaurantReview";

function RestaurantDetailReview({ storeId }) {
  const { allStores, vendor, setVendor, user } = useGlobalContext();
  const [allReview, setAllReview] = useState([]);
  const [createReview, setCreateReview] = useState(false);
  const [editReview, setEditReview] = useState(false);
  const [idToEdit, setIdToEdit] = useState("");
  const [reviewToEdit, setReviewToEdit] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [hoverReview, setHoverReview] = useState("");
  const [isVendorModal, setIsVendorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageReview, setCurrentPageReview] = useState([]);
  const [isReply, setIsReply] = useState(false);
  const [store, setStore] = useState({});
  const [allReply, setAllReply] = useState([]);
  const [reviewToReply, setReviewToReply] = useState("");
  const [replyToEdit, setReplyToEdit] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getAllReview();
    getAllReply();
  }, []);

  useEffect(() => {
    console.log("store", allStores, storeId);
    if (allStores.length > 0) {
      const thisStore = allStores.filter((item) => item._id == storeId);
      console.log("ts", thisStore);
      setStore(thisStore[0]);
    }
  }, [allStores]);

  useEffect(() => {
    const reviewIndexEnd = currentPage * 5 - 1;
    const reviewIndexStart = currentPage * 5 - 5;
    console.log("pagination", reviewIndexEnd, reviewIndexStart);

    const arr = allReview.filter(
      (item, index) => index >= reviewIndexStart && index <= reviewIndexEnd
    );
    console.log("filtered", arr);
    setCurrentPageReview(arr);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPageReview(allReview.slice(0, 4));
  }, [allReview]);

  const getAllReview = async () => {
    const reviews = await axios
      .get(baseUrl + `/api/review/${storeId}`)
      .then(function (response) {
        if (response.data.success) {
          console.log("reviews gget gud");
          console.log(response.data);
          setAllReview(response.data.review);
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

  const getAllReply = async () => {
    const reviews = await axios
      .get(baseUrl + `/api/reply/${storeId}`)
      .then(function (response) {
        if (response.data.success) {
          console.log("reply gget gud");
          console.log(response.data.reply);
          setAllReply(response.data.reply);
          // setAllReply(response.data.review);
        } else if (!response.data.reply.lengh > 0) {
          setAllReply([]);
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

  

  function Star({ filled }) {
    return <AiFillStar color={filled ? "orange" : "lightgray"} />;
  }

  function StarRating(rating) {
    return (
      <>
        {Array(5)
          .fill()
          .map((_, index) => (
            <Star key={index} filled={index < rating} />
          ))}
      </>
    );
  }

  const handleEditReviewButton = (reviewId) => {
    console.log("edit", reviewId);
    setIdToEdit(reviewId);
    const review = allReview.filter((item) => item._id == reviewId);
    console.log("rev", review);
    setReviewToEdit(review[0]);
  };

  const handleImageModal = (image) => {
    setShowImageModal(true);
    setModalImage(image);
  };

  const handleSetCreateReview = () => {
    if (user) {
      setCreateReview(true);
    } else if (vendor) {
      console.log("VENDOR");
      setIsVendorModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleVendorLogout = () => {
    window.localStorage.removeItem("vendor");
    setVendor("");
    navigate("/login");
  };

  const handlePrevPage = () => {
    if (currentPage != 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(allReview.length / 5);
    console.log("ceil", maxPage);
    if (currentPage != maxPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleReply = (review) => {
    setIsReply((prev) => !prev);
    console.log("review", review);
    setReviewToReply(review._id);
  };

  const handleEditReplyButton = (reply) => {
    setReplyToEdit(reply);
  };

  const handleDeleteReplyButton = async (replyId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };
    const reviews = await axios
      .delete(baseUrl + `/api/reply/${replyId}`, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("DELETE SUCCESS");
          getAllReply();

          // setAllReply(response.data.review);
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
  return (
    <>
      <Card className={styles.card}>
        <div className={styles.reviewHeader}>Reviews</div>
        <RestaurantReviewGraphic
          allReview={allReview}
          ratingVal={store.storeRatingVal}
          ratingQty={store.storeRatingQty}
        />
        {!createReview ? (
          <div
            className={
              user
                ? styles.inputMenuContainer
                : styles.inputMenuContainerDisabled
            }
            onClick={() => handleSetCreateReview()}
          >
            {user ? "Write a review..." : "Sign in to write a review..."}
          </div>
        ) : (
          <CreateRestaurantReview
            setCreateReview={setCreateReview}
            getAllReview={getAllReview}
          />
        )}

        {currentPageReview.map((item, index) =>
          item._id == idToEdit ? (
            <EditRestauratReview
              setIdToEdit={setIdToEdit}
              reviewToEdit={reviewToEdit}
              getAllReview={getAllReview}
            />
          ) : (
            <div
              className={styles.singleReviewContainer}
              key={item._id}
              onMouseOver={() => setHoverReview(item._id)}
              onMouseOut={() => setHoverReview("")}
            >
              <div className={styles.singleReviewHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.headerAvatar}>
                    <Avatar color="blue" radius="xl" />
                  </div>
                  <div className={styles.headerNotAvatar}>
                    <div className={styles.headerUserNameBadge}>
                      <div className={styles.headerUserName}>
                        {item.userId.familyname} {item.userId.firstname}
                      </div>
                      {user._id == item.userId._id && (
                        <div className={styles.headerAuthorBadge}>
                          {" "}
                          <Badge size="sm">Author</Badge>
                        </div>
                      )}
                    </div>
                    <div className={styles.headerRatingTime}>
                      <div className={styles.headerRating}>
                        {StarRating(item.reviewRating)}
                      </div>
                      <div className={styles.headerTime}>
                        {dayjs(item.createdAt).format("MMM DD, YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
                {hoverReview == item._id
                  ? user._id == item.userId._id && (
                      <div
                        className={styles.headerOption}
                        onClick={() => handleEditReviewButton(item._id)}
                      >
                        <AiFillEdit />
                      </div>
                    )
                  : null}
              </div>
              <div className={styles.reviewImagesContainer}>
                {item.reviewImage.map((image) => (
                  <div>
                    <img
                      className={styles.reviewImage}
                      src={image}
                      onClick={() => handleImageModal(image)}
                    />
                  </div>
                ))}
              </div>
              {/* <div>reiew: {item.reviewRating}</div> */}
              <div>{item.reviewText}</div>
              {store.storeOwner && vendor._id == store.storeOwner ? (
                <div className={styles.reviewReply}>
                  <button
                    className={styles.reviewReplyBtn}
                    onClick={() => handleReply(item)}
                  >
                    reply
                  </button>
                </div>
              ) : null}
              {isReply && reviewToReply == item._id && (
                <CreateRestaurantReply
                  storeId={store._id}
                  reviewId={item._id}
                  setIsReply={setIsReply}
                  getAllReply={getAllReply}
                  setReviewToReply={setReviewToReply}
                  setReplyToEdit={setReplyToEdit}
                />
              )}

              {allReply.length > 0 &&
                allReply
                  .filter((item1) => item1.reviewId == item._id)
                  .map((reply) =>
                    replyToEdit._id == reply._id ? (
                      <CreateRestaurantReply
                        storeId={store._id}
                        replyToEdit={replyToEdit}
                        getAllReply={getAllReply}
                        setReviewToReply={setReviewToReply}
                        setReplyToEdit={setReplyToEdit}
                      />
                    ) : (
                      <div className={styles.replyContainer}>
                        <div className={styles.singleReviewHeader}>
                          <div className={styles.headerLeft}>
                            <div className={styles.headerAvatar}>
                              <Avatar color="blue" radius="xl" />
                            </div>
                            <div className={styles.headerNotAvatar}>
                              <div className={styles.headerUserNameBadge}>
                                <div className={styles.headerUserName}>
                                  Store Owner
                                </div>
                                {vendor._id == reply.vendorId && (
                                  <div className={styles.headerAuthorBadge}>
                                    {" "}
                                    <Badge size="sm">Author</Badge>
                                  </div>
                                )}
                              </div>
                              <div className={styles.headerRatingTime}>
                                <div className={styles.headerTime}>
                                  {dayjs(reply.createdAt).format(
                                    "MMM DD, YYYY"
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {vendor._id == reply.vendorId &&
                          <div className={styles.headerOptionGroup}>
                          <div
                            className={styles.headerOption}
                            onClick={() => handleEditReplyButton(reply)}
                          >
                            <AiFillEdit />
                          </div>
                          <div
                            className={styles.headerOption}
                            onClick={() => handleDeleteReplyButton(reply._id)}
                          >
                            <AiFillDelete />
                          </div>
                        </div>
                          }            
                          
                        </div>

                        {reply.replyText}
                      </div>
                    )
                  )}
            </div>
          )
        )}
        {/* <div><button onClick={()=>handlePrevPage()}>LEFT</button>{currentPage}<button onClick={()=>handleNextPage()}>RIGHT</button></div> */}
        {allReview.length > 0 && (
          <div className={styles.reviewBottom}>
            <div className={styles.calendarButtonGroup}>
              <button
                className={styles.calendarButton}
                onClick={() => handlePrevPage()}
              >
                <AiOutlineLeft />
              </button>
              <div className={styles.verticalBorder}></div>
              <div className={styles.pageNumber}>{currentPage} / {Math.ceil(allReview.length/5)}</div>
              <div className={styles.verticalBorder}></div>
              <button
                className={styles.calendarButton}
                onClick={() => handleNextPage()}
              >
                <AiOutlineRight />
              </button>
            </div>
          </div>
        )}
      </Card>
      <Modal
        centered
        classNames={{ modal: styles.modalModal, header: styles.modalHeader }}
        opened={showImageModal}
        onClose={() => setShowImageModal(false)}
      >
        <img className={styles.modalImage} src={modalImage} />
      </Modal>
      <Modal
        centered
        opened={isVendorModal}
        onClose={() => setIsVendorModal(false)}
        title="Notice"
      >
        <div className={styles.vendorModalContent}>
          <div className={styles.vendorModalContentText}>
            In order to leave a review, you need to log in to a general account.
          </div>
          <div className={styles.vendorModalContentText}>
            Log out from business account and log in to general account?
          </div>
          <button onClick={handleVendorLogout} className={styles.vendorModalBtn}>Yes</button>
        </div>
      </Modal>
    </>
  );
}

export default RestaurantDetailReview;
