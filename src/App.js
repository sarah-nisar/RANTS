import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Register from "./pages/Register/Register";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import MarkSheetUploadPage from "./pages/MarkSheetUploadPage/MarkSheetUploadPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/issueMarksheet",
      element: <MarkSheetUploadPage />,
    },
	{
		path: "/register",
		element: <Register/>
	}
  ]);

  return (
    <>
      <Navbar />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;
