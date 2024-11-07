import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import { Badge, Calendar, Form, Modal } from 'antd';
import dayjs from 'dayjs';
import { onValue, ref } from 'firebase/database';
import { getAllMaint } from '../../redux/maint/maintSlice';
import { getAllEqu } from '../../redux/equip/equSlice';
import { realtimeDB } from '../../firebase';
import CalendarModal from './calendarModal';

function CalendarPage() {
  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
  const [form] = Form.useForm();
  const [maintList, setMaintList] = useState([]);
  const [equList, setEquList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Calendar"));
    fetchData();
  }, []);

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

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const getEquById = (id) => {
    const equ = equList?.find(
      (equ) => String(equ?.id) === String(id)
    );
    return equ;
  }

  const handleDateClick = (value) => {
    const dateString = value.format("YYYY-MM-DD");

    // Tìm các mục có `maintDate` khớp với ngày hiện tại
    const matchedItems = maintList.filter((item) => {
      if (!item.maintDate) return false;
      const maintDateString = new Date(item.maintDate).toISOString().split("T")[0];
      return maintDateString === dateString;
    });

    if (matchedItems.length > 0) {
      setSelectedDateInfo(matchedItems);
      setIsOpenModal(true);
    }
  };

  const dateCellRender = (value) => {
    // Chuyển đổi thời gian `maintDate` sang định dạng `YYYY-MM-DD` để so sánh
    const dateString = value.format("YYYY-MM-DD");

    // Tìm các mục có `maintDate` khớp với ngày hiện tại
    const matchedItems = maintList.filter((item) => {
      if (!item.maintDate) return false;
      const maintDateString = new Date(item.maintDate).toISOString().split("T")[0];
      return maintDateString === dateString;
    });

    // Hiển thị `id` nếu có trùng ngày
    return matchedItems.length > 0 ? (
      <div>
        {matchedItems.map((item) => (
          <div
            key={item.id}
            onDoubleClick={() => handleDateClick(value)}>
            <Badge
              color="green"
              style={{ width: 10, height: 10 }}
              dot />
            {getEquById(item.id)?.equName}
          </div>
        ))}
      </div>
    ) : null;
  }

  return (
    <div>
      {/* <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender} /> */}
      <Calendar cellRender={dateCellRender} />;
      {isOpenModal && (
        <CalendarModal
          form={form}
          getEquById={getEquById}
          selectedDateInfo={selectedDateInfo}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal} />
      )}
    </div>
  )
}

export default CalendarPage