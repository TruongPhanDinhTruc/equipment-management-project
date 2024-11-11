import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { realtimeDB } from '../../firebase';
import { getAllFlo } from '../../redux/flo/floSlice';
import { Modal, Pagination, Table } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';

function FloTable({ form, setIsAddModal, setIsOpenModal, searchText, sortType, filterType, currentPage, setCurrentPage }) {
  const [floList, setFloList] = useState([]); 
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllFloFromDb();
  }, []);

  const getAllFloFromDb = () => {
    const floRef = ref(realtimeDB, "flo");
    onValue(floRef, async (snapshot) => {
      if (snapshot.exists()) {
        const floList = await snapshot.val();
        setFloList(Object.values(floList));
        dispatch(getAllFlo(floList));
      }
    });
  };

  const confirmDelete = (record, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this floor?",
      onOk() {
        const floRef = ref(realtimeDB, `flo/${record.id}`);
        const deleteFlo = remove(floRef);

        Promise.all([deleteFlo])
          .then(() => {
            toast.success("Remove floor successfully.");
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
  const floListSlice = floList.slice(startIndex, endIndex);

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Floor Number",
      dataIndex: "floNumber",
      key: "floNumber",
      width: "15%",
      render: (floNumber) => <span>{floNumber}</span>
    },
    {
      title: "Description",
      dataIndex: "floDescription",
      key: "floDescription",
      width: "20%",
      render: (floDescription) => <span>{floDescription}</span>
    },
    {
      title: "Total Rooms",
      dataIndex: "total_rooms",
      key: "total_rooms",
      width: "10%",
      render: (total_rooms) => <span>{total_rooms}</span>
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (action, record) => (
        <DeleteFilled
          className=" text-black text-xl"
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
        dataSource={floListSlice}
        scroll={{
          y: 470,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              handleRowClick(record);
            },
          };
        }}
      />
      <div className="flex justify-center">
        <Pagination
          total={floList?.length}
          showSizeChanger
          showQuickJumper
          current={currentPage}
          pageSize={pageSize}
          showTotal={(total) => `Total ${total} page`}
          onChange={handlePaging}
        ></Pagination>
      </div>
    </>
  );
}

export default FloTable;
