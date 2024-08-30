import React from 'react';
import scheduleImage from './schedule.png';
import "./schedule.css"

function Schedule () {
  return (
    <div className="container">
        <div className='container-title'>今月のオープン日</div>
        <img className="schedule" src={scheduleImage} alt="Eurekaのオープン日スケジュール"/>
    </div>
  );
};

export default Schedule;