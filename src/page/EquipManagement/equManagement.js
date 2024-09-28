import { CaretDownOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Space, Tag } from 'antd'
import Search from 'antd/es/transfer/search'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { realtimeDB } from "../../firebase";
import { onValue, ref } from 'firebase/database';
import { setPageTitle } from "../../redux/page/pageSlice";
import { Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import EquTable from './equTable';
import EquModal from './equModal';

function Equ() {
    const locations = useSelector(
        (state) => state.location?.location?.allLocation
    );
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isAddModal, setIsAddModal] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sortType, setSortType] = useState("");
    const [filterType, setFilterType] = useState({ type: null, value: "", name: "" });
    const [locationFilterMenu, setLocationFilterMenu] = useState([]);
    const [isOpenStatusFilter, setIsOpenStatusFilter] = useState(false);
    const [isOpenLocationFilter, setIsOpenLocationFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sessionStorage.getItem("admin")) {
            navigate("/auth");
            return;
        }
        dispatch(setPageTitle("Equip Management"));
        getLocation();
    }, []);

    const getLocation = () => {
        if (!locations) {
            const locationRef = ref(realtimeDB, "location");
            onValue(
                locationRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const locationList = snapshot.val();
                        setLocationFilterMenu(locationList);
                        // dispatch(getLocations(locationList));
                    }
                },
                {
                    onlyOnce: true,
                }
            );
            return;
        }
        return setLocationFilterMenu(locations);
    };

    const itemsSort = [
        {
            label: "Name", key: "1",
            children: [
                { label: "A to Z", key: "aToZ", },
                { label: "Z to A", key: "zToA", },
            ],
        },
        // { label: "Location", key: "2", },
        {
            label: "GPA", key: "3",
            children: [
                { label: "Ascending", key: "low2High", },
                { label: "Descending", key: "high2Low", },
            ],
        },
    ];

    const locationMenuList = (location) => (
        <MenuItem
            key={location.id}
            onClick={(e) => handleFilter("location", e.target.value, location.locationName)}
            value={location.id}
        >
            {location.locationName}
        </MenuItem>
    );
    const locationMap = locationFilterMenu.map(locationMenuList);

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

                    {/* <Menu allowHover>
                        <MenuHandler>
                            <Button size="large" className="bg-purple">
                                Filter
                                <FilterOutlined></FilterOutlined>
                            </Button>
                        </MenuHandler>
                        <MenuList>
                            <Menu
                                placement="right-start"
                                allowHover
                                open={isOpenLocationFilter}
                                handler={setIsOpenLocationFilter}
                                offset={15}>
                                <MenuHandler className="flex items-center justify-between">
                                    <MenuItem>
                                        Location
                                        <CaretDownOutlined
                                            strokeWidth={2.5}
                                            className={`h-3.5 w-3.5 transition-transform ${isOpenLocationFilter ? "-rotate-90" : ""
                                                }`} />
                                    </MenuItem>
                                </MenuHandler>
                                <MenuList className="max-h-72">{locationMap}</MenuList>
                            </Menu>
                            <Menu
                                placement="right-start"
                                open={isOpenStatusFilter}
                                handler={setIsOpenStatusFilter}
                                allowHover
                                offset={15}
                            >
                                <MenuHandler className="flex items-center justify-between">
                                    <MenuItem>
                                        Status
                                        <CaretDownOutlined
                                            strokeWidth={2.5}
                                            className={`h-3.5 w-3.5 transition-transform ${isOpenStatusFilter ? "-rotate-90" : ""
                                                }`}
                                        />
                                    </MenuItem>
                                </MenuHandler>
                                <MenuList onClick={(e) => handleFilter("status", e.target.value, "")}>
                                    <MenuItem value={"approve"}>Approved</MenuItem>
                                    <MenuItem value={"requesting"}>Requesting</MenuItem>
                                    <MenuItem value={"rejected"}>Rejected</MenuItem>
                                </MenuList>
                            </Menu>
                        </MenuList>
                    </Menu> */}
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
