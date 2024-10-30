import { DeleteFilled } from "@ant-design/icons";
import { Pagination, Table, Tag, Modal, } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { realtimeDB } from "../../firebase";
import { onValue, ref, remove } from "firebase/database";
import { toast } from "react-toastify";
import { getAllEqu } from "../../redux/equip/equSlice";

function EquTable({ form, setIsAddModal, setIsOpenModal, searchText, sortType, filterType, currentPage, setCurrentPage }) {
  const [equList, setEquList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllEquFormDb();
  }, []);

  const getAllEquFormDb = () => {
    const supRef = ref(realtimeDB, "equ");
    onValue(supRef, async (snapshot) => {
      if (snapshot.exists()) {
        const equList = await snapshot.val();
        setEquList(equList);
        dispatch(getAllEqu(equList));
      }
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
  const rowClassName = (record) => {
    return record.equStatus === 3
      ? "text-gray-400 even:bg-gray-100"
      : "even:bg-gray-100";
  };

  const sortList = (stdList, order) => {
    return [...stdList].sort((a, b) => {
      if (order === "aToZ") return a.equName.localeCompare(b.equName);
      if (order === "zToA") return b.equName.localeCompare(a.equName);
      return 0;
    });
  };

  const filterByStatus = (equList, status) => {
    if (status.type !== "status")
      return equList;
    switch (status.value) {
      case "Activating":
        return equList.filter((equ) => equ.equStatus === 1);
      case "Defective":
        return equList.filter((equ) => equ.equStatus === 3);
      case "Under Repair":
        return equList.filter((equ) => equ.equStatus === 2);
      default:
        return equList;
    }
  };

  const filterByLocation = (stdList, locationFilter) => {
    if (locationFilter.type !== "location")
      return stdList;
    return stdList = stdList.filter((std) => std.stdHighSchoolLocation === String(locationFilter.value))
  };

  const equSearchList = equList.filter(
    (equ) =>
      equ.equName?.toLowerCase().includes(searchText?.toLowerCase())
  );
  const equFilterLocation = filterByLocation(equSearchList, filterType);
  const equFilterList = filterByStatus(equFilterLocation, filterType);
  const equSortList = sortList(equFilterList, sortType);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const equListSlice = equSortList.slice(startIndex, endIndex);
  // console.log("Student List: ", stdListFromRedux);
  // console.log("Student List search: ", stdSearchList);
  // console.log("Student List location: ", stdFilterLocation);
  // console.log("Student List status: ", stdFilterList);
  // console.log("Student List sort: ", stdSortList);

  const confirmDelete = (record, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this equip?",
      onOk() {
        const equRef = ref(realtimeDB, `equ/${record.id}`);
        const maintRef = ref(realtimeDB, `maint/${record.id}`);
        const deleteEqu = remove(equRef);
        const deleteMaint = remove(maintRef);

        Promise.all([deleteEqu, deleteMaint])
          .then(() => {
            toast.success("Remove equip successfully.");
          })
          .catch((err) => {
            toast.error("Error removing data: " + err);
          });
      },
    });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "equName",
      key: "equName",
    },
    {
      title: "Manufacture Date",
      dataIndex: "equManufactureDate",
      key: "equManufactureDate",
      render: (equManufactureDate) => <span>{new Date(equManufactureDate)?.toLocaleDateString()}</span>,
    },
    {
      title: "Price",
      dataIndex: "equPrice",
      key: "equPrice",
      render: (equPrice) => <span>{equPrice} VND</span>
    },
    {
      title: "Expiry Date",
      dataIndex: "equExpiryDate",
      key: "equExpiryDate",
      render: (equExpiryDate) => <span>{new Date(equExpiryDate)?.toLocaleDateString()}</span>,
    },
    {
      title: "Manufacturer",
      dataIndex: "equManufacturer",
      key: "equManufacturer",
    },
    {
      title: "Status",
      dataIndex: "equStatus",
      key: "equStatus",
      render: (equStatus, record) => (
        <span>
          {equStatus === 1 ? (
            <Tag color="green">Activating</Tag>
          ) : equStatus === 2 ? (
            <Tag color="yellow">Under repair</Tag>
          ) : equStatus === 3 ? (
            <Tag color="red">Defective</Tag>
          ) : (
            <Tag color="gray">Unknown</Tag>
          )}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "equStatus",
      key: "action",
      // className: "max-w-12",
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
        dataSource={equListSlice}
        rowClassName={rowClassName}
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
          total={equSortList?.length}
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

export default EquTable;
