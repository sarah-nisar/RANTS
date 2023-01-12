import React, { useState, useEffect, useCallback } from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Verify from "./pages/Verify/Verify";
import Register from "./pages/Register/Register";
import Requests from "./pages/Requests/Requests";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import MarkSheetUploadPage from "./pages/MarkSheetUploadPage/MarkSheetUploadPage";
import { useCVPContext } from "./Context/CVPContext";
import { useAuth } from "./Context/AuthContext";
import MainHome from "./pages/MainHome/MainHome";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/admin",
			element: <Admin />,
		},
		{
			path: "/",
			element: <MainHome />,
		},
		{
			path: "/issueMarksheet",
			element: <MarkSheetUploadPage />,
		},
		{
			path: "/register",
			element: <Register />,
		},
		{
			path: "/dashboard",
			element: <StudentDashboard />,
		},
		{
			path: "/verify",
			element: <Verify />,
		},
		{
			path: "/requests",
			element: <Requests />,
		},
	]);

	return (
		<>
			<Navbar />
			<RouterProvider router={router}></RouterProvider>
		</>
	);
};

export default App;
