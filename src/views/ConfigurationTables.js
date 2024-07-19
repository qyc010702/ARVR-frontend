import React, { Component } from 'react';
import { Table, Button, Space, Collapse, Card } from 'antd';
import axios from "axios";

const { Panel } = Collapse;

class ConfigurationTables extends Component {
    state = {
        devices:[],
        areas: {
            tankArea: [],
            plant: [],
            workshop: [],
        },
        personnelData: [
            // 示例数据
            {
                key: '1',
                device: '设备1',
                deviceNumber: '001',
                inspectionPersonnel: '人员A',
                patrolPersonnel: '人员B',
                supervisor: '负责人C',
            },
        ],
    };

    componentDidMount() {
        this.fetchModels()
        // 在组件挂载后，添加按钮点击事件
    }

    fetchModels=()=>{
        axios.get('http://localhost:8081/equipment/allEquipments')
            .then(response => {
                console.log(response.data)
                this.setState({
                    devices: response.data
                });
                let tankArea=[]
                let plant=[]
                let workshop=[]
                this.state.devices.map((d)=>{
                    if(d.location==="罐区"){
                        d.dailyInspectionCount=2
                        d.safetyLevel="高"
                        tankArea.push(d)
                    }
                    if(d.location==="车间"){
                        d.dailyInspectionCount=2
                        d.safetyLevel="高"
                        plant.push(d)
                    }
                    if(d.location==="厂房"){
                        d.dailyInspectionCount=2
                        d.safetyLevel="高"
                        workshop.push(d)
                    }
                })
                const newArea={
                    tankArea: tankArea,
                    plant: plant,
                    workshop: workshop,
                }
                this.setState({
                    areas: newArea
                });
            })
    }


    handleAdd = (type) => {
        console.log(`Add new ${type}`);
        // 在这里处理新增逻辑
    };

    handleEdit = (record) => {
        console.log('Edit record:', record);
        // 在这里处理编辑逻辑
    };

    handleDelete = (record) => {
        console.log('Delete record:', record);
        // 在这里处理删除逻辑
    };

    render() {
        const { areas, personnelData } = this.state;

        const columns = [
            {
                title: '设备',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '设备编号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '每日检查次数',
                dataIndex: 'dailyInspectionCount',
                key: 'dailyInspectionCount',
            },
            {
                title: '安全级别',
                dataIndex: 'safetyLevel',
                key: 'safetyLevel',
            },
            {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                    <Space size="middle">
                        <Button onClick={() => this.handleEdit(record)}>修改</Button>
                        <Button onClick={() => this.handleDelete(record)}>删除</Button>
                    </Space>
                ),
            },
        ];

        const personnelColumns = [
            {
                title: '设备',
                dataIndex: 'device',
                key: 'device',
            },
            {
                title: '设备编号',
                dataIndex: 'deviceNumber',
                key: 'deviceNumber',
            },
            {
                title: '点检人员',
                dataIndex: 'inspectionPersonnel',
                key: 'inspectionPersonnel',
            },
            {
                title: '巡检人员',
                dataIndex: 'patrolPersonnel',
                key: 'patrolPersonnel',
            },
            {
                title: '负责人',
                dataIndex: 'supervisor',
                key: 'supervisor',
            },
            {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                    <Space size="middle">
                        <Button onClick={() => this.handleEdit(record)}>修改</Button>
                        <Button onClick={() => this.handleDelete(record)}>删除</Button>
                    </Space>
                ),
            },
        ];

        return (
            <div style={{ padding: 20 }}>
                <Card title="区域配置" style={{ width: '100%' }}>
                    <Collapse defaultActiveKey={['1', '2', '3']}>
                        <Panel header="罐区" key="1">
                            <Table
                                columns={columns}
                                dataSource={areas.tankArea}
                                style={{ marginTop: 10 }}
                            />
                        </Panel>
                        <Panel header="厂房" key="2">
                            <Table
                                columns={columns}
                                dataSource={areas.plant}
                                style={{ marginTop: 10 }}
                            />
                        </Panel>
                        <Panel header="车间" key="3">
                            <Table
                                columns={columns}
                                dataSource={areas.workshop}
                                style={{ marginTop: 10 }}
                            />
                        </Panel>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

export default ConfigurationTables;
