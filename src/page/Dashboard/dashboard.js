import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../../firebase";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import Cards from "./Card/cards";
import PieChart from "./PieChart/pieChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [equList, setEquList] = useState([]);
  const [maintList, setMaintList] = useState([]);
  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Dashboard"));
    getAllEquFormDb();
    getAllMaintFormDb()
  }, []);

  const getAllEquFormDb = () => {
    const supRef = ref(realtimeDB, "equ");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const equList = await snapshot.val();
        setEquList(equList);
      }
    });
  };

  const getAllMaintFormDb = () => {
    const supRef = ref(realtimeDB, "maint");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const maintList = await snapshot.val();
        setMaintList(maintList);
      }
    });
  };

  // console.log("Data Maint: ", maintList);
  // console.log("Data Equ: ", equList);

  return (
    <div className="p-1">
      <Cards
        maintList={maintList}
        equList={equList} />
      <div className="flex">
        <div className="w-1/2 p-2">
          <Card>
            <PieChart
              equList={equList} />
          </Card>
        </div>
        <div className="w-1/2 p-2">
          <Card>
            {/* <PieChart
              equList={equList} /> */}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
