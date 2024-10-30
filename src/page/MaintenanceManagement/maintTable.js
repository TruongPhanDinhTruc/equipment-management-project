import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Card, List, Pagination, Progress, Space, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMaint } from '../../redux/maint/maintSlice';
import { realtimeDB } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { getAllEqu } from '../../redux/equip/equSlice';

function MaintTable({ form, setIsOpenModal, searchText, sortType, filterType, currentPage, setCurrentPage }) {
  const [maintList, setMaintList] = useState([]);
  const [equList, setEquList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const equListFromRedux = useSelector((state) => state.equip?.equ?.allEqu);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([getAllMaintFromDb(), getAllEquFromDb()]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      // Đảm bảo luôn tắt loading dù thành công hay lỗi
      setIsLoading(false);
    }
  };

  const getAllMaintFromDb = () => {
    const supRef = ref(realtimeDB, "maint");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = await snapshot.val();
        setMaintList(Object.values(data));
        dispatch(getAllMaint(data));
      }
    });
  };

  const getAllEquFromDb = () => {
    const supRef = ref(realtimeDB, "equ");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const equList = await snapshot.val();
        setEquList(Object.values(equList));
        dispatch(getAllEqu(equList));
      }
    });
  }

  // console.log("Maint List: ", maintList);
  // console.log("Maint List Redux: ", equListFromRedux[1]);

  const getEquById = (id) => {
    const equ = equList?.find(
      (equ) => String(equ?.id) === String(id)
    );
    return equ;
  }

  const handlePaging = (current, pageSize) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const handleRowClick = (data) => {
    form.setFieldsValue(data);
    setIsOpenModal(true);
  };

  const calculateDaysLeft = (maintenanceDate) => {
    if (!maintenanceDate) return null; // Nếu không có ngày, trả về null

    const today = new Date();
    const maintDate = new Date(maintenanceDate);
    // Tính khoảng cách thời gian giữa hai ngày (ms)
    const timeDiff = maintDate - today;
    // Chuyển từ ms sang ngày
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft > 0 ? daysLeft : 0;
  };

  const getColor = (daysLeft) => {
    if (daysLeft < 3) return 'red';         
    if (daysLeft > 7) return 'green';      
    return 'gold';                       
  };

  const checkMaintDate = (value) => {
    if (value > 0)
      return "Maintenance remaining: " + value + " days";
    return "Maintenance date has come"
  }

  return (
    <>
      <List
        dataSource={maintList}
        loading={isLoading}
        renderItem={(item) => (
          <Card
            key={item.id}
            style={{ marginBottom: '16px', marginTop: '16px', borderRadius: '8px' }}
            hoverable
            onClick={() => handleRowClick(item)}>
            <List.Item>
              <Space style={{ width: '100%' }} direction="vertical">
                <Space align="center">
                  {/* <Badge
                    color={item.color}
                    style={{ width: 10, height: 10 }}
                    dot
                    icon={<FlagOutlined style={{ color: item.color }} />}
                  /> */}
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {getEquById(item.id)?.equName}
                  </span>
                  {/* <Badge
                    count={item.id}
                    style={{ backgroundColor: '#f0f0f0', color: '#595959' }}
                  /> */}
                  {/* <SettingOutlined /> */}
                  {getEquById(item.id)?.equStatus === 1 ? (
                    <Tag color="green">Activating</Tag>
                  ) : getEquById(item.id)?.equStatus === 2 ? (
                    <Tag color="yellow">Under repair</Tag>
                  ) : getEquById(item.id)?.equStatus === 3 ? (
                    <Tag color="red">Defective</Tag>
                  ) : (
                    <Tag color="gray">Unknown</Tag>
                  )}
                  <CalendarOutlined />
                  <span>{new Date(item.maintDate)?.toLocaleDateString()}</span>
                  <Space>
                    <EnvironmentOutlined />
                    <span>{item.maintLoc}</span>
                  </Space>
                </Space>
                <div>
                  <span style={{ color: getColor(calculateDaysLeft(item.maintDate)), fontWeight: 500 }}>{checkMaintDate(calculateDaysLeft(item.maintDate))}</span>
                  <Progress
                    // style={{direction: "rtl"}} 
                    percent={calculateDaysLeft(item.maintDate)}
                    showInfo={false} />
                  {/* <span style={{ float: 'right', color: '#1890ff' }}>{item.progress}%</span> */}
                </div>
              </Space>
            </List.Item>
          </Card>
        )}
      />
      <div className="flex justify-center">
        <Pagination
          total={maintList?.length}
          showSizeChanger
          showQuickJumper
          current={currentPage}
          pageSize={pageSize}
          showTotal={(total) => `Total ${total} equips`}
          onChange={handlePaging}
        ></Pagination>
      </div>
    </>
  )
}

export default MaintTable