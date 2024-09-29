import { CheckOutlined, CloseOutlined, DeleteFilled } from "@ant-design/icons";
import { Pagination, Space, Switch, Table, Tag, Modal, } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { realtimeDB } from "../../firebase";
import { onValue, ref, remove, update } from "firebase/database";
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
        return record.stdStatus === "2"
            ? "text-gray-400 even:bg-gray-100"
            : "even:bg-gray-100";
    };

    const sortList = (stdList, order) => {
        return [...stdList].sort((a, b) => {
            if (order === "low2High") return a.stdGPA - b.stdGPA;
            if (order === "high2Low") return b.stdGPA - a.stdGPA;
            if (order === "aToZ") return a.equName.localeCompare(b.equName);
            if (order === "zToA") return b.equName.localeCompare(a.equName);
            return 0;
        });
    };

    const filterByStatus = (stdList, status) => {
        if (status.type !== "status")
            return stdList;
        switch (status.value) {
            case "approve":
                return stdList.filter((std) => std.stdStatus === "1");
            case "requesting":
                return stdList.filter((std) => std.stdStatus === "3");
            case "rejected":
                return stdList.filter((std) => std.stdStatus === "2");
            default:
                return stdList;
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
    const stdListSlice = equSortList.slice(startIndex, endIndex);
    // console.log("Student List: ", stdListFromRedux);
    // console.log("Student List search: ", stdSearchList);
    // console.log("Student List location: ", stdFilterLocation);
    // console.log("Student List status: ", stdFilterList);
    // console.log("Student List sort: ", stdSortList);

    const confirmSwitchStatus = (record, newStdStatus, newUserStatus, event) => {
        event.stopPropagation();
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to change the status?",
            onOk() {
                const recordRef = ref(realtimeDB, `std/${record.id}`);
                update(recordRef, {
                    stdStatus: newStdStatus,
                    userStatus: newUserStatus,
                });
                getAllEquFormDb();
                toast.success("Change students status success.");

            },
        });
    };

    const confirmDelete = (record, event) => {
        event.stopPropagation();
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to delete this student?",
            onOk() {
                const recordRef = ref(realtimeDB, `std/${record.id}`);
                remove(recordRef);
                getAllEquFormDb();
                toast.success("Remove student success.");
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
            title: "Quantily",
            dataIndex: "equQuantily",
            key: "equQuantily",
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
        },
    ];
    return (
        <>
            <Table
                className="py-4"
                pagination={false}
                columns={columns}
                dataSource={stdListSlice}
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
