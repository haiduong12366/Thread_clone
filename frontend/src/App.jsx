import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { Box, Container } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom.js";


import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import UpdateProfilePage from "./pages/updateProfilePage.jsx";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Settings from "./pages/Settings.jsx";
import { CreatePost, Header } from "./components/index.js";


function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation()
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={pathname === "/" ? { base: 620, md: 900 } : "620px"}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <CreatePost />
                  <UserPage />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pId" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to={"/auth"} />}
          />
        </Routes>

        {/* {user && <LogoutButton />} */}
        {user && <CreatePost />}
      </Container>
    </Box>
  );
}

export default App;
