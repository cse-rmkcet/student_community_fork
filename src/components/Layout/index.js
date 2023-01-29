import { Flex, Hide, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "../navbar";
import SideBar from "../sidebar";

// Routes that need the Layout
const routesWithLayout = ["/home", "/community", "/blog"];

const Layout = ({ children }) => {
  const router = useRouter();

  // If the current URL has the route, then render it with the Layout
  if (routesWithLayout.some((route) => router.pathname.includes(route))) {
    return (
      <Stack height="100vh">
        <Navbar />
        <Flex className="h-full" direction="row" style={{ marginTop: "0px" }}>
          <Hide below="lg">
            <SideBar />
          </Hide>
          {children}
        </Flex>
      </Stack>
    );
  }

  // Else return as it is
  return children;
};

export default Layout;
