
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { ref, get } from "firebase/database";
import { realtimeDB } from "../../firebase";
import { DollarOutlined } from "@ant-design/icons";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    
  }, []);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [activeStatusCount, setActiveStatusCount] = useState(0);
  const [underrepairStatusCount, setUnderrepairStatusCount] = useState(0);
  const [defectiveStatusCount, setDefectiveStatusCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [equipmentList, setEquipmentList] = useState([]);

  const calculateTotalQuantity = async () => {
      const equRef = ref(realtimeDB, "equ");
      const snapshot = await get(equRef);
      const equipmentData = snapshot.val();

      const total = Object.values(equipmentData).length;
      setTotalQuantity(total);

      const count = Object.values(equipmentData).filter(equipment => equipment.equStatus === 1).length ;
      setActiveStatusCount(count);
      const count2 = Object.values(equipmentData).filter(equipment => equipment.equStatus === 2).length;
      setUnderrepairStatusCount(count2);
      
      const count3 = Object.values(equipmentData).filter(equipment => equipment.equStatus === 3).length;
      setDefectiveStatusCount(count3);

      const total1 = Object.values(equipmentData).reduce((accumulator, equipment) => {
        const price = Number(equipment.equPrice) || 0;
        const quantity = Number(equipment.equQuantity) || 0;
        return accumulator + (price * quantity);
      }, 0);
      setTotalCost(total1);

      const maintRef = ref(realtimeDB, "maint");
      const maint = await get(maintRef);
      const maintenanceData = maint.val();
      const currentDate = Date.now();
      const count1 = Object.values(maintenanceData).filter(maintenance  => {
        const maintDate = maintenance.maintDate;
        const isOverdue = maintDate && maintDate < currentDate;
      //  const isNearMaintenance = maintDate && maintDate - currentDate <= 30 * 24 * 60 * 60 * 1000; // 30 ngày
        return isOverdue;
      }).length;
      setMaintenanceCount(count1);

      const equipmentArray = Object.values(equipmentData);
      const grouped = equipmentArray.reduce((acc, equipment) => {
        const baseName = equipment.equName.slice(0, -3);
        const quantity = parseInt(equipment.equQuantity, 10);
        const price = parseInt(equipment.equPrice, 10);
        
        if (acc[baseName]) {
          acc[baseName].quantity += quantity;
          acc[baseName].totalPrice += price * quantity;
        } else {
          acc[baseName] = {
            quantity: quantity,
            totalPrice: price * quantity,
          };
        }
        return acc;
      }, {});

      const formattedData = Object.entries(grouped).map(([name, { quantity, totalPrice }]) => ({
        Name: name,
        quantity: quantity,
        totalPrice: totalPrice,
      }));

      console.log("Dữ liệu nhóm thiết bị:", formattedData);
      setEquipmentList(equipmentArray);
      
  };
  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Dashboard"));
    calculateTotalQuantity();
  }, []);

  const formatTotalCost = () => {
    return totalCost >= 1000000 
      ? `${(totalCost / 1000000).toFixed(1)}tr VND`
      : `${totalCost.toLocaleString()} VND`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={24} justify="center">
        <Col span={8}>
          <Card style={{ textAlign: 'center', borderColor: '#1890ff' }} title="Total equipment" bordered={true}>
            <h2 style={{ fontSize: '40px', color: '#1890ff' }}>{totalQuantity}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <span style={{ color: 'green' }}>Approved: {activeStatusCount}</span>
              <span style={{ color: 'orange' }}>Requesting: {underrepairStatusCount}</span>
              <span style={{ color: 'red' }}>Rejected: {defectiveStatusCount}</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#8a2be2', color: '#fff' }} title="Total Deposit" bordered={true}>
          {/*
            <h2 style={{ fontSize: '40px' }}>{totalCost.toLocaleString()} VND </h2>
          */}
            <h2 style={{ fontSize: '40px' }}>{formatTotalCost()}</h2>

            <DollarOutlined style={{ fontSize: '30px', color: '#fff' }} />
          </Card>
        </Col>
        <Col span={8}>
        <Card style={{ textAlign: 'center', borderColor: '#1890ff' }} title="Total Maintenance" bordered={true}>
            <h2 style={{ fontSize: '40px', color: '#1890ff' }}>{maintenanceCount}</h2>
        </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dashboard;
