import React from 'react'
import { Bar } from '@ant-design/plots';

function BarChart({ equList }) {
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
  const sortByTotalPriceDesc = (list) => {
    return list.sort((a, b) => b.TotalPrice - a.TotalPrice);
  };

  const sortedList = sortByTotalPriceDesc(transformedList);

  const config = {
    data: sortedList,
    title: "Total value of each equip",
    xField: 'Name',
    yField: 'TotalPrice',
    // colorField: 'type',
    interaction: {
      elementSelect: true,
    },
    state: {
      unselected: { opacity: 0.5 },
      selected: { lineWidth: 3, stroke: 'red' },
    },
    scale: {
      color: {
        palette: 'spectral',
        // offset: (t) => t * 0.8 + 0.1,
      },
    },
    // label: {
    //   text: (d) => `${d.TotalPrice}`,
    //   textBaseline: 'right',
    // },
  };

  return (
    <>
      <Bar {...config} />
    </>
  )
}

export default BarChart