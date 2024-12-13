import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function Chatlayout() {
  const navigate=useNavigate()

  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Chatlayout
