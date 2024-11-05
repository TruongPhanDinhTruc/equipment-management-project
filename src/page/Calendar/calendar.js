import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import { Badge, Calendar } from 'antd';
import dayjs from 'dayjs';

function CalendarPage() {
  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Calendar"));
  }, []);
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  const getListData = (value) => {
    let listData = []; // Specify the type of listData
    switch (value.date()) {
      case 8:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event.',
          },
          {
            type: 'success',
            content: 'This is usual event.',
            onclick: (e)=>{console.log("Value: ", e);
            }
          },
        ];
        break;
      case 10:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event.',
          },
          {
            type: 'success',
            content: 'This is usual event.',
          },
          {
            type: 'error',
            content: 'This is error event.',
          },
        ];
        break;
      case 15:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event',
          },
          {
            type: 'success',
            content: 'This is very long usual event......',
          },
          {
            type: 'error',
            content: 'This is error event 1.',
          },
          {
            type: 'error',
            content: 'This is error event 2.',
          },
          {
            type: 'error',
            content: 'This is error event 3.',
          },
          {
            type: 'error',
            content: 'This is error event 4.',
          },
        ];
        break;
      default:
    }
    return listData || [];
  };
  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  return (
    <div>
      <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender} />
    </div>
  )
}

export default CalendarPage