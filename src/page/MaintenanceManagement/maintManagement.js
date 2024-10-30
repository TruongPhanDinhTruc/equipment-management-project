import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react'
import MaintTable from './maintTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form } from 'antd';
import { setPageTitle } from '../../redux/page/pageSlice';
import MaintModal from './maintModal';

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
  
  return (
    <>
      <div className='p-2 mt-8 flex items-center bg-white shadow-bottom dark:bg-white'>
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