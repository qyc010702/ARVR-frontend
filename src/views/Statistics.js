import React from 'react';
import { Layout, Card, Table } from 'antd';
import * as echarts from 'echarts';
import ChecklistPage from './serviceData';
import axios from 'axios';

const { Content } = Layout;

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        const states = ['未检查', '正常运行', '异常（外观）', '异常（运行）', '停止运行','异常（泄漏）'];
        const colors = {
            '未检查': '#e0e0e0',
            '正常运行': '#66BB6A',
            '异常（运行）': '#EF5350',
            '异常（泄漏）': '#EF5350',
            '异常（外观）': '#EF5350',
            '停止运行': '#EF5350',
        };

        const initialRegions = [
            // 罐区的三个区域
            { id: 1, x: 50, y: 50, width: 100, height: 100, state: '正常运行', name: '储液罐w1' },
            { id: 2, x: 50, y: 150, width: 100, height: 100, state: '待检查', name: '储液罐w2' },
            { id: 3, x: 50, y: 250, width: 100, height: 100, state: '正常运行', name: '储液罐w3' },
            { id: 4, x: 150, y: 50, width: 100, height: 100, state: '正常运行', name: '储液罐b1' },
            { id: 5, x: 150, y: 150, width: 100, height: 100, state: '待检查', name: '储液罐b2' },
            { id: 6, x: 150, y: 250, width: 100, height: 100, state: '正常运行', name: '储液罐b3' },
            // 厂房的四个区域
            { id: 7, x: 300, y: 50, width: 200, height: 150, state: '正常运行', name: '厂房1' },
            { id: 8, x: 500, y: 50, width: 150, height: 150, state: '正常运行', name: '厂房2' },
            { id: 9, x: 300, y: 200, width: 150, height: 150, state: '正常运行', name: '厂房3' },
            { id: 10, x: 450, y: 200, width: 200, height: 150, state: '正常运行', name: '厂房4' },
            // 车间的两个区域，左右划分并扩大30%
            // { id: 11, x: 100, y: 450, width: 200, height: 100, state: '正常运行', name: '车间1' },
            // { id: 12, x: 300, y: 450, width: 300, height: 100, state: '正常运行', name: '车间2' },
        ];

        this.state = {
            regions: initialRegions,
            states,
            colors,
        };
    }

    handleRegionClick = (id) => {
        this.setState((prevState) => ({
            regions: prevState.regions.map((region) => {
                if (region.id === id) {
                    const nextStateIndex = (prevState.states.indexOf(region.state) + 1) % prevState.states.length;
                    return { ...region, state: prevState.states[nextStateIndex] };
                }
                return region;
            }),
        }));
    };

    componentDidMount() {
        // Fetch data from the backend
        axios.get('http://localhost:8081/equipment/allEquipments')
            .then((response) => {
                const equipments = response.data;
                this.updateRegions(equipments);
                this.initChart();
            })
            .catch((error) => {
                console.error('There was an error fetching the data!', error);
            });
    }

    componentDidUpdate() {
        this.initChart();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    updateRegions = (equipments) => {
        this.setState((prevState) => {
            const updatedRegions = prevState.regions.map((region) => {
                const equipment = equipments.find(e => e.name === region.name);
                if (equipment) {
                    return { ...region, state: equipment.status };
                }
                return region;
            });
            return { regions: updatedRegions };
        });
    };

    initChart = () => {
        const chartDom = document.getElementById('pieChart');
        this.chart = echarts.init(chartDom);

        const stateCounts = this.state.states.map((state) => ({
            value: this.state.regions.filter((region) => region.state === state).length,
            name: state,
        }));

        const option = {
            title: {
                text: '状态统计',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
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
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
            color: Object.values(this.state.colors),
        };

        this.chart.setOption(option);
    };

    render() {
        const { regions, colors } = this.state;

        // 表格的列定义
        const columns = [
            {
                title: '区域名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
            },
        ];

        return (
            <Layout style={{ height: '100vh' }}>
                <Content style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Card title="点检列表" style={{ flex: 3 }}>
                            <ChecklistPage></ChecklistPage>
                        </Card>
                        <Card title="状态统计" style={{ flex: 2 }}>
                            <div id="pieChart" style={{ width: '100%', height: 600 }}></div>
                        </Card>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default Statistics;
