import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import Router from './Config/Router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ChakraProvider> */}
      <RouterProvider router={Router}/>
    {/* </ChakraProvider> */}
  </StrictMode>,
)
