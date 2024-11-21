import { PlusOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Space, Tag } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import LocTable from './locTable';
import LocModal from './locModal';
import { onValue, ref } from 'firebase/database';
import { realtimeDB } from '../../firebase';
import { getAllFlo } from '../../redux/flo/floSlice';

function Loc() {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [floList, setFloList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    getAllFloor();
    dispatch(setPageTitle("Location Management"));
  }, []);

  const getAllFloor = () => {
    const supRef = ref(realtimeDB, "flo");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = await snapshot.val();
        const floList = Object.values(data)
        dispatch(getAllFlo(floList));
        let floorOption = [];
        floList.forEach((floor) => {
          if (!floor) return;
          floorOption.push({ value: floor.id, label: "Floor " + floor.floNumber });
        });
        setFloList(floorOption);
      }
    });
  };

  const itemsSort = [
    {
      label: "Name",
      key: "name",
      children: [
        { label: <span>Ascending <SortAscendingOutlined className="ml-2" /></span>, key: "aToZ" },
        { label: <span>Descending <SortDescendingOutlined className="ml-2" /></span>, key: "zToA" },
      ],
    },
    {
      label: "Floor",
      key: "floor",
      children: [
        { label: <span>Ascending <SortAscendingOutlined className="ml-2" /></span>, key: "ascFloor" },
        { label: <span>Descending <SortDescendingOutlined className="ml-2" /></span>, key: "desFloor" },
      ],
    },
  ];

  const checkSortType = (sortType) => {
    if (sortType === "ascFloor" || sortType === "desFloor") return "Floor";
    return "Name";
  };

  return (
    <>
      <div className="p-2 mt-3 flex items-center bg-white shadow-bottom dark:bg-white">
        <div className="w-1/3 justify-start">
          <Search
            className="ml-2"
            placeholder="Search by location name"
            allowClear
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            size="large"
          />
        </div>
        <div className="w-2/3 flex justify-end">
          {sortType && (
            <Tag
              className="items-center flex"
              color="blue"
              closable
              onClose={() => setSortType("")}
            >
              Sort by {checkSortType(sortType)}
            </Tag>
          )}

          <Dropdown
            className="ml-2 bg-orange text-white"
            menu={{
              items: itemsSort,
              onClick: ({ key }) => setSortType(key),
            }}
          >
            <Button size="large">
              <Space>
                Sort
                <SortAscendingOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <Button
          className="ml-2 mr-2 bg-orange text-white"
          size="large"
          onClick={() => {
            setIsAddModal(true);
            setIsOpenModal(true);
          }}
        >
          <PlusOutlined /> Location
        </Button>
      </div>

      <LocTable
        form={form}
        setIsAddModal={setIsAddModal}
        setIsOpenModal={setIsOpenModal}
        searchText={searchText}
        sortType={sortType}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {isOpenModal && (
        <LocModal
          form={form}
          floList={floList}
          isOpenModal={isOpenModal}
          isAddModal={isAddModal}
          setIsOpenModal={setIsOpenModal}
        />
      )}
    </>
  );
}

export default Loc;
