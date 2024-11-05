import { DollarOutlined } from '@ant-design/icons'
import { Card, Col, Row, Tooltip } from 'antd'
import React from 'react'

function Cards({ equList, maintList }) {
  const calculateQuantityEqu = (equList) => {
    const total = Object.values(equList).length;
    const count = Object.values(equList)?.filter(equipment => equipment.equStatus === 1).length;
    const count2 = Object.values(equList)?.filter(equipment => equipment.equStatus === 2).length;
    const count3 = Object.values(equList)?.filter(equipment => equipment.equStatus === 3).length;
    // setQuantityData({ totalQuantity: total, activeStatus: count, underRepairStatus: count2, defectiveStatus: count3 });
    return { totalQuantity: total, activeStatus: count, underRepairStatus: count2, defectiveStatus: count3 };
  }

  const calculateCostEqu = (equList) => {
    const total1 = Object.values(equList)?.reduce((accumulator, equipment) => {
      const price = Number(equipment.equPrice) || 0;
      return accumulator + price;
    }, 0);
    return total1;
  }

  const quantity = calculateQuantityEqu(equList);
  const totalCost = calculateCostEqu(equList);

  const countMaint = Object.values(maintList)?.filter(maintenance => {
    const currentDate = Date.now();
    const maintDate = maintenance.maintDate;
    const isOverdue = maintDate && maintDate < currentDate;
    //  const isNearMaintenance = maintDate && maintDate - currentDate <= 30 * 24 * 60 * 60 * 1000; // 30 ngày
    return isOverdue;
  }).length;

  // console.log("Quantity count: ", totalCost);
  // console.log("Maint count: ", countMaint);

  const formatTotalCost = (price) => {
    return price >= 1000000
      ? `${(price / 1000000).toFixed(1)}tr VND`
      : `${price.toLocaleString()} VND`;
  };
  return (
    <>
      <Row className="mt-4 flex justify-around p-1">
        <Col xs={24} sm={24} md={11} lg={7} xl={7} className="mb-4 flex">
          <Card className="card bg-white text-black shadow-lg rounded-lg flex flex-col flex-grow"
            title={
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Total Equipments
              </div>
            }>
            <div className="text-center">
              <div className="mb-2">
                <Tooltip>
                  <div className="text-4xl dm:text-5xl font-bold mt-2">
                    {quantity.totalQuantity}
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="mt-4 p-2 flex-grow">
              <Row justify="center" className="justify-around">
                <Col className="text-center" xs={6} sm={6} md={11} lg={7} xl={7}>
                  <Tooltip>
                    <div className="text-3xl font-bold text-green-600">
                      {quantity.activeStatus}
                    </div>
                  </Tooltip>
                  <div className="text-gray-600">Activating</div>
                </Col>
                <Col className="text-center" xs={7} sm={7} md={11} lg={7} xl={7}>
                  <Tooltip>
                    <div className="text-3xl font-bold text-orange">
                      {quantity.underRepairStatus}
                    </div>
                  </Tooltip>
                  <div className="text-gray-600">Under repair</div>
                </Col>
                <Col className="text-center" xs={7} sm={7} md={11} lg={7} xl={7}>
                  <Tooltip>
                    <div className="text-3xl font-bold text-red-600">
                      {quantity.defectiveStatus}
                    </div>
                  </Tooltip>
                  <div className="text-gray-600">Defective</div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={11} lg={7} xl={7} className="mb-4 flex">
          <Card className="card bg-white text-black shadow-lg rounded-lg flex flex-col flex-grow"
            title={
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Total Price
              </div>
            }>
            <div className="text-center">
              <div className="mb-2">
                <Tooltip>
                  <div className="text-4xl dm:text-5xl font-bold mt-2">
                    {formatTotalCost(totalCost)}
                    <DollarOutlined className='ml-2' />
                  </div>
                </Tooltip>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={11} lg={7} xl={7} className="mb-4 flex">
          <Card className="card bg-white text-black shadow-lg rounded-lg flex flex-col flex-grow"
            title={
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Total Maintenance
              </div>
            }>
            <div className="text-center">
              <div className="mb-2">
                <Tooltip
                  title="Number of equipment requiring maintenance."
                  color="rgba(255, 99, 132, 0.9)"
                  overlayInnerStyle={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}>
                  <div className="text-4xl dm:text-5xl font-bold mt-2">
                    {countMaint} Equips
                  </div>
                </Tooltip>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Cards