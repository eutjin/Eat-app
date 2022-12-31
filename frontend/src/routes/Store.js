import React, { useState, useContext, useReducer, useEffect } from "react";
import styles from "./Store.module.css";
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
  TextInput,
  Button,
  HoverCard,
  Popover,
} from "@mantine/core";
import { DatePicker, Calendar, isSameDate } from "@mantine/dates";
import {
  AiOutlineHome,
  AiOutlineCheckCircle,
  AiOutlineShop,
  AiOutlineHourglass,
  AiOutlinePhone,
  AiOutlineDollar,
  AiOutlineRight,
  AiOutlineDown,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineMore,
  AiOutlineLeft,
  AiOutlinePlus,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar,
  AiFillEdit, AiOutlineBell, AiOutlineWarning
} from "react-icons/ai";
import dayjs from "dayjs";
import { useGlobalContext } from "../context";
import baseUrl from "../BaseUrl";
import axios from "axios";
import getStores from "./About";

const Store = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor } = useGlobalContext();
  const [store, setStore] = useState({
    storeName: "",
    storeAddress: "",
    storeHours: "",
    storeFee: "",
    storePhone: "",
  });
  const [menu, setMenu] = useState([]);
  const [editName, setEditName] = useState(false);
  const [editAdd, setEditAdd] = useState(false);
  const [editHours, setEditHours] = useState(false);
  const [editFee, setEditFee] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [weekMonday, setWeekMonday] = useState(new Date());
  const [currWeekArr, setCurrWeekArr] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [editFormAdd, setEditFormAdd] = useState(false);
  const [editFormHours, setEditFormHours] = useState(false);
  const [editFormFee, setEditFormFee] = useState(false);
  const [editFormPhone, setEditFormPhone] = useState(false);
  const [editFormStorename, setEditFormStorename] = useState(false);
  const [hasMenuDates, setHasMenuDates]= useState([])
  const [hasMenuArray, setHasMenuArray]= useState([])
  const [openNotification, setOpenNotification]= useState(false)

  const { storeName, storeAddress, storeFee, storeHours, storePhone } = store;
  useEffect(() => {
    console.log("gg", location);
    // setStore(location.state);
    getStore();
    getAllMenu();
  }, []);

  const onChange = (e) => {
    setStore((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const getAllMenu = async () => {
    console.log("get menu");
    const response = await axios
      .get(baseUrl + `/api/menu/${id}`)
      .then(function (response) {
        if (response.data.success) {
          console.log("songongStore");
          console.log(response.data);
          setMenu(response.data.menu);
        }
      })
      .catch(function (error) {
        console.log("fail", error.response.data.message);
      });
  };

  const handleStoreEdit = () => {
    setEditForm(false);
    setEditFormAdd(false);
    setEditFormHours(false);
    setEditFormPhone(false);
    setEditFormFee(false);
    setEditName(false);
    setEditAdd(false);
    setEditHours(false);
    setEditPhone(false);
    setEditFee(false);
    setEditFormStorename(false);

    editStore();
    getStores();
  };

  const getStore = async () => {
    const response = await axios
      .get(baseUrl + `/api/store/singleStore/${id}`)
      .then(function (response) {
        if (response.data.success) {
          console.log("songongStore");
          console.log(response.data);
          setStore(response.data.store);
        }
      })
      .catch(function (error) {
        console.log("fail", error.response.data.message);
      });
  };

  const editStore = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };
    console.log("venT", vendor.token);
    const response = await axios
      .put(baseUrl + "/api/store/" + store._id, store, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("songong");
          console.log(response.data);
          setStore(response.data.updatedStore);
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  };

  const deleteMenu = async (id) => {
    console.log("delete menu");
    const config = {
      headers: {
        Authorization: `Bearer ${vendor.token}`,
      },
    };
    console.log("venT", vendor.token);
    const response = await axios
      .delete(baseUrl + `/api/menu/${id}`, config)
      .then(function (response) {
        if (response.data.success) {
          console.log("songongdelete");
          console.log(response.data);
          // setStore(response.data.updatedStore);
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  };

  const handleEditMenu = (menu) => {
    console.log(menu);
  };

  const handleDeleteMenu = async (menu) => {
    console.log(menu);
    await deleteMenu(menu._id);
    await getAllMenu();
  };

  useEffect(() => {
    dateToAnchor();
  }, []);

  useEffect(() => {
    dateToAnchor();
  }, [viewDate]);

  const dateToAnchor = () => {
    const d = new Date(viewDate);
    console.log("d", d);
    const day = d.getDay() || 7;
    console.log("day", day);

    if (day !== 1) {
      setWeekMonday(new Date(d.setHours(-24 * (day - 1))));
    } else {
      setWeekMonday(d);
    }
    // console.log("currentMonday", d);

    // const nextWeekMonday = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
    // console.log("nextWeekMonday", nextWeekMonday);
    // const prevWeekMonday = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
    // console.log("prevWeekMonday", prevWeekMonday);

    // const dateArray = [];
    // for (var i = 0; i < 7; i++) {
    //   dateArray.push(new Date(d.getTime() + i * 24 * 60 * 60 * 1000));
    // }
    // console.log("dateArray", dateArray);

    // setCurrWeekArr([...dateArray]);
  };

  // const dateToAnchor = () => {
  //   const d = new Date(viewDate);
  //   console.log("d", d);
  //   const day = d.getDay() || 7;
  //   console.log("day", day);

  //   if (day !== 1) {
  //     setWeekMonday(new Date(d.setHours(-24 * (day - 1))));
  //   } else {
  //     setWeekMonday(d);
  //   }
  //   // console.log("currentMonday", d);

  //   // const nextWeekMonday = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  //   // console.log("nextWeekMonday", nextWeekMonday);
  //   // const prevWeekMonday = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
  //   // console.log("prevWeekMonday", prevWeekMonday);

  //   // const dateArray = [];
  //   // for (var i = 0; i < 7; i++) {
  //   //   dateArray.push(new Date(d.getTime() + i * 24 * 60 * 60 * 1000));
  //   // }
  //   // console.log("dateArray", dateArray);

  //   // setCurrWeekArr([...dateArray]);
  // };
useEffect(()=>{
const currentDate= new Date()
const currentDateDay= currentDate.getDay()
console.log("currentDateDay 3", currentDateDay)
 
const weekRemainingDays=6-currentDateDay
const weekRemainingDate=[]
for(var i=0; i < weekRemainingDays; i++){
weekRemainingDate.push(new Date(new Date(currentDate).getTime() + i * 24 * 60 * 60 * 1000))
}
console.log("weekRemainigDate", weekRemainingDate)

const nextWeekStartDate= new Date(new Date(currentDate).getTime() + (8 - currentDateDay)* 24 * 60 * 60 * 1000)
console.log('nextWeekStartDate', nextWeekStartDate)
const nextWeekDates=[]
for(var i=0; i < 5; i++){
  nextWeekDates.push(new Date(new Date(nextWeekStartDate).getTime() + i * 24 * 60 * 60 * 1000))
  }
  console.log('nextWeekDates', nextWeekDates)

  const fullDateArray=weekRemainingDate.concat(nextWeekDates)
  console.log('fullDateArray', fullDateArray)


  //tets
  const testArr=[]
  
  // const hasMenuDates=menu.map(item => item.date)
  // console.log('hasMenuDates', hasMenuDates)

  const test= fullDateArray.map(item => {
    if(hasMenuDates.includes(new Date(item).toDateString())){
      console.log("hh")
      testArr.push({"date": new Date(item), "hasMenu": true})
    }else{
      testArr.push({"date": new Date(item), "hasMenu": false})
    }
})

  console.log("MYTEST", testArr)
  setHasMenuArray(testArr)

}, [hasMenuDates])

useEffect(()=>{
  const hasMenuDatesVar=menu.map(item => new Date(item.date).toDateString())
  console.log('hasMenuDatesVar', hasMenuDatesVar)
  setHasMenuDates(hasMenuDatesVar)
}, [menu])

// useEffect(()=>{

// }, [hasMenuDates])

  const handleSelectDate = (item) => {
    console.log("select!", item);
    setViewDate(item);
  };

  const handleNextWeek = () => {
    const newMonday = new Date(
      new Date(weekMonday).getTime() + 7 * 24 * 60 * 60 * 1000
    );
    setWeekMonday(newMonday);
    // setViewDate(newMonday);
  };

  const handlePrevWeek = () => {
    const newMonday = new Date(
      new Date(weekMonday).getTime() - 7 * 24 * 60 * 60 * 1000
    );
    setWeekMonday(newMonday);
    // setViewDate(newMonday);
  };

  const handleToday = () => {
    const currentDate = new Date();
    console.log("ccccurent", currentDate);
    setViewDate(currentDate);
  };

  useEffect(() => {
    console.log("fuckkkkkkkk");
    const dateArray = [];
    for (var i = 0; i < 7; i++) {
      dateArray.push(
        new Date(new Date(weekMonday).getTime() + i * 24 * 60 * 60 * 1000)
      );
    }
    console.log("dateArray", dateArray);

    setCurrWeekArr([...dateArray]);
  }, [weekMonday]);

  const handleClass = (item) => {
    if (isSameDate(new Date(item), new Date(viewDate))) {
      return styles.dateGroupSelected;
    } else {
      return styles.dateGroup;
    }
  };

  const handleClassDate = (item) => {
    if (isSameDate(new Date(item), new Date(viewDate))) {
      return styles.dateDateSelected;
    } else {
      return styles.dateDate;
    }
  };

  const handleClassMonth = (item) => {
    if (isSameDate(new Date(item), new Date(viewDate))) {
      return styles.dateMonthSelected;
    } else {
      return styles.dateMonth;
    }
  };

  // const handleClass = (item) => {
  //   if (item.getTime() === viewDate.getTime()) {
  //     console.log("11", item, viewDate);

  //     return styles.dateGroupSelected;
  //   } else {
  //     console.log("22", item, viewDate);
  //     return styles.dateGroup;
  //   }
  // };

  //resuable edit form
  const storeEditForm = (value1) => {
    console.log("passd", value1);

    return (
      <div className={editFormStorename? styles.inputMenuContainer2:styles.inputMenuContainer}>
        <input
          type="text"
          id={value1}
          name={value1}
          value={eval(value1)}
          onChange={onChange}
          className={styles.textInput}
        ></input>
        <div className={styles.buttonsGroup}>
          <button
            className={styles.inputButton}
            onClick={() => handleStoreEdit()}
          >
            Edit
          </button>
          <button
          className={styles.inputButtonCancel}
          onClick={() => handleCloseEdit()}
        >
          Cancel
        </button>
        </div>
        
      </div>
    );

    // return (
    //   <div className={styles.titleInfo2}>
    //     <TextInput
    //       type="text"
    //       id={value1}
    //       name={value1}
    //       value={eval(value1)}
    //       onChange={onChange}
    //       classNames={{ root: styles.editForm }}
    //     ></TextInput>
    //     <Button onClick={() => handleStoreEdit()}>OK</Button>
    //   </div>
    // );
  };

  const handleCloseEdit = () => {
    setEditFormAdd(false);
    setEditFormFee(false);
    setEditFormHours(false);
    setEditFormPhone(false);
    setEditFormStorename(false);
  };

  const handleEditForm = (e) => {
    console.log("formtarget", e.currentTarget.id);
    if (e.currentTarget.id == "storeAddress") {
      setEditFormAdd(true);
      setEditFormHours(false);
      setEditFormPhone(false);
      setEditFormFee(false);
      setEditFormStorename(false);
    } else if (e.currentTarget.id == "storeFee") {
      setEditFormAdd(false);
      setEditFormHours(false);
      setEditFormPhone(false);
      setEditFormFee(true);
      setEditFormStorename(false);
    } else if (e.currentTarget.id == "storeName") {
      setEditFormAdd(false);
      setEditFormHours(false);
      setEditFormPhone(false);
      setEditFormFee(false);
      setEditFormStorename(true);
    } else if (e.currentTarget.id == "storePhone") {
      setEditFormAdd(false);
      setEditFormHours(false);
      setEditFormPhone(true);
      setEditFormFee(false);
      setEditFormStorename(false);
    } else if (e.currentTarget.id == "storeHours") {
      console.log("maas");
      setEditFormHours(true);
      // setEditFormAdd(false);

      // setEditFormPhone(false);
      // setEditFormFee(false);
    }
  };

  // const closeAllForm=()=>{
  //   setEditFormAdd(false);
  //   setEditFormHours(false);
  //   setEditFormPhone(false);
  //   setEditFormFee(false);
  // }
  return (
    <>
      <div></div>
      <Card className={styles.card}>
        <div className={styles.titleMainSection}>
          <div className={styles.buttonBack} onClick={() => navigate(-1)}>
            <AiOutlineLeft size={"1.3rem"} />
          </div>

          {editFormStorename ? (
            storeEditForm("storeName")
          ) : (
            <div
              onMouseOver={() => setEditName(true)}
              onMouseOut={() => setEditName(false)}
            >
              <div className={styles.title}>
                <Text className={styles.titleName}>{store.storeName}</Text>

                {editName ? (
                  <div
                    id="storeName"
                    className={styles.titleEditContainer2}
                    onClick={(e) => handleEditForm(e)}
                  >
                    <AiFillEdit />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <Divider />
        <div className={styles.titleInfoMain}>
          {editFormAdd ? (
            // <div className={styles.titleInfo2}>
            //   <TextInput
            //     type="text"
            //     id="storeAddress"
            //     name="storeAddress"
            //     value={storeAddress}
            //     onChange={onChange}
            //     classNames={{ root: styles.editForm }}
            //   ></TextInput>
            //   <Button onClick={() => handleStoreEdit()}>OK</Button>
            // </div>
            storeEditForm("storeAddress")
          ) : (
            <div
              className={styles.titleInfoContainer}
              onMouseOver={() => setEditAdd(true)}
              onMouseOut={() => setEditAdd(false)}
            >
              <div className={styles.titleInfo}>
                <AiOutlineShop className={styles.titleInfoIcon} />

                <Text className={styles.titleData}>{store.storeAddress}</Text>

                {editAdd ? (
                  <div
                    id="storeAddress"
                    className={styles.titleEditContainer}
                    onClick={(e) => handleEditForm(e)}
                  >
                    <AiFillEdit />
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* {editForm ? (
            <div className={styles.titleInfo2}>
              <TextInput
                type="text"
                id="storeAddress"
                name="storeAddress"
                value={storeAddress}
                onChange={onChange}
                classNames={{ root: styles.editForm }}
              ></TextInput>
              <Button onClick={() => handleStoreEdit()}>OK</Button>
            </div>
            // storeEditForm()
          ) : (
            <div className={styles.titleInfoContainer}>
              <div
                className={styles.titleInfo}
                onMouseOver={() => setEditAdd(true)}
                onMouseOut={() => setEditAdd(false)}
              >
                <AiOutlineShop className={styles.titleInfoIcon} />

                <Text className={styles.titleData}>{store.storeAddress}</Text>

                {editAdd ? (
                  <div>
                  <AiFillEdit onClick={() => setEditForm(true)} /></div>
                ) : null}
              </div>
            </div>
          )} */}

          {/* onClick={()=> closeAllForm()} */}
          {editFormHours ? (
            storeEditForm("storeHours")
          ) : (
            <div
              className={styles.titleInfoContainer}
              onMouseOver={() => setEditHours(true)}
              onMouseOut={() => setEditHours(false)}
            >
              <div className={styles.titleInfo}>
                <AiOutlineHourglass className={styles.titleInfoIcon} />
                <Text className={styles.titleData}>{store.storeHours}</Text>
                {editHours ? (
                  <div
                    id="storeHours"
                    className={styles.titleEditContainer}
                    onClick={() => setEditFormHours(true)}
                  >
                    <AiFillEdit />
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {editFormPhone ? (
            storeEditForm("storePhone")
          ) : (
            <div
              className={styles.titleInfoContainer}
              onMouseOver={() => setEditPhone(true)}
              onMouseOut={() => setEditPhone(false)}
            >
              <div className={styles.titleInfo}>
                <AiOutlinePhone className={styles.titleInfoIcon} />
                <Text className={styles.titleData}>{store.storePhone}</Text>
                {editPhone ? (
                  <div
                    className={styles.titleEditContainer}
                    onClick={() => setEditFormPhone(true)}
                  >
                    <AiFillEdit id="storePhone" />
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {editFormFee ? (
            storeEditForm("storeFee")
          ) : (
            <div
              className={styles.titleInfoContainer}
              onMouseOver={() => setEditFee(true)}
              onMouseOut={() => setEditFee(false)}
            >
              <div className={styles.titleInfo}>
                <AiOutlineDollar className={styles.titleInfoIcon} />
                <Text className={styles.titleData}>{store.storeFee}</Text>
                {editFee ? (
                  <div
                    className={styles.titleEditContainer}
                    onClick={() => setEditFormFee(true)}
                  >
                    <AiFillEdit id="storeFee" />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* <Card className={styles.card}>
        <div className={styles.menuTitle}>
          <Text>메뉴 (lunch)</Text>
          <Text>18 August 2022</Text>
        </div>
        <Divider />
        <div className={styles.menuItem}>
          <Text>1. Spicy Pork</Text>
          <Text>2. Tempura</Text>
          <Text>3. Spicy Pork</Text>
          <Text>4. Tempura</Text>
          <Text>5. Spicy Pork</Text>
          <Text>6. Tempura</Text>
          <Text>7. Spicy Pork</Text>
          <Text>8. Tempura</Text>
        </div>
      </Card> */}

      <Card className={styles.card}>
        <div className={styles.notificationTitleSection}>Notifications <div className={styles.notificationTag} onClick={()=>setOpenNotification((prev)=>!prev)}> {hasMenuArray.length}</div></div>
        {!openNotification && hasMenuArray.length > 0 &&
        <div className={styles.notificationViewButton} onClick={()=>setOpenNotification((prev)=>!prev)}> view all</div>
        }
        
        {openNotification && <><Divider />
        <div className={styles.notificationContentContainer}>
          {hasMenuArray.length > 0
            ? hasMenuArray.map((item) => 
                item.hasMenu == false ? <div className={styles.notificationItem}>
                <div className={styles.notificationItemIcon}>
                <AiOutlineBell/>
                </div>
                <div className={styles.notificationItemContent}>
                There is no menu set for {dayjs(item.date).format("MMM DD, YYYY")}
                </div>
              </div> : null
              )
            : null}
        </div> </>}
      </Card>

      {/* <Card className={styles.card}>
        <div className={styles.titleMenuSection}>
          Notifications
          </div>
          <Divider />
          <div className={styles.notificationContentContainer}>
            {hasMenuArray.length>0? (
           hasMenuArray.map(item=>{ item.hasMenu==false ? 
            <div className={styles.notificationItem}>
              <div className={styles.notificationItemIcon}>
              <AiOutlineBell/>
              </div>
              <div className={styles.notificationItemContent}>
              
              f
              </div>
            </div>: null}
            ))
            :(null)}
          </div>
          </Card> */}

      <Card className={styles.card}>
        <div className={styles.titleMenuSection}>
          <Text className={styles.titleText}>All Menu</Text>
          <div
            className={styles.titleIconContainer}
            onClick={() =>
              navigate(`/addmenu/${id}`, {
                replace: false,
                state: { viewDate, store },
              })
            }
          >
            <AiOutlinePlus className={styles.titleIcon} />
          </div>
        </div>
        <Divider />

        {/* date selector section */}
        <Card className={styles.menuCard2}>
          <div className={styles.dateControlContainer}>
            <Popover
              width={260}
              withinPortal={true}
              position="bottom-start"
              withArrow
              shadow="md"
              className={styles.calendarPop}
            >
              <Popover.Target>
                <div className={styles.dateControl}>
                  <Text className={styles.dateControlText}>
                    {dayjs(viewDate).format("MMMM YYYY")}
                  </Text>
                  <AiOutlineDown />
                </div>
              </Popover.Target>
              <Popover.Dropdown className={styles.calendarPop}>
                <Calendar value={viewDate} onChange={setViewDate} />
              </Popover.Dropdown>
            </Popover>

            <div className={styles.calendarRight}>
              <div className={styles.calendarButtonGroup}>
                <button
                  className={styles.calendarButton}
                  onClick={() => handlePrevWeek()}
                >
                  <AiOutlineLeft />
                </button>
                <div className={styles.verticalBorder}></div>
                <button
                  className={styles.calendarButton}
                  onClick={() => handleNextWeek()}
                >
                  <AiOutlineRight />
                </button>
              </div>

              <div className={styles.calendarButtonGroup2}>
                <button
                  className={styles.calendarButtonToday}
                  onClick={() => handleToday()}
                >
                  TODAY
                </button>
              </div>
            </div>
          </div>
          {currWeekArr.length > 0 ? (
            <div className={styles.date}>
              {currWeekArr.map((item) => (
                <>
                  <div
                    className={handleClass(item)}
                    onClick={() => handleSelectDate(item)}
                  >
                    <div className={styles.dateDay}>
                      {dayjs(item).format("ddd")}
                    </div>
                    <div className={handleClassDate(item)}>
                      {dayjs(item).format("DD")}
                    </div>
                    <div className={handleClassMonth(item)}>
                      {dayjs(item).format("MMM")}
                    </div>
                  </div>
                </>
              ))}
            </div>
          ) : null}

          {currWeekArr.length > 0 ? (
            <div className={styles.marker}>
              {currWeekArr.map((item) => (
                <div className={styles.dateMarkerContainer}>
                  {menu.length > 0 ? (
                    menu.filter(
                      (item2) =>
                        new Date(item2.date).toDateString() ===
                        item.toDateString()
                    ).length > 0 ? (
                      <div className={styles.dateMarker}>
                        <AiOutlineCheckCircle />
                      </div>
                    ) : null
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        {/* Menu Card Start */}
        {menu.length > 0
          &&
          (menu
            .filter(
              (item) =>
                new Date(item.date).toDateString() === viewDate.toDateString()
            ).length>0 ?  menu
            .filter(
              (item) =>
                new Date(item.date).toDateString() === viewDate.toDateString()
            )
            .map((item) => (
              <Card className={styles.menuCard}>
                <div className={styles.menuTitle}>
                  <div className={styles.menuDate}>
                    <Text className={styles.dateDate2}>
                      {dayjs(item.date).format("DD")}
                    </Text>
                    <div className={styles.dateDividerVertical}>
                      <Text className={styles.dateMonth2}>
                        {dayjs(item.date).format("MMM")}
                      </Text>
                      <Text className={styles.dateMonth2}>
                        {dayjs(item.date).format("YYYY")}
                      </Text>
                    </div>
                    <div className={styles.menuTitle}>
                      <Text>메뉴 (lunch)</Text>
                    </div>
                  </div>

                  <div className={styles.menuMore}>
                    <Popover position="bottom-end" shadow="md" withArrow>
                      <Popover.Target>
                        <div>
                          <AiOutlineMore />
                        </div>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <div className={styles.itemButtonGroup}>
                          <Link to={"/editmenu"} state={item}>
                            <div
                              className={styles.itemButton}
                              onClick={() => handleEditMenu(item)}
                            >
                              <AiOutlineEdit />
                            </div>
                          </Link>
                          <div
                            className={styles.itemButton}
                            onClick={() => handleDeleteMenu(item)}
                          >
                            <AiOutlineDelete />
                          </div>
                        </div>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>
                <Divider />
                <div className={styles.titleInfoMain}>
                  {item.menuItems.map((food, index) => (
                    <div className={styles.titleInfoContainer}>
                      <div className={styles.menuInfo}>
                        <Text>
                          {index + 1}. {food.foodName}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )): <Card className={styles.menuCardNone}>
              <div className={styles.menuCardNoneTitle}>There is no menu on the selected date</div>
              <button className={styles.menuCardNoneButton} onClick={() =>
              navigate(`/addmenu/${id}`, {
                replace: false,
                state: { viewDate, store },
              })
            }>Create Menu</button>
            </Card>)
          
         
         
            }

{/* {menu.length > 0
          ? menu
              .filter(
                (item) =>
                  new Date(item.date).toDateString() === viewDate.toDateString()
              )
              .map((item) => (
                <Card className={styles.menuCard}>
                  <div className={styles.menuTitle}>
                    <div className={styles.menuDate}>
                      <Text className={styles.dateDate2}>
                        {dayjs(item.date).format("DD")}
                      </Text>
                      <div className={styles.dateDividerVertical}>
                        <Text className={styles.dateMonth2}>
                          {dayjs(item.date).format("MMM")}
                        </Text>
                        <Text className={styles.dateMonth2}>
                          {dayjs(item.date).format("YYYY")}
                        </Text>
                      </div>
                      <div className={styles.menuTitle}>
                        <Text>메뉴 (lunch)</Text>
                      </div>
                    </div>

                    <div className={styles.menuMore}>
                      <Popover position="bottom-end" shadow="md" withArrow>
                        <Popover.Target>
                          <div>
                            <AiOutlineMore />
                          </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <div className={styles.itemButtonGroup}>
                            <Link to={"/editmenu"} state={item}>
                              <div
                                className={styles.itemButton}
                                onClick={() => handleEditMenu(item)}
                              >
                                <AiOutlineEdit />
                              </div>
                            </Link>
                            <div
                              className={styles.itemButton}
                              onClick={() => handleDeleteMenu(item)}
                            >
                              <AiOutlineDelete />
                            </div>
                          </div>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>
                  <Divider />
                  <div className={styles.titleInfoMain}>
                    {item.menuItems.map((food, index) => (
                      <div className={styles.titleInfoContainer}>
                        <div className={styles.menuInfo}>
                          <Text>
                            {index + 1}. {food.foodName}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
          : <div>
             <Text className={styles.titleMenuSection}>No menudd</Text>
            </div>
            } */}
      </Card>
    </>
  );
};

export default Store;
