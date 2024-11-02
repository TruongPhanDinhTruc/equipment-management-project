import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Dashboard"));
  }, []);
  return (
    <div>dashboard</div>
  )
}

export default Dashboard