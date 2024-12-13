import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Card, List, Modal, Progress, Space, Tag } from 'antd'
import React, { useState } from 'react'
import MaintModal from '../MaintenanceManagement/maintModal';

function CalendarModal({ isOpenModal, setIsOpenModal, selectedDateInfo, getEquById, form, flo, loc }) {
  const [isOpenMaintModal, setIsOpenMaintModal] = useState(false);

  const handleCancel = (e) => {
    setIsOpenModal(false);
  };

  const handleCardClick = (data) => {
    form.setFieldsValue(data);
    setIsOpenMaintModal(true);
  };

  const calculateDaysLeft = (maintenanceDate) => {
    if (!maintenanceDate) return null; // Nếu không có ngày, trả về null

    const today = new Date();
    const maintDate = new Date(maintenanceDate);
    // Tính khoảng cách thời gian giữa hai ngày (ms)
    const timeDiff = maintDate - today;
    // Chuyển từ ms sang ngày
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft > 0 ? daysLeft : 0;
  };

  const getColor = (daysLeft) => {
    if (daysLeft < 3) return 'red';
    if (daysLeft > 7) return 'green';
    return 'gold';
  };

  const checkMaintDate = (value) => {
    if (value > 0)
      return "Maintenance remaining: " + value + " days";
    return "Maintenance date has come"
  }

  const convertMaintLocToString = (maintLoc, loc, flo) => {
    if (!Array.isArray(maintLoc))
      return maintLoc;

    const maintLocId = maintLoc[0];

    const location = loc.find((location) => location.id === maintLocId);
    const floor = location ? flo.find((floor) => floor.id === location.locFloorId) : null;

    if (maintLoc.length === 1 && floor)
      return `Floor ${floor.floNumber}`;
    if (location && floor)
      return `Floor ${floor.floNumber} / ${location.locName}`;
    if (floor)
      return `Floor ${floor.floNumber}`;
    return "Not found location";
  };
  
  return (
    <>
      <Modal
        width={800}
        centered
        open={isOpenModal}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            {/* <Button loading={isLoading} htmlType="submit" form="maint_form" className="bg-orange text-white">Save</Button> */}
          </>
        )}
      >
        <h1 className="text-3xl font-bold mb-4 text-orange text-center">EQUIP MAINTENANCE</h1>
        <List
          dataSource={selectedDateInfo}
          // loading={isLoading}
          renderItem={(item) => (
            <Card
              key={item.id}
              style={{ marginBottom: '16px', marginTop: '16px', borderRadius: '8px' }}
              hoverable
              onClick={() => handleCardClick(item)}>
              <List.Item>
                <Space style={{ width: '100%' }} direction="vertical">
                  <Space align="center">
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {getEquById(item.id)?.equName} #{item?.id}
                    </span>
                    {/* <SettingOutlined /> */}
                    {getEquById(item.id)?.equStatus === 1 ? (
                      <Tag color="green">Activating</Tag>
                    ) : getEquById(item.id)?.equStatus === 2 ? (
                      <Tag color="yellow">Under repair</Tag>
                    ) : getEquById(item.id)?.equStatus === 3 ? (
                      <Tag color="red">Defective</Tag>
                    ) : (
                      <Tag color="gray">Unknown</Tag>
                    )}
                    <CalendarOutlined />
                    <span>{new Date(item.maintDate)?.toLocaleDateString()}</span>
                    <Space>
                      <EnvironmentOutlined />
                      <span>{convertMaintLocToString(item.maintLoc, loc, flo)}</span>
                    </Space>
                  </Space>
                  <div>
                    <span style={{ color: getColor(calculateDaysLeft(item.maintDate)), fontWeight: 500 }}>{checkMaintDate(calculateDaysLeft(item.maintDate))}</span>
                    <Progress
                      // style={{direction: "rtl"}} 
                      percent={calculateDaysLeft(item.maintDate)}
                      showInfo={false} />
                    {/* <span style={{ float: 'right', color: '#1890ff' }}>{item.progress}%</span> */}
                  </div>
                </Space>
              </List.Item>
            </Card>
          )}
        />
      </Modal>

      {isOpenMaintModal && (
        <MaintModal
          form={form}
          flo={flo}
          loc={loc}
          isOpenModal={isOpenMaintModal}
          setIsOpenModal={setIsOpenMaintModal} />
      )}
    </>
  )
}

export default CalendarModal