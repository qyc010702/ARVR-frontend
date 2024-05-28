import React from 'react';
import ReactECharts from 'echarts-for-react';

const PieChart = ({ data }) => {
    // 统计各个状态的数量
    const statusCount = data.reduce((acc, area) => {
        acc[area.status] = (acc[area.status] || 0) + 1;
        return acc;
    }, {});

    // 构造 ECharts 饼状图数据
    const pieData = Object.entries(statusCount).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    // 饼状图配置项
    const option = {
        title: {
            text: '区域状态统计',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: Object.keys(statusCount),
        },
        series: [
            {
                name: '状态',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: pieData,
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default PieChart;
