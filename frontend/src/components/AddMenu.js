import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./AddMenu.module.css";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Anchor,
  Divider,
  PasswordInput,
  Title,
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  Textarea,
  TextInput,
  Button,
  Select,
  Modal,
  Card,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";

import {
  AiOutlineHome,  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar,
  AiOutlinePlus,
} from "react-icons/ai";
import { useGlobalContext } from "../context";

import axios from "axios";
import baseUrl from "../BaseUrl";
import { showNotification } from "@mantine/notifications";
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {motion, AnimatePresence} from "framer-motion";

const AddMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { vendor, setVendor } = useGlobalContext();
  const [menuDate, setMenuDate] = useState(new Date().toDateString());
  // this 
  const [menuItems, setMenuItems] = useState([]);
  const [addItem, setAddItem] = useState(false);
  const [text, setText] = useState("");
  const [value, onChange] = useState(new Date(location.state.viewDate));
  const [successModal, setSuccessModal] = useState(false);

  const [indexToEdit, setIndexToEdit] = useState("");
  const [buttonShow, setButtonShow] = useState("");
 const [pastMenu, setPastMenu]=useState(location.state.store.storeMenu)
 const [menuSearchResult, setMenuSearchResult]=useState([])

console.log("state", location.state.store.storeMenu)

// useEffect(()=>{
//   let result=[]
// if(text.length>0){
//   console.log("gotit")
//   result= pastMenu.filter((item)=>{
//     return item.toLowerCase().includes(text.toLowerCase())
//   })
//   console.log("result", result)
//   setMenuSearchResult(result)
// }else(
//   setMenuSearchResult([])
// )
// }, [text])

  const handleAddItem = () => {
    console.log("push it");
    setMenuItems((prev) => [...prev,{foodId:uuidv4(), foodName:text}]);
    setAddItem(false);
    setText("");
  };

  const handleSubmit = () => {
    const regData = { date: value, storeId: id, menuItems };
    if (!value || !menuItems.length > 0) {
      console.log("buto!");
      showNotification({
        title: "Menu Registration Error",
        message: "Date and menu cannot be empty.",
        color: "red",
      });
    } else {
      registerMenu(regData);
    }
  };

  const registerMenu = async (regData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .post(baseUrl + "/api/menu", regData, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("menu");
          console.log(response.data);
          setSuccessModal(true);
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        showNotification({
          title: "Menu Registration Error",
          message: error.response.data.message,
          color: "red",
        });
      });
  };

  const handleEditItemButton = (index) => {
    console.log(index);
    setIndexToEdit(index);
    setText(menuItems[index].foodName);
  };

  const handleEditItem = (index) => {
    const menuItemsCopy = [...menuItems];
    menuItemsCopy.splice(index, 1, {foodId:uuidv4(), foodName:text});
    setMenuItems(menuItemsCopy);
    setIndexToEdit("");
    setText("");
  };

  const handleDeleteItemButton = (index) => {
    const menuItemsCopy = [...menuItems];
    menuItemsCopy.splice(index, 1);
    setMenuItems(menuItemsCopy);
    setIndexToEdit("");
  };

  const handleCancelAdd = () => {
    setAddItem(false);
    setText("");
  };

  const handleOnDragEnd=(result)=>{
    if(!result.destination) return;
    console.log(result)
    const menuItemsCopy = [...menuItems];
    const [reorderItem]=menuItemsCopy.splice(result.source.index, 1)
    console.log("ahha", reorderItem)
    menuItemsCopy.splice(result.destination.index,0,reorderItem)
    setMenuItems(menuItemsCopy)
  }

  const handleOnDragEnd2=(result)=>{
    if(!result.destination) return;
    console.log(result)
    const menuItemsCopy = [...pastMenu];
    const [reorderItem]=menuItemsCopy.splice(result.source.index, 1)
    console.log("ahha", reorderItem)
    menuItemsCopy.splice(result.destination.index,0,reorderItem)
    setPastMenu(menuItemsCopy)
  }

  const dropIn = {
    hidden: {
      y: "-10vh",
      opacity: 0,
    },
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
      y: "-15vh",
      opacity: 0,
    },
  };

  const handleSuggestionButton=(e)=>{
    console.log(e.target.id)
    // await setText(e.target.value)
    // handleAddItem()
    if(e.target.id!="delete"){
      setMenuItems((prev) => [...prev,{foodId:uuidv4(), foodName:e.target.id}]);
    }
   
  }

const handleDeleteSuggestion=(item)=>{
console.log("delete", item.foodId, item.foodName)
const array= pastMenu.filter((pastItem)=>pastItem.foodId!=item.foodId)
console.log("deleted array", array)
setPastMenu(array)
}

