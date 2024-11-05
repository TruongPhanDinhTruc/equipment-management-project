import React from 'react'
import { Pie } from '@ant-design/plots';

function PieChart({ equList }) {
  const transformedList = Object.values(
    equList?.reduce((acc, item) => {
      const { equName, equPrice } = item;
      const price = parseFloat(equPrice);

      if (!acc[equName]) {
        acc[equName] = { Name: equName, Quantity: 0, TotalPrice: 0 };
      }

      acc[equName].Quantity += 1;
      acc[equName].TotalPrice += price;

      return acc;
    }, {})
  );

  console.log(transformedList);

  const config = {
    data: transformedList,
    title: "Number of equip with quantity",
    colorField: 'Name',
    angleField: 'Quantity',
    label: {
      text: 'Quantity',
      style: {
        fontWeight: "bold",
      },
      position: 'outside',
    },
    legend: {
      color: {
        title: false,
        position: 'top',
        rowPadding: 5,
      },
    },
    scale: {
      color: {
        palette: 'spectral',
        // offset: (t) => t * 0.8 + 0.1,
      },
    },
  };
  return (
    <>
      <Pie {...config} />
    </>
  )
}

export default PieChart