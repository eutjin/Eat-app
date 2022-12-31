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
  AiOutlineHome,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar,
  AiOutlinePlus,
} from "react-icons/ai";
import { useGlobalContext } from "../context";
import axios from "axios";
import baseUrl from "../BaseUrl";
import { showNotification } from "@mantine/notifications";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const EditMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { vendor, setVendor } = useGlobalContext();
  const [menuDate, setMenuDate] = useState(new Date().toDateString());
  const [menuItems, setMenuItems] = useState([]);
  const [addItem, setAddItem] = useState(false);
  const [text, setText] = useState("");
  const [value, onChange] = useState(new Date(location.state.date));
  const [successModal, setSuccessModal] = useState(false);
  const [menu, setMenu] = useState(location.state);
  const [indexToEdit, setIndexToEdit] = useState("");
  const [buttonShow, setButtonShow] = useState("");

  //   useEffect(()=>{
  // setMenu(location.state)
  //   }, [])

  useEffect(() => {
    setMenuDate(menu.date);
    console.log("mm", menu.menuItems);
    setMenuItems(menu.menuItems);
    onChange(menu.date);
  }, [menu]);

  const handleAddItem = () => {
    console.log("push it");
    setMenuItems((prev) => [...prev, text]);
    setAddItem(false);
    setText("");
  };

  const handleSubmit = () => {
    const regData = { date: value, menuItems };
    if (!value || !menuItems.length > 0) {
      console.log("buto!");
      showNotification({
        title: "Menu Edit Error",
        message: "Date and menu cannot be empty.",
        color: "red",
      });
    } else {
      editMenu(regData);
    }
  };

  const editMenu = async (regData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .put(baseUrl + `/api/menu/${menu._id}`, regData, config)
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
          title: "Menu Edit Error",
          message: error.response.data.message,
          color: "red",
        });
      });
  };

  const handleEditItemButton = (index) => {
    console.log(index);
    setIndexToEdit(index);
    setText(menuItems[index]);
  };

  const handleEditItem = (index) => {
    const menuItemsCopy = [...menuItems];
    menuItemsCopy.splice(index, 1, text);
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
        <DragDropContext>
          <Droppable>
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
                <>
                  <div
                    className={styles.singleItem}
                    onMouseOver={() => setButtonShow(index)}
                    onMouseOut={() => setButtonShow("")}
                  >
                    <Text>{item}</Text>

                    {buttonShow === index && (
                      <div className={styles.singleItemButtons}>
                        <div
                          className={styles.itemButton}
                          onClick={() => handleEditItemButton(index)}
                        >
                          <AiOutlineEdit />
                        </div>
                        <div
                          className={styles.itemButton}
                          onClick={() => handleDeleteItemButton(index)}
                        >
                          <AiOutlineDelete />
                        </div>
                      </div>
                    )}
                  </div>
                  <Divider />
                </>
              )
            )
          : null}
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
        <div className={styles.submitButtonContainer}>
          <button
            className={styles.submitButton}
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      )}
      {/* <button onClick={()=>handleSubmit()}>Submit</button> */}
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
              onClick={() => handleCancelAdd()}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <Modal opened={successModal} onClose={() => setSuccessModal(false)}>
        <Text>Add Menu Success!</Text>
        <Button onClick={() => navigate(`/about/${menu.storeId}`)}>OK</Button>
      </Modal>
    </>
  );
};

export default EditMenu;
