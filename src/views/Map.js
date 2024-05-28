import React from 'react';

const Map = ({ regionStatus, updateRegionStatus }) => {
    // 地图点击事件处理函数
    const handleRegionClick = (id, status) => {
        const newStatus = getNextStatus(status);
        updateRegionStatus(id, newStatus);
    };

    // 获取下一个状态
    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'unchecked':
                return 'inProgress';
            case 'inProgress':
                return 'checked';
            case 'checked':
                return 'error';
            case 'error':
                return 'unchecked';
            default:
                return 'unchecked';
        }
    };

    return (
        <div className="map-container">
            <div className={`region region-1 ${regionStatus[0].status}`} onClick={() => handleRegionClick(1, regionStatus[0].status)}>Region 1</div>
            <div className={`region region-2 ${regionStatus[1].status}`} onClick={() => handleRegionClick(2, regionStatus[1].status)}>Region 2</div>
            <div className={`region region-3 ${regionStatus[2].status}`} onClick={() => handleRegionClick(3, regionStatus[2].status)}>Region 3</div>
        </div>
    );
}

export default Map;
