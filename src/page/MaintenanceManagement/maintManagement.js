import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react'
import MaintTable from './maintTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Dropdown, Form, Space, Tag } from 'antd';
import { setPageTitle } from '../../redux/page/pageSlice';
import MaintModal from './maintModal';
import { FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

function Maint() {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
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
    dispatch(setPageTitle("Maintenance Management"));
  }, []);

  const handleFilter = (type, e, name) => {
    setFilterType({
      type: type,
      value: e,
      name: name
    });
    setCurrentPage(1);
  }

  const itemsSort = [
    {
      label: "Name", key: "1",
      children: [
        { label: <span>Ascending <SortAscendingOutlined className="ml-2" /></span>, key: "aToZ", },
        { label: <span>Descending <SortDescendingOutlined className="ml-2" /></span>, key: "zToA", },
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
      </div>
      <MaintTable
        form={form}
        setIsOpenModal={setIsOpenModal}
        searchText={searchText}
        sortType={sortType}
        filterType={filterType}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage} />

      {isOpenModal && (
        <MaintModal
          form={form}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal} />
      )}
    </>
  )
}

export default Maint