import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { realtimeDB } from '../../firebase';
import { getAllLoc } from '../../redux/loc/locSlice';
import { Modal, Pagination, Table } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';

function LocTable({ form, setIsAddModal, setIsOpenModal, searchText, sortType, filterType, currentPage, setCurrentPage }) {
  const [locList, setLocList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllLocFormDb();
  }, []);

  const getAllLocFormDb = () => {
    const supRef = ref(realtimeDB, "loc");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const locList = await snapshot.val();
        setLocList(Object.values(locList));
        dispatch(getAllLoc(locList));
      }
    });
  };

  const confirmDelete = (record, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this location?",
      onOk() {
        const locRef = ref(realtimeDB, `loc/${record.id}`);
        const deleteLoc = remove(locRef);

        Promise.all([deleteLoc])
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
  const locListSlice = locList.slice(startIndex, endIndex);

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
      // render: (equManufactureDate) => <span>{new Date(equManufactureDate)?.toLocaleDateString()}</span>,
    },
    {
      title: "Area",
      dataIndex: "locArea",
      key: "locArea",
      // render: (equExpiryDate) => <span>{new Date(equExpiryDate)?.toLocaleDateString()}</span>,
    },
    {
      title: "Description",
      dataIndex: "locDescription",
      key: "locDescription",
      // render: (equPrice) => <span>{equPrice} VND</span>
    },
    {
      title: "Action",
      dataIndex: "equStatus",
      key: "action",
      // className: "max-w-12",
      width: "7%",
      render: (equStatus, record) => (
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
        dataSource={locListSlice}
        // rowClassName={rowClassName}
        scroll={{
          y: 470,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              handleRowClick(record);
            }, // click row
          };
        }}
      />
      <div className="flex justify-center">
        <Pagination
          total={locList?.length}
          showSizeChanger
          showQuickJumper
          current={currentPage}
          pageSize={pageSize}
          showTotal={(total) => `Total ${total} equips`}
          onChange={handlePaging}
        ></Pagination>
      </div>
    </>
  )
}

export default LocTable