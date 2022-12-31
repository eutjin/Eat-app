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
  Divider, LoadingOverlay, Avatar
} from "@mantine/core";
import {
    AiOutlineCamera, AiFillStar,
} from "react-icons/ai";
import baseUrl from "../BaseUrl";
import axios from "axios";
import dayjs from "dayjs";
import { useGlobalContext } from "../context";


function EditRestaurantReview({setIdToEdit, reviewToEdit, getAllReview}) {
    const { id } = useParams();
    const { allStores, vendor, setVendor, user, setUser, getAllStores } = useGlobalContext();
    const [imageSrc, setImageSrc] = useState([])
    const [uploadData, setUploadData] = useState(reviewToEdit.reviewImage)
    const [uploadDataStored, setUploadDataStored] = useState(reviewToEdit.reviewImage)
    const [text, setText] = useState("")
    
    const [visible, setVisible]=useState(false)
    const [rating, setRating] = useState(0);
    const [submit, setSubmit]= useState(false)
    const navigate= useNavigate()

    useEffect(()=>{
setText(reviewToEdit.reviewText)
setRating(reviewToEdit.reviewRating)
// setUploadData(reviewToEdit.reviewImage)
    }, [])

    function Star({ filled, onClick }) {
        return (
          <AiFillStar
           color={filled ? "orange" : "lightgray"} 
           onClick={onClick} />
        );
      }

      function StarRating() {
        return (
          <span>
            {Array(5)
              .fill()
              .map((_, index) => (
                <Star 
           key={index} 
           filled={index < rating} 
           onClick={() => setRating(index + 1)} />
              ))}
          </span>
        );
      }


    function handleOnChange(changeEvent) {
        // const reader = new FileReader();
    
        // reader.onload = function(onLoadEvent) {
        //   setImageSrc(onLoadEvent.target.result);
        //   setUploadData(undefined);
        // }
    
        // reader.readAsDataURL(changeEvent.target.files[0]);
        setImageSrc([...imageSrc, changeEvent.target.files[0]])
        console.log("targetfiles", changeEvent.target.files[0])
    
        // var output = document.getElementById('output');
        // output.src = URL.createObjectURL(changeEvent.target.files[0]);
        // output.onload = function() {
        //   URL.revokeObjectURL(output.src) // free memory
        // }
      }

     

      async function handleImgUpload(event) {
        // event.preventDefault()
        // const form= event.currentTarget;
        // const fileInput= Array.from(form.elements).find(({name})=>name==="file")
    
        const formData = new FormData()
        // for (const file of fileInput.files){
        //   formData.append('file', file)
        // }
        for (let i = 0; i < imageSrc.length; i++) {
          formData.append('file', imageSrc[i])
    
          formData.append('upload_preset', 'myupload')
          console.log([...formData])
          const data = await fetch('https://api.cloudinary.com/v1_1/dxdwnczxv/image/upload', {
            method: 'POST',
            body: formData
          }).then(r => r.json());
          console.log(data)
          await setUploadData((uploadData) => [...uploadData, data.secure_url])
        }
        console.log('uploadData', uploadData)
        // await prePost()
      }
    
      const handleAddItem = async () => {
        setVisible(true)
        console.log("additem")
        setSubmit(true)
        if(imageSrc.length>0){
            await handleImgUpload()
        }
        else{
            await postReview()
        }
    
      }
      // const prePost=async()=>{
      //   if (uploadData.length==imageSrc.length && text && rating) {
      //         console.log("EDIT")
      //         await postReview()
      //       }
      // }
    
      useEffect(() => {
        if (uploadData.length>=imageSrc.length && text && rating && submit) {
          console.log("EDIT")
          postReview()
        }
      }, [uploadData])
    
      const postReview = async () => {
        const review = { reviewText: text, reviewRating: rating, reviewImage: uploadData }
        console.log("review", review)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
    
        const response = await axios
          .put(baseUrl + `/api/review/${reviewToEdit._id}`, review, config)
          .then(function (response) {
            if (response.data.success) {
              console.log("review edit gud");
              console.log(response.data);
    // setCreateReview(false)
    setIdToEdit('')
    setVisible(false)
    getAllReview()
    getAllStores()
            }
          })
          .catch(function (error) {
            console.log(error.response.status);
            const code= error.response.status
            if(code==401){
              console.log("heheh")
              window.localStorage.removeItem("vendor");
  window.localStorage.removeItem("user");
  setVendor("");
  setUser("")
  navigate("/about")
            }
            // showNotification({
            //   title: "Menu Registration Error",
            //   message: error.response.data.message,
            //   color: "red",
            // });
          });
      }

      const handleDeleteImage=(index)=>{
console.log("del", index)
const arr=[...imageSrc]
console.log("arr", arr)
arr.splice(index, 1)
console.log("arr2", arr)
setImageSrc(arr)
      }

      const handleDeleteImageStored=(index)=>{
        console.log("del", index)
        const arr=[...uploadData]
        console.log("arr", arr)
        arr.splice(index, 1)
        console.log("arr2", arr)
        setUploadData(arr)
        setUploadDataStored(arr)
              }

  return (
    <div className={styles.inputMenuContainer}>
         {StarRating()}
    <input
      className={styles.textInput}
      spellcheck="false"
      placeholder="Write a review..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    ></input>
    
    <div className={styles.containerBottom}>
    {/* <LoadingOverlay visible={visible} overlayBlur={2} /> */}
      <div className={styles.imageUploadGroup} >
        <label className={styles.fileInput}>
          <input type="file" name="file" onChange={handleOnChange} onClick={(event)=> { 
               event.target.value = null
          }}/>
          <AiOutlineCamera/>
        </label>
        {uploadDataStored.length > 0 &&
          uploadDataStored.map((img, index) => {
            return (
              <div className={styles.selectedImageContainer}>
                <button className={styles.selectedImageButton} onClick={()=>handleDeleteImageStored(index)}>x</button>

                <img className={styles.selectedImage} src={img} alt={img.name} />
              </div>
            )
          })
        }
        {imageSrc.length > 0 &&
          imageSrc.map((img, index) => {
            return (
              <div className={styles.selectedImageContainer}>
                <button className={styles.selectedImageButton} onClick={()=>handleDeleteImage(index)}>x</button>

                <img className={styles.selectedImage} src={URL.createObjectURL(img)} alt={img.name} />
              </div>
            )
          })
        }
      </div>
      <div className={styles.buttonsGroup}>
        <button
          disabled={text ? false : true}
          className={styles.inputButton}
          onClick={handleAddItem}
        >
          Add
        </button>
        <button
          onClick={() => setIdToEdit('')}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}

export default EditRestaurantReview