import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { RouterProvider } from 'react-router-dom'
import Router from "./Config/Router.jsx";
import { ChakraProvider } from "@chakra-ui/react";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <ChakraProvider> */}
    <RouterProvider router={Router}/>
    {/* </ChakraProvider> */}
  </React.StrictMode>
)
