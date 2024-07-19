import React, { Component } from 'react';
import { Table, Button, Space, Collapse, Card } from 'antd';
import axios from "axios";

const { Panel } = Collapse;

class UserManagement extends Component {
    state = {
        devices:[],
        personnelData: [
            // 示例数据
            {
                name: '葛煜',
                id: '001',
                identity: '点检员',
                lastTime: 'Mon Jul 08 10:46:39 CST 2024',
            },
            {
                name: '兰浩中',
                id: '002',
                identity: '点检员',
                lastTime: 'Mon Jul 08 10:46:39 CST 2024',
            },
            {
                name: '万宇明',
                id: '003',
                identity: '巡检员',
                lastTime: 'Mon Jul 08 10:46:39 CST 2024',
            },
            {
                name: '曾宇欣',
                id: '004',
                identity: '管理员',
                lastTime: 'Mon Jul 08 10:46:39 CST 2024',
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


        const personnelColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '人员编号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '身份',
                dataIndex: 'identity',
                key: 'identity',
            },
            {
                title: '上次登录时间',
                dataIndex: 'lastTime',
                key: 'lastTime',
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

                <Card title="人员配置" style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => this.handleAdd('personnel')}>新增</Button>
                    <Table columns={personnelColumns} dataSource={personnelData} style={{ marginTop: 10 }} />
                </Card>
            </div>
        );
    }
}

export default UserManagement;
