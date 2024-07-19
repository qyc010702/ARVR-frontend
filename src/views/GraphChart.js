import React from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import { Layout, Card, Table } from 'antd';
import img from "../pic/img.png"
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
            { id: 7, x: 100, y: 350, width: 100, height: 100, state: '正常运行', name: '管道g1' },
            // 厂房的四个区域
            { id: 8, x: 300, y: 50, width: 200, height: 150, state: '正常运行', name: '厂房1' },
            { id: 9, x: 500, y: 50, width: 150, height: 150, state: '正常运行', name: '厂房2' },
            { id: 10, x: 300, y: 200, width: 150, height: 150, state: '正常运行', name: '厂房3' },
            { id: 11, x: 450, y: 200, width: 200, height: 150, state: '正常运行', name: '厂房4' },
            // 车间的两个区域，左右划分并扩大30%
            // { id: 12, x: 100, y: 450, width: 200, height: 100, state: '正常运行', name: '车间1' },
            // { id: 13, x: 300, y: 450, width: 300, height: 100, state: '正常运行', name: '车间2' },
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
        //this.initChart();
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
                        <Card title="地图" style={{ flex: 3 }}>
                            <Stage width={700} height={600}>
                                <Layer>
                                    {/* 绘制地图背景 */}
                                    <Rect width={800} height={600} fill="#f5f5f5" />
                                    <Text text="罐区" x={50} y={30} fill="#666" />
                                    <Text text="厂房" x={300} y={30} fill="#666" />
                                    {/*<Text text="车间" x={100} y={430} fill="#666" />*/}

                                    {/* 绘制罐区中的罐子 */}
                                    <Rect x={50} y={50} width={200} height={300} fill="#ffcc80" />
                                    <Circle x={100} y={100} radius={40} fill="#ffffff" />
                                    <Circle x={200} y={100} radius={40} fill="#ffffff" />
                                    <Circle x={100} y={200} radius={40} fill="#ffffff" />
                                    <Circle x={200} y={200} radius={40} fill="#ffffff" />
                                    <Circle x={100} y={300} radius={40} fill="#ffffff" />
                                    <Circle x={200} y={300} radius={40} fill="#ffffff" />

                                    {/* 绘制区域 */}
                                    {regions.map((region) => (
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
                                                onClick={() => this.handleRegionClick(region.id)}
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
                        <Card
                            title="3D场景"
                            style={{ flex: 2 }}
                            cover={<img alt="3D Scene" src={img} style={{ width: '90%', height: '550px', marginLeft: '25px' }}/>}
                        >
                            {/* 这里可以添加其他内容 */}
                        </Card>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default Statistics;
