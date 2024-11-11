import { FilterOutlined, PlusOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Space, Tag } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import FloTable from './floTable';
import FloModal from './floModal';

function FloManagement() {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");
  const [filterType, setFilterType] = useState({ type: null, value: "", name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Floor Management"));
  }, []);

  const itemsSort = [
    {
      label: "Floor Number", key: "1",
      children: [
        { label: <span>Ascending <SortAscendingOutlined className="ml-2" /></span>, key: "ascFloor" },
        { label: <span>Descending <SortDescendingOutlined className="ml-2" /></span>, key: "descFloor" },
      ],
    },
    {
      label: "Total Rooms", key: "2",
      children: [
        { label: <span>Ascending rooms</span>, key: "ascRooms" },
        { label: <span>Descending rooms</span>, key: "descRooms" },
      ],
    },
  ];

  const itemsFilter = [
    {
      label: "Floor Description", key: "1",
      children: [
        { label: "Commercial", key: "Commercial" },
        { label: "Technical", key: "Technical" },
      ],
    },
  ];

  const handleFilter = (type, e, name) => {
    setFilterType({
      type: type,
      value: e,
      name: name
    });
    setCurrentPage(1);
  };

  const checkSortType = (sortType) => {
    if (sortType === "ascRooms" || sortType === "descRooms") return "Total Rooms";
    return "Floor Number";
  };

  return (
    <>
      <div className='p-2 mt-3 flex items-center bg-white shadow-bottom dark:bg-white'>
        <div className="w-1/3 justify-start">
          <Search
            className="ml-2"
            placeholder="Search by floor description"
            allowClear
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            size="large" />
        </div>
        <div className="w-2/3 flex justify-end">
          {filterType.type === "description" && (
            <Tag
              className="items-center flex"
              color="blue"
              closable
              onClose={() => handleFilter(null, "", "")}>
              Filter by {filterType.value}
            </Tag>
          )}

          {sortType && (
            <Tag
              className="items-center flex"
              color="blue"
              closable
              onClose={() => setSortType("")}>
              Sort by {checkSortType(sortType)}
            </Tag>
          )}

          <Dropdown
            className="ml-2 bg-orange text-white"
            menu={{
              items: itemsFilter,
              onClick: ({ key }) => handleFilter("description", key, ""),
            }}>
            <Button size="large">
              <Space>
                Filter
                <FilterOutlined />
              </Space>
            </Button>
          </Dropdown>

          <Dropdown
            className="ml-2 bg-orange text-white"
            menu={{
              items: itemsSort,
              onClick: ({ key }) => setSortType(key),
            }}>
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
          }}>
          <PlusOutlined /> Floor
        </Button>
      </div>

      <FloTable
        form={form}
        setIsAddModal={setIsAddModal}
        setIsOpenModal={setIsOpenModal}
        searchText={searchText}
        sortType={sortType}
        filterType={filterType}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {isOpenModal && (
        <FloModal
          form={form}
          isOpenModal={isOpenModal}
          isAddModal={isAddModal}
          setIsOpenModal={setIsOpenModal} />
      )}
    </>
  );
}

export default FloManagement;
