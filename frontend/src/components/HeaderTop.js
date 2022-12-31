import React, { useState, useContext, useReducer, useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  Routes, useNavigate
} from "react-router-dom";
import {
  AiOutlineHome, AiFillHome, AiFillShop,AiOutlineShop,AiOutlineProfile,AiOutlineLogout,
  AiOutlineHeart,AiOutlineUser,
  AiOutlineCrown,
  AiOutlineStar,
} from "react-icons/ai";

import {
  AppShell,
  Popover,
  Drawer,
  Navbar,
  Divider,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import styles from "./HeaderTop.module.css";
import { useGlobalContext } from "../context";
import {motion, AnimatePresence} from "framer-motion";

const { Kakao } = window;
function HeaderTop() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { user, setUser, vendor, setVendor, navState, setNavState } = useGlobalContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate= useNavigate()

  const HandleLogout = () => {
    window.localStorage.removeItem("vendor");
    window.localStorage.removeItem("user");
    console.log("logout");
    setVendor("");
    setUser("")
    setMenuOpen(false);
    handleKakaoLogout()
    // navigate("/about")
  };

  const HandleLogin=()=>{
    navigate("/login")
  }

  console.log("test", vendor);

const handleNavigate=(e)=>{
setNavState(e.currentTarget.id)
setOpened(false)
}

const dropIn = {
  hidden: {
    x: "30vw",
    opacity: 0,
  },
  visible: {
    x: "0",
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    x: "-15vw",
    opacity: 0,
  },
};

const handleKakaoLogout = () => {
  Kakao.Auth.logout()
    .then(function (response) {
      console.log("log1", Kakao.Auth.getAccessToken()); 
      console.log("logZ", response);// null
    })
    .catch(function (error) {
      console.log("Not logged in.");
    });

  Kakao.API.request({
    url: "/v1/user/unlink",
  })
    .then(function (response) {
      console.log("log2", response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

  return (
    <>
      <Header p="md" className="header">
        <div className="navbar">
        <Link to="/" ><div className={styles.logoText}>구내식</div></Link>

          <div className={styles.headerRight}>
            {vendor || user ? (
              <Popover
                opened={menuOpen}
                onChange={setMenuOpen}
                position="bottom-end"
                shadow="md"
                withArrow
                classNames={{ dropdown: styles.dropdown }}
              >
                <Popover.Target>
                  <div
                    onClick={() => setMenuOpen((o) => !o)}
                    className={styles.avatarContainer}
                  >
                   <Text> {vendor? vendor.familyname.charAt(0).toUpperCase():user.familyname.charAt(0).toUpperCase()}</Text>
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <div className={styles.dropdownAvatarGroup}>
                    {/* <div className={styles.avatarMenu}>Photo</div> */}
                    <div
                    
                    className={styles.avatarContainer}
                  >
                   <Text> {vendor? vendor.familyname.charAt(0).toUpperCase(): user.familyname.charAt(0).toUpperCase()}</Text>
                  </div>
                    <div className={styles.userGroup}>
                      <div className={styles.userName}>{vendor? vendor.familyname + vendor.firstname: user.familyname + user.firstname }</div>
                      <div className={styles.userMail}>{vendor? vendor.email:user.email}</div>
                    </div>
                  </div>
                  <Divider />
                  <div className={styles.dropdownLogoutGroup}>
                    <div
                      className={styles.dropdownLogoutItem}
                      onClick={() => HandleLogout()}
                    >
                      <div className={styles.dropdownLogoutLogo}><AiOutlineLogout/></div>
                      <Text>Logout</Text>
                    </div>
                  </div>
                </Popover.Dropdown>
              </Popover>
            ) : (
              <div className={styles.login}>
                <button className={styles.loginButton}  onClick={() => HandleLogin()}>로그인</button>
              </div>
            )}

            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
            />
          </div>
        </div>
      </Header>

      <motion.div variants={dropIn}
        initial="hidden" animate="visible" exit="exit">
      <Drawer
        classNames={{
          root: styles.drawerMain,
          drawer: styles.drawerBackground,
        }}
        position="right"
        withCloseButton={false}
        opened={opened}
        onClose={() => setOpened(false)}
        size="sm"
      >

        <div className={styles.drawerBody} >
          <Link to="/" >
            <div className={navState=="home"? styles.drawerItemSelected: styles.drawerItem} id="home" onClick={(e) => handleNavigate(e)}>
              <div className={styles.drawerItemGroup}>
                <div className={styles.drawerItemLogo}><AiOutlineHome/></div>
                <div className={styles.drawerItemText}>Home</div>
              </div>
            </div>
          </Link>

          <Link to="/eats" >
            <div className={navState=="eats"? styles.drawerItemSelected: styles.drawerItem} id="eats" onClick={(e) => handleNavigate(e)}>
              <div className={styles.drawerItemGroup}>
                <div className={styles.drawerItemLogo}><AiOutlineShop/></div>
                <div className={styles.drawerItemText}>Eats</div>
              </div>
            </div>
          </Link>

          <Link to="/about" >
            <div className={navState=="about"? styles.drawerItemSelected: styles.drawerItem} id="about" onClick={(e) => handleNavigate(e)}>
              <div className={styles.drawerItemGroup}>
                <div className={styles.drawerItemLogo}><AiOutlineProfile/></div>
                <div className={styles.drawerItemText}>About</div>
              </div>
            </div>
          </Link>

         
          {vendor || user ?
          <div className={navState=="login"? styles.drawerItemSelected: styles.drawerItem} id="login" onClick={() => HandleLogout()}>
          <div className={styles.drawerItemGroup}>
            <div className={styles.drawerItemLogo}><AiOutlineUser/></div>
            <div className={styles.drawerItemText}>Logout</div>
          </div>
        </div>:
 <Link to="/login" >
 <div className={navState=="login"? styles.drawerItemSelected: styles.drawerItem} id="login" onClick={(e) => handleNavigate(e)}>
   <div className={styles.drawerItemGroup}>
     <div className={styles.drawerItemLogo}><AiOutlineUser/></div>
     <div className={styles.drawerItemText}>Login</div>
   </div>
 </div>
</Link>
        }
        </div>
      </Drawer></motion.div>
    </>
  );
}

export default HeaderTop;
