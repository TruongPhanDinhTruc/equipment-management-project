import { FilterOutlined, PlusOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Space, Tag } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import LocTable from './locTable';

function LocManagement() {
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
    dispatch(setPageTitle("Location Management"));
  }, []);

  const itemsSort = [
    {
      label: "Name", key: "1",
      children: [
        { label: <span>Ascending <SortAscendingOutlined className="ml-2" /></span>, key: "aToZ", },
        { label: <span>Descending <SortDescendingOutlined className="ml-2" /></span>, key: "zToA", },
      ],
    },
    {
      label: "Expire Date", key: "2",
      children: [
        { label: <span>Ascending date</span>, key: "ascDateExp", },
        { label: <span>Descending  date</span>, key: "desDateExp", },
      ],
    },
    {
      label: "Manufacture Date", key: "3",
      children: [
        { label: <span>Ascending date</span>, key: "ascDateManu", },
        { label: <span>Descending date</span>, key: "desDateManu", },
      ],
    },
  ];

  const itemsFilter = [
    {
      label: "Status", key: "1",
      children: [
        { label: "Activating", key: "Activating", },
        { label: "Under Repair", key: "Under Repair", },
        { label: "Defective", key: "Defective", },
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
  }

  const checkSortType = (sortType) => {
    if (sortType === "ascDateManu" || sortType === "desDateManu")
      return "Manufacture Date"
    if (sortType === "ascDateExp" || sortType === "desDateExp")
      return "Expire Date"
    return "Name"
  }

  return (
    <>
      <div className='p-2 mt-3 flex items-center bg-white shadow-bottom dark:bg-white'>
        <div className="w-1/3 justify-start">
          <Search
            className="ml-2 "
            placeholder="Search by equip name"
            allowClear
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1)
            }}
            size="large" />
        </div>
        <div className="w-2/3 flex justify-end">
          {filterType.type === "status" && (
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
              onClick: ({ key }) => handleFilter("status", key, ""),
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
          <PlusOutlined /> Location
        </Button>
      </div>

      <LocTable
        form={form}
        setIsAddModal={setIsAddModal}
        setIsOpenModal={setIsOpenModal}
        searchText={searchText}
        sortType={sortType}
        filterType={filterType}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}

export default LocManagement