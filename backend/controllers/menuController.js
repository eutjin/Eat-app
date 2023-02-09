const asyncHandler = require("express-async-handler");
const Menu = require("../models/menuModel");
const Store = require("../models/storeModel");
//
const setMenu = asyncHandler(async (req, res) => {
  const { date, menuItems, storeId } = req.body;
  console.log("req.bodySetMenu", req.body);

  const store = await Store.findById(storeId);

  if (req.vendor.id !== store.storeOwner.toString()) {
    res.status(401);
    throw new Error("Store does not belong to vendor");
  }
  console.log("storeId", store);

  //not working now
  const storeMenuCreated = await Menu.find({ date: date, storeId: storeId });
  console.log("@@@z", storeMenuCreated);
  if (storeMenuCreated.length > 0) {
    res.status(400);
    throw new Error("the menu for this date already exist");
  }

  let storeMenu = [...store.storeMenu];
  // console.log("menuItems", menuItems)
  // console.log("storeMenu", storeMenu)

  if (storeMenu.length > 0) {
    for (var i = 0; i < menuItems.length; i++) {
      if (!storeMenu.some((item) => item.foodName == menuItems[i].foodName)) {
        storeMenu.push({
          foodName: menuItems[i].foodName,
          foodId: menuItems[i].foodId,
        });
      }
    }
  } else {
    for (var i = 0; i < menuItems.length; i++) {
      storeMenu.push({
        foodName: menuItems[i].foodName,
        foodId: menuItems[i].foodId,
      });
    }
  }

  console.log("storeMenu3", storeMenu);

  // for (var i = 0; i < menuItems.length; i++) {
  //   if (storeMenu.indexOf(menuItems[i].foodName) == -1) {
  //     storeMenu.push(menuItems[i].foodName);
  //     console.log(menuItems[i].foodName);
  //   }
  //   console.log("storeMenu2", storeMenu);
  // }
  // console.log("storeMenu3", storeMenu);

  const updatedStore = await Store.findByIdAndUpdate(
    storeId,
    { storeMenu: storeMenu },
    { active: false }
  ); //add menu into array for autosearch

  const menu = new Menu({
    date: date,
    storeId: storeId,
    vendorId: req.vendor.id,
    menuItems: menuItems,
  });
  menu.save((err, menu) => {
    if (err) return res.json({ message: "db create failed", err }); //success:true,
    res.status(200).json({ success: true, menu });
  });
});

//
const updateMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  console.log("menu", menu);
  console.log("menu", req.vendor.id);
  console.log("menu", menu.vendorId);
  console.log("body", req.body);

  if (menu.vendorId.toString() !== req.vendor.id) {
    res.status(401);
    throw new Error("Menu does not belong to vendor");
  }
  await Menu.findByIdAndUpdate(req.params.id, req.body).exec((err, menu) => {
    if (err) return res.json({ success: false, err });
    console.log("newmenu", menu);
    res.status(200).json({ success: true, menu });
  });
});

//
const deleteMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (menu.vendorId.toString() !== req.vendor.id) {
    res.status(401);
    throw new Error("Menu does not belong to vendor");
  }
  await menu.remove();
  res.status(200).json({ success: true, menu });
});

//get all menu for single vendor
// future task, 2 options
//option 1: delete old menus programmatically
//option 2: set time duration of menus, say from current date to two weeks after
const getAllMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.find({ storeId: req.params.id }).select([
    "_id",
    "storeId",
    "date",
    "menuItems",
  ]);
  console.log("menu", menu);
  res.status(200).json({ success: true, menu });
});

const getDayMenu = asyncHandler(async (req, res) => {
  console.log("getday", req.body, new Date());
  const date = new Date(new Date(req.body.date).setHours(0, 0, 0, 0));
  
  console.log("date", date);

  const date2 = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
  console.log("date2", date2);

  const menu = await Menu.find({
    storeId: req.params.id,
    date: {
      $gte: new Date(date),
      $lt: new Date(date2),
    },
  }).select(["_id", "storeId", "date", "menuItems"]);
  console.log("menu", menu);
  res.status(200).json({ success: true, menu });
});

const searchMenu = asyncHandler(async (req, res) => {
  // let food="짜장면"
  console.log("getdate", req.body.date);
  console.log("getquery", req.body.query);
  const date = new Date(new Date(req.body.date).setHours(0, 0, 0, 0));
  console.log("date", date);

  const date2 = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
  console.log("date2", date2);

  const menu = await Menu.find({
    date: {
      $gte: new Date(date),
      $lt: new Date(date2),
    },
  }).populate({ path: "storeId" });
  console.log("searchMenu", menu);

  let foodArray = [];
  for (let i = 0; i < menu.length; i++) {
    let foodExist = menu[i].menuItems.find(
      (menu) => menu["foodName"] == req.body.query
    );

    if (foodExist) {
      foodArray.push(menu[i]);
    }
  }
  console.log("foodArray", foodArray);
  if (foodArray.length > 0) {
    res.status(200).json({ success: true, foodArray });
  } else {
    console.log("why");
    res.status(200).json({ success: false, foodArray });
  }

  // let foodExist= menu[0].menuItems.some(menu => menu['foodName']=='삼겹살')
  // console.log("foodExist", foodExist)
  // if(menu[0].menuItems.contains('김치'))
  // {
  //     console.log("yes found")
  // }else{
  //     console.log("nah")
  // }
});

const deletePastMenu = asyncHandler(async (req, res) => {
  console.log("delPastMenu", req.body);
  const { pastMenu, storeId } = req.body;

  const store = await Store.findByIdAndUpdate(storeId, { storeMenu: pastMenu });
  console.log("store", store);
  res.status(200).json({ success: true, store });
});

module.exports = {
  setMenu,
  updateMenu,
  deleteMenu,
  getAllMenu,
  getDayMenu,
  searchMenu,
  deletePastMenu,
};
