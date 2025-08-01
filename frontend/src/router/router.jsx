import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import App from "../App.jsx";

import HomePage from "../pages/HomePage.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import PostView from "../pages/PostView.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DraftsPage from "../pages/DraftsPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            { index: true, Component: HomePage },
            {
                path: "createpost",
                Component: CreatePost,
                // loader: requireAuth,
            },
            {
                path: "post/:id",
                Component: PostView,
                loader: async () => {
                    return null
                }
            },
            {
                path: "profile",
                Component: ProfilePage,
                // loader: requireAuth
            },
            // {
            //     path: "login",
            //     Component: LoginPage
            // },
            {
                path: "*",
                Component: HomePage
            },
            {
                path: "drafts",
                Component: DraftsPage,
            },
            {
                path: "editpost/:id",
                Component: CreatePost,
            },
        ]
    }
])


export default router;