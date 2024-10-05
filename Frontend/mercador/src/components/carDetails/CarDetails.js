import React from 'react'

const CarDetails = ({carData}) => {
  console.log(carData);
  return (
    <div>
        <div>CarDetails</div>
        <div>{carData.vin}</div>
    </div>
  )
}

export default CarDetails