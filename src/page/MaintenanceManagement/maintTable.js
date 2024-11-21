import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Card, List, Pagination, Progress, Space, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getAllMaint } from '../../redux/maint/maintSlice';
import { realtimeDB } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { getAllEqu } from '../../redux/equip/equSlice';

function MaintTable({ form, setIsOpenModal, searchText, sortType, filterType, currentPage, setCurrentPage, flo, loc }) {
  const [maintList, setMaintList] = useState([]);
  const [equList, setEquList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleCardClick = (data) => {
    form.setFieldsValue(data);
    setIsOpenModal(true);
  };

  const convertMaintLocToString = (maintLoc, loc, flo) => {
    if (!Array.isArray(maintLoc))
      return maintLoc;

    const maintLocId = maintLoc[0];

    const location = loc.find((location) => location.id === maintLocId);
    const floor = location ? flo.find((floor) => floor.id === location.locFloorId) : null;

    if (maintLoc.length === 1 && floor)
      return `Floor ${floor.floNumber}`;
    if (location && floor)
      return `Floor ${floor.floNumber} / ${location.locName}`;
    if (floor)
      return `Floor ${floor.floNumber}`;
    return "Not found location";
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

  const sortList = (maintList, order) => {
    return [...maintList].sort((a, b) => {
      const nameA = getEquById(a.id)?.equName || "";
      const nameB = getEquById(b.id)?.equName || "";
      const dateA = new Date(a.maintDate);
      const dateB = new Date(b.maintDate);
      if (order === "aToZ") return nameA.localeCompare(nameB);
      if (order === "zToA") return nameB.localeCompare(nameA);
      if (order === "newestDate") return dateB - dateA;
      if (order === "oldestDate") return dateA - dateB;
      return 0;
    });
  };

  const filterByStatus = (maintList, status) => {
    if (status.type !== "status")
      return maintList;
    switch (status.value) {
      case "Activating":
        return maintList.filter((maint) => getEquById(maint.id)?.equStatus === 1);
      case "Defective":
        return maintList.filter((maint) => getEquById(maint.id)?.equStatus === 3);
      case "Under Repair":
        return maintList.filter((maint) => getEquById(maint.id)?.equStatus === 2);
      default:
        return maintList;
    }
  };

  const filterByLocation = (stdList, locationFilter) => {
    if (locationFilter.type !== "location")
      return stdList;
    return stdList = stdList.filter((std) => std.stdHighSchoolLocation === String(locationFilter.value))
  };

  const maintSearchList = maintList.filter(
    (maint) =>
      getEquById(maint.id)?.equName.toLowerCase().includes(searchText?.toLowerCase())
  );
  const maintFilterLocation = filterByLocation(maintSearchList, filterType);
  const maintFilterList = filterByStatus(maintFilterLocation, filterType);
  const maintSortList = sortList(maintFilterList, sortType);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const maintListSlice = maintSortList.slice(startIndex, endIndex);

  return (
    <>
      <List
        dataSource={maintListSlice}
        loading={isLoading}
        renderItem={(item) => (
          <Card
            key={item.id}
            style={{ marginBottom: '16px', marginTop: '16px', borderRadius: '8px' }}
            hoverable
            onClick={() => handleCardClick(item)}>
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
                    {getEquById(item.id)?.equName} #{item?.id}
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
                    <span>{convertMaintLocToString(item.maintLoc, loc, flo)}</span>
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