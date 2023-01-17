import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./AddStore.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Anchor,
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

import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { useGlobalContext } from "../context";
import axios from "axios";
import baseUrl from "../BaseUrl";
import { showNotification } from "@mantine/notifications";
import { addressSearch } from "./addressSearch";
import MapValid from "../MapValid";

const AddStore = () => {
  const navigate = useNavigate();
  const { vendor, setVendor, getAllStores } = useGlobalContext();
  // const [storeCoordinate, setStoreCoordinate]= useState("")
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    storeHours: "",
    storeFee: "",
    storePhone: "",
  });
  const [successModal, setSuccessModal] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [addressValidation, setAddressValidation] = useState("");
  const [mapModal, setMapModal] = useState(false);
  const [coordinate, setCoordinate] = useState({});
  const { storeName, storeAddress, storeHours, storeFee, storePhone } =
    formData;

  useEffect(() => {
    if (storeAddress.length > 0) {
      addressSearch(storeAddress, (item) => {
        console.log("calc1", item.qa);
        console.log("calc2", item.hasOwnProperty("La"));
        if (item.hasOwnProperty("La")) {
          setAddressValidation("ADD_VALID");
          setAddressError(false);
          setCoordinate(item);
        } else {
          setAddressValidation(item);
          setAddressError(true);
        }
      });
    }
  }, [storeAddress]);

  console.log("vendor", vendor.token);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // const addres2Coord=async()=>{
  //   const storeCoord= await addressSearch(storeAddress)
  //   setStoreCoordinate(storeCoord)
  // }

  const onSubmit = async (e) => {
    e.preventDefault();

    //  await addres2Coord()

    addressSearch(storeAddress, (storeCoordinate) => {
      console.log("fuck", storeCoordinate);
      const regData = {
        storeName,
        storeAddress,
        storeHours,
        storeFee,
        storePhone,
        storeCoordinate,
      };
      if (addressError) {
        showNotification({
          title: "Address Error",
          message: "Enter a valid address in order to proceed",
          color: "red",
        });
      } else {
        registerStore(regData);
      }
    });
  };

  const registerStore = async (regData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };

    const response = await axios
      .post(baseUrl + "/api/store", regData, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("songong");
          console.log(response.data);
          setSuccessModal(true);
          getAllStores();
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        showNotification({
          title: "Registration Error",
          message: error.response.data.message,
          color: "red",
        });
      });
  };

  const formAddError = () => {
    if (addressValidation == "INVALID_ADD") {
      return "Address is invalid";
    } else if (addressValidation == "INVALID_ADD_LENGTH") {
      return "Address must include street address";
    }
  };

  const handleAddrButton = () => {
    if (coordinate.hasOwnProperty("La")) {
      setMapModal(true);
    } else {
      showNotification({
        title: "Address Error",
        message: "Enter a valid address in order to proceed",
        color: "red",
      });
    }
  };

  return (
    <>
      <Card className={styles.card}>
        <Title align="center" order={2}>
          Get started!
        </Title>
        <Text align="center">Register your store</Text>

        <form onSubmit={onSubmit}>
          <TextInput
            my={10}
            type="text"
            label="Store name"
            id="storeName"
            name="storeName"
            placeholder="enter your store name"
            value={storeName}
            onChange={onChange}
          />
          <TextInput
            my={10}
            type="text"
            label="Store address"
            id="storeAddress"
            name="storeAddress"
            placeholder="enter your store address"
            value={storeAddress}
            onChange={onChange}
            error={addressError ? formAddError() : null}
            rightSection={
              <div
                className={styles.addrButton}
                onClick={() => handleAddrButton()}
              >
                <AiOutlineEnvironment />
              </div>
            }
          />

          <TextInput
            my={10}
            type="text"
            label="Store hours"
            id="storeHours"
            name="storeHours"
            placeholder="enter your store hours"
            value={storeHours}
            onChange={onChange}
          />
          <TextInput
            my={10}
            type="text"
            label="Store fee"
            id="storeFee"
            name="storeFee"
            placeholder="enter your store fee"
            value={storeFee}
            onChange={onChange}
          />
          <TextInput
            my={10}
            type="text"
            label="Store phone"
            id="storePhone"
            name="storePhone"
            placeholder="enter your store phone"
            value={storePhone}
            onChange={onChange}
          />

          <div className={styles.formButtonGroup}>
            <Button type="submit" id="submit" className={styles.formButton} color="teal">
              Submit
            </Button>
            <Button
              className={styles.formButton}
              onClick={() => navigate("/about")} color="gray"
            >
              Back
            </Button>
          </div>
        </form>

        <Modal
          centered
          opened={successModal}
          onClose={() => setSuccessModal(false)}
        >
          <div className={styles.modalContent}>
            <Text className={styles.modalTitle}>Add Store Success!</Text>
            <Text className={styles.modalContent}>
              You can now update your menu
            </Text>
            <Button
              className={styles.modalButton}
              onClick={() => navigate("/about")}
            >
              OK
            </Button>
          </div>
        </Modal>

        <Modal
          centered
          withCloseButton={false}
          opened={mapModal}
          onClose={() => setMapModal(false)}
        >
          {/* <Text>{storeAddress}</Text> */}
          <TextInput
            my={10}
            type="text"
            label="Store address"
            id="storeAddress"
            name="storeAddress"
            placeholder="enter your store address"
            value={storeAddress}
            onChange={onChange}
            error={addressError ? formAddError() : null}
          />
          <div className={styles.mapContainer}>
            <MapValid coordinate={coordinate} />
          </div>
          <Button fullWidth onClick={() => setMapModal(false)}>
            OK
          </Button>
        </Modal>
      </Card>
    </>
  );
};

export default AddStore;
