import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import {Layout, Card, Table} from 'antd';
import * as echarts from 'echarts';
import ChecklistPage from "./serviceData";

const { Content } = Layout;

const GraphChart = () => {
    const states = ['检查中', '待检查', '完成', '出错'];
    const colors = {
        '检查中': '#FFA726',
        '待检查': '#e0e0e0',
        '完成': '#66BB6A',
        '出错': '#EF5350'
    };

    const initialRegions = [
        // 罐区的三个区域
        { id: 1, x: 50, y: 50, width: 200, height: 100, state: '完成', name: '罐区1' },
        { id: 2, x: 50, y: 150, width: 200, height: 100, state: '待检查', name: '罐区2' },
        { id: 3, x: 50, y: 250, width: 200, height: 100, state: '完成', name: '罐区3' },
        // 厂房的四个区域
        { id: 4, x: 300, y: 50, width: 200, height: 150, state: '检查中', name: '厂房1' },
        { id: 5, x: 500, y: 50, width: 150, height: 150, state: '完成', name: '厂房2' },
        { id: 6, x: 300, y: 200, width: 150, height: 150, state: '完成', name: '厂房3' },
        { id: 7, x: 450, y: 200, width: 200, height: 150, state: '出错', name: '厂房4' },
        // 车间的两个区域，左右划分并扩大30%
        { id: 8, x: 100, y: 450, width: 200, height: 100, state: '完成', name: '车间1' },
        { id: 9, x: 300, y: 450, width: 300, height: 100, state: '待检查', name: '车间2' }
    ];

    const [regions, setRegions] = useState(initialRegions);

    // 表格的列定义
    const columns = [
        {
            title: '区域名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state'
        }
    ];

    const handleRegionClick = (id) => {
        setRegions(regions.map(region => {
            if (region.id === id) {
                const nextStateIndex = (states.indexOf(region.state) + 1) % states.length;
                return { ...region, state: states[nextStateIndex] };
            }
            return region;
        }));
    };

    useEffect(() => {
        // Initialize ECharts
        const chartDom = document.getElementById('pieChart');
        const myChart = echarts.init(chartDom);

        const stateCounts = states.map(state => ({
            value: regions.filter(region => region.state === state).length,
            name: state
        }));

        const option = {
            title: {
                text: '状态统计',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '状态',
                    type: 'pie',
                    radius: '50%',
                    data: stateCounts,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color: Object.values(colors)
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [regions]);

    return (
        <Layout style={{ height: '100vh' }}>
            <Content style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <Card title="地图" style={{ flex: 3 }}>
                        <Stage width={700} height={600}>
                            <Layer>
                                {/* 绘制地图背景 */}
                                <Rect width={800} height={600} fill="#f5f5f5" />
                                <Text text="罐区" x={50} y={30} fill="#666" />
                                <Text text="厂房" x={300} y={30} fill="#666" />
                                <Text text="车间" x={100} y={430} fill="#666" />

                                {/* 绘制罐区中的罐子 */}
                                <Rect x={50} y={50} width={200} height={300} fill="#ffcc80" />
                                <Circle x={100} y={100} radius={40} fill="#ffffff" />
                                <Circle x={200} y={100} radius={40} fill="#ffffff" />
                                <Circle x={100} y={200} radius={40} fill="#ffffff" />
                                <Circle x={200} y={200} radius={40} fill="#ffffff" />
                                <Circle x={100} y={300} radius={40} fill="#ffffff" />
                                <Circle x={200} y={300} radius={40} fill="#ffffff" />

                                {/* 绘制区域 */}
                                {regions.map(region => (
                                    <React.Fragment key={region.id}>
                                        <Rect
                                            x={region.x}
                                            y={region.y}
                                            width={region.width}
                                            height={region.height}
                                            fill={colors[region.state]}
                                            opacity={0.7}
                                            stroke="#000"
                                            strokeWidth={1}
                                            dash={[5, 5]} // 设置虚线
                                            onClick={() => handleRegionClick(region.id)}
                                        />
                                        <Text
                                            text={`${region.name} (${region.state})`}
                                            x={region.x + 10}
                                            y={region.y + 10}
                                            fill="#000"
                                        />
                                    </React.Fragment>
                                ))}
                            </Layer>
                        </Stage>
                    </Card>
                    <Card title="状态统计" style={{ flex: 2 }}>
                        <div id="pieChart" style={{ width: '100%', height: 600 }}></div>
                    </Card>
                </div>
                <Card title="点检列表" style={{ marginTop: '24px' }}>
                    <ChecklistPage></ChecklistPage>
                </Card>
            </Content>
        </Layout>
    );
};

export default GraphChart;
