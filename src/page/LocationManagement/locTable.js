import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { realtimeDB } from '../../firebase';
import { getAllLoc } from '../../redux/loc/locSlice';
import { Modal, Pagination, Table } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';

function LocTable({ form, setIsAddModal, setIsOpenModal, searchText, sortType, filterType, currentPage, setCurrentPage }) {
  const [locList, setLocList] = useState([]);
  const [filteredLocList, setFilteredLocList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllLocFormDb();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [searchText, sortType, locList]);

  const getAllLocFormDb = () => {
    const supRef = ref(realtimeDB, "loc");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const locList = await snapshot.val();
        const locArray = Object.values(locList);
        setLocList(locArray);
        dispatch(getAllLoc(locArray));
      }
    });
  };

  const handleSearchAndSort = () => {
    let filteredData = [...locList];

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.locName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortType === "aToZ") {
      filteredData.sort((a, b) => a.locName.localeCompare(b.locName));
    } else if (sortType === "zToA") {
      filteredData.sort((a, b) => b.locName.localeCompare(a.locName));
    } else if (sortType === "ascFloor") {
      filteredData.sort((a, b) => Number(a.locFloorId) - Number(b.locFloorId)); // Đảm bảo là kiểu số
    } else if (sortType === "desFloor") {
      filteredData.sort((a, b) => Number(b.locFloorId) - Number(a.locFloorId)); // Đảm bảo là kiểu số
    }

    setFilteredLocList(filteredData);
  };

  const confirmDelete = (record, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this location?",
      onOk() {
        const locRef = ref(realtimeDB, `loc/${record.id}`);
        remove(locRef)
          .then(() => {
            toast.success("Remove location successfully.");
            setCurrentPage(1);
          })
          .catch((err) => {
            toast.error("Error removing data: " + err);
          });
      },
    });
  };

  const handlePaging = (current, pageSize) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const handleRowClick = (data) => {
    form.setFieldsValue(data);
    setIsAddModal(false);
    setIsOpenModal(true);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const locListSlice = filteredLocList.slice(startIndex, endIndex);

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "locName",
      key: "locName",
      width: "20%",
      render: (locName) => <span className="font-bold text-orange cursor-pointer">{locName}</span>
    },
    {
      title: "Floor",
      dataIndex: "locFloorId",
      key: "floorId",
      width: "7%",
    },
    {
      title: "Area",
      dataIndex: "locArea",
      key: "locArea",
    },
    {
      title: "Description",
      dataIndex: "locDescription",
      key: "locDescription",
    },
    {
      title: "Action",
      dataIndex: "equStatus",
      key: "action",
      width: "7%",
      render: (equStatus, record) => (
        <DeleteFilled
          className="text-black text-xl"
          onClick={(event) => confirmDelete(record, event)}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        className="py-4"
        pagination={false}
        columns={columns}
        dataSource={locListSlice}
        scroll={{
          y: 470,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <div className="flex justify-center">
        <Pagination
          total={filteredLocList.length}
          showSizeChanger
          showQuickJumper
          current={currentPage}
          pageSize={pageSize}
          showTotal={(total) => `Total ${total} equips`}
          onChange={handlePaging}
        ></Pagination>
      </div>
    </>
  );
}

export default LocTable;
