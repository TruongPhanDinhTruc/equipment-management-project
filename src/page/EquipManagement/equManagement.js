import { CaretDownOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Space, Tag } from 'antd'
import Search from 'antd/es/transfer/search'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from "../../redux/page/pageSlice";
import EquTable from './equTable';
import EquModal from './equModal';

function Equ() {
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
    if (!sessionStorage.getItem("admin")) {
      navigate("/auth");
      return;
    }
    dispatch(setPageTitle("Equip Management"));
  }, []);

  const itemsSort = [
    {
      label: "Name", key: "1",
      children: [
        { label: "A to Z", key: "aToZ", },
        { label: "Z to A", key: "zToA", },
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
  // console.log("Data std: ", form);
  // console.log("Filter : ", filterType);

  return (
    <>
      <div className='p-2 mt-8 flex items-center bg-white shadow-bottom dark:bg-white'>
        <div className="w-1/3 justify-start">
          <Search
            className="ml-2 "
            placeholder="Search by student name, GPA..."
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

          {filterType.type === "location" && (
            <Tag
              className="items-center flex"
              color="blue"
              closable
              onClose={() => handleFilter(null, "", "")}>
              Filter by {filterType.name}
            </Tag>
          )}

          {sortType && (
            <Tag
              className="items-center flex"
              color="blue"
              closable
              onClose={() => setSortType("")}>
              Sort by {sortType === "low2High" || sortType === "high2Low" ? "GPA" : "name"}
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
          Add Equip
        </Button>
      </div>

      <EquTable
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
        <EquModal
          form={form}
          isOpenModal={isOpenModal}
          isAddModal={isAddModal}
          setIsOpenModal={setIsOpenModal} />
      )}
    </>
  )
}

export default Equ