useEffect(()=>{
const data= {storeId:id, pastMenu};

const response =  axios
.post(baseUrl + "/api/menu/delPastMenu", data)
.then(function (response) {
  if (response.data.success) {
    console.log("pastmenu");
    console.log(response.data);
  
  }
})
.catch(function (error) {
  console.log(error.response.data.message);
  
});

}, [pastMenu])

  return (
    <>
      <Card className={styles.card}>
        <div className={styles.title}>
          <Text className={styles.titleName}>Menu</Text>
        </div>
        <Divider />
        <div className={styles.title}>
          <DatePicker
            placeholder="Pick date"
            dropdownType="modal"
            value={value}
            onChange={onChange}
          />
        </div>
        <Divider />
        {/* <div className={styles.title}>
        0 itms in menu
        </div>
        <Divider /> */}
        {/* {menuItems.length > 0
          ? menuItems.map((item) => (
              <>
                <div className={styles.singleItem}>
                  <Text>{item}</Text>
                </div>
                <Divider />
              </>
            ))
          : null} */}

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="foodtype">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {menuItems.length > 0
                  ? menuItems.map((item, index) =>
                      index === indexToEdit ? (
                        <div className={styles.inputMenuContainer}>
                          <input
                            className={styles.textInput}
                            spellcheck="false"
                            placeholder="add menu item"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                          ></input>

                          <div className={styles.buttonsGroup}>
                            <button
                              disabled={text ? false : true}
                              className={styles.inputButton}
                              onClick={() => handleEditItem(index)}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setIndexToEdit("")}
                              className={styles.cancelButton}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Draggable
                          key={item.foodId}
                          draggableId={item.foodId}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div
                                className={styles.singleItem}
                                onMouseOver={() => setButtonShow(index)}
                                onMouseOut={() => setButtonShow("")}
                              >
                                <Text>{item.foodName}</Text>

                                {buttonShow === index && (
                                  <div className={styles.singleItemButtons}>
                                    <div
                                      className={styles.itemButton}
                                      onClick={() =>
                                        handleEditItemButton(index)
                                      }
                                    >
                                      <AiOutlineEdit />
                                    </div>
                                    <div
                                      className={styles.itemButton}
                                      onClick={() =>
                                        handleDeleteItemButton(index)
                                      }
                                    >
                                      <AiOutlineDelete />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Divider />
                            </div>
                          )}
                        </Draggable>
                      )
                    )
                  : null}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!addItem && (
          <div
            onClick={() => setAddItem(true)}
            className={styles.addItemButton}
          >
            <AiOutlinePlus className={styles.addItemIcon} />
            <Text>Add menu item</Text>
          </div>
        )}
      </Card>
      {!addItem && (
        <>
          <div className={styles.submitButtonContainer}>
            <div className={styles.submitButtonGroup}>
              <button
                className={styles.submitButton}
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
              <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>

          <DragDropContext onDragEnd={handleOnDragEnd2}>
          <Droppable droppableId="foodtypeprevious">
          {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
            {pastMenu.length > 0 && (
              <div className={styles.menuSuggestionContainer}>
                {pastMenu.map((item, index) => (
                   <Draggable
                   key={item.foodId}
                   draggableId={item.foodId}
                   index={index}
                 >
                   {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                  <div
                    
                    className={styles.menuSuggestionItem}
                    id={item.foodName} onClick={(e) => handleSuggestionButton(e)}
                  ><div id={item.foodName}>
                    {item.foodName}
                    </div>
                    <div id="delete" className={styles.menuSuggestionDelete} onClick={()=>handleDeleteSuggestion(item)}>X</div>
                  </div>
                  </div>)}
                  </Draggable>
                ))}
              </div>
            )}
            {provided.placeholder}
            </div>
            )}
            </Droppable>
          </DragDropContext>
        </>
      )}

      {/* <button onClick={()=>handleSubmit()}>Submit</button> */}
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {addItem ? (
          <motion.div
            className={styles.inputMenuContainer}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <input
              className={styles.textInput}
              spellcheck="false"
              placeholder="add menu item"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></input>
            <div className={styles.inputMenuContainerBottom}>
              {menuSearchResult.length > 0 && (
                <div className={styles.menuSearchResult}>
                  {menuSearchResult.map((item) => (
                    <div
                      className={styles.searchResultItem}
                      onClick={() => setText(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.buttonsGroup}>
                <button
                  disabled={text ? false : true}
                  className={styles.inputButton}
                  onClick={handleAddItem}
                >
                  Add
                </button>
                <button
                  onClick={() => setAddItem(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
            {/* <AnimatePresence
       
        onExitComplete={()=>null}>
          

        </AnimatePresence> */}
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/*       
      {addItem ? (
        <div className={styles.inputMenuContainer}>
          <input
            className={styles.textInput}
            spellcheck="false"
            placeholder="add menu item"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></input>
          <div className={styles.buttonsGroup}>
            <button
              disabled={text ? false : true}
              className={styles.inputButton}
              onClick={handleAddItem}
            >
              Add
            </button>
            <button
              onClick={() => setAddItem(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null} */}

      <Modal
        centered
        opened={successModal}
        onClose={() => setSuccessModal(false)}
      >
        <div className={styles.modalContent}>
          <Text className={styles.modalTitle}>Add Menu Success!</Text>
          <Text className={styles.modalContent}>
            You can now view your menu
          </Text>
          <Button
            className={styles.modalButton}
            onClick={() => navigate(`/about/${id}`)}
          >
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddMenu;
