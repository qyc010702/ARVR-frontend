import React from 'react';
import ReactEcharts from 'echarts-for-react';
import '../css/map.css'
const PieChart = ({ stats }) => {
    // 构造饼状图数据
    const pieChartData = [
        { name: 'Checked', value: stats.checked },
        { name: 'In Progress', value: stats.inProgress },
        { name: 'Unchecked', value: stats.unchecked },
        { name: 'Error', value: stats.error }
    ];

    // 饼状图配置项
    const option = {
        title: {
            text: 'Region Status'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['Checked', 'In Progress', 'Unchecked', 'Error']
        },
        series: [
            {
                name: 'Region Status',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieChartData
            }
        ]
    };

    return (
        <div className="pie-chart-container">
            <ReactEcharts option={option} style={{ height: '400px' }} />
        </div>
    );
}

export default PieChart;
