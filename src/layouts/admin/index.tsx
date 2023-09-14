// Chakra imports
import { Portal, Box, useDisclosure } from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin";
// Layout components
import Navbar from "components/navbar/NavbarAdmin";
import Sidebar from "components/sidebar/Sidebar";
import { SidebarContext } from "contexts/SidebarContext";
import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes, { sidebarRoutes } from "routes";
import { getAccessTokenAndIdToken } from "services/userService";
import { useDispatch } from "store";
import { verifyAdminThunk } from "store/actions/userActions";
import SignIn from "views/auth/signIn";

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const dispatch = useDispatch();

  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes: RoutesType[]): string => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };

  useEffect(() => {
    if (localStorage.getItem("admin_data") !== null) {
      let datas: { isAdmin: boolean } = JSON.parse(
        localStorage.getItem("admin_data")
      );
      if (!datas.isAdmin) {
        window.location.href = "#/auth";
      }
    } else {
      window.location.href = "#/auth";
    }
  }, []);
  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((route: RoutesType, key: any) => {
      if (route.layout === "/admin") {
        return (
          <Route
            path={route.layout + route.path}
            component={route.component}
            key={key}
          />
        );
      } else {
        return <Route path={"/auth"} component={SignIn} key={"auth"} />;
      }
    });
  };
  document.documentElement.dir = "ltr";
  useEffect(() => {
    dispatch(verifyAdminThunk());
    const loadData = async (code: string) => {
      let data = await getAccessTokenAndIdToken(code);
      console.log("data", data);
    };
    const code = window.location.href.split("code=");
    if (code.length > 1) {
      loadData(code[1].toString().split("&")[0]);
    }
  }, []);

  const { onOpen } = useDisclosure();
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={sidebarRoutes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: "100%", xl: "calc( 100% - 290px )" }}
          maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={"Mamba Fantasy Admin Panel"}
                brandText={getActiveRoute(sidebarRoutes)}
                secondary={getActiveNavbar(sidebarRoutes)}
                message={getActiveNavbarText(sidebarRoutes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          {getRoute() ? (
            <Box
              mx="auto"
              p={{ base: "20px", md: "30px" }}
              pe="20px"
              minH="100vh"
              pt="50px"
            >
              <Switch>
                {getRoutes(sidebarRoutes)}
                <Redirect from="/" to="/admin/default" />
              </Switch>
              <Switch></Switch>
            </Box>
          ) : null}
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
