import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function Chatlayout() {
  const user = useSelector((state) => state?.auth?.user);
  const navigate=useNavigate()
  const location =useLocation()
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Chatlayout
