import React, { Component } from 'react';
import {Table, Button, Modal, Select, Row, Col, Input} from 'antd';
import axios from "axios";

const { Option } = Select;

class DeviceListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [
                { id: 1, name: '设备1', model: 'Pallet', entryDate: '2024-02-01', status: '正常', nextCheckDate: '2024-03-01' },
                { id: 2, name: '设备2', model: 'CarBoardBox', entryDate: '2024-02-05', status: '维修中', nextCheckDate: '2024-03-05' },
                { id: 3, name: '设备3', model: 'ContentPack', entryDate: '2024-02-10', status: '待检', nextCheckDate: '2024-03-10' },
            ],
            newEquipment:{
                name:"",
                model:"",
            },
            showModal: false,
            selectedDeviceId: null,
            models: [],
            equipmentVisible:false,
        };
    }


    componentDidMount() {
        this.fetchModels()
        // 在组件挂载后，添加按钮点击事件
    }

    fetchModels=()=>{
        axios.get('http://localhost:8081/equipment/allEquipments')
            .then(response => {
                this.setState({
                    devices: response.data.data,
                });
            })
        axios.get('http://localhost:8081/model/allModels')
            .then(response => {
                this.setState({
                    models: response.data.data,
                });
                console.log(response.data.data)
            })
    }

    handleAddDevice = () => {
        // 添加设备的逻辑
        this.setState({
            equipmentVisible:true,
        })
    };

    handleBindModel = () => {
        // 绑定模型的逻辑
        console.log('绑定模型', this.state.selectedDeviceId);
        this.setState({ showModal: false, selectedDeviceId: null });
    };

    handleSelectDevice = (deviceId) => {
        this.setState({ selectedDeviceId: deviceId });
    };

    handleCloseEquipment = () =>{
        this.setState({
            equipmentVisible:false,
        })
    }

    handleInputChange = (e, key) => {
        const { newEquipment } = this.state;
        this.setState({
            newEquipment: {
                ...newEquipment,
                [key]: e
            }
        });
    };

    handleAddEquipment = ()=>{
        axios.post('http://localhost:8081/equipment/create', this.state.newEquipment)
            .then(response => {
                this.setState({
                    newModel: {
                        id:'',
                        place:'',
                        time:'',
                        status:'',
                        person:''
                    },
                    modalVisible: false
                });
                this.fetchModels()
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: 'Failed to fetch models'
                });
            });
    }

    render() {
        const { devices, showModal, selectedDeviceId, models,equipmentVisible } = this.state;

        const columns = [
            { title: '设备名称', dataIndex: 'name', key: 'name' },
            { title: '模型', dataIndex: 'model', key: 'model' },
            { title: '入库日期', dataIndex: 'inTime', key: 'inTime' },
            { title: '状态', dataIndex: 'status', key: 'status' },
            { title: '下次检查日期', dataIndex: 'nextTime', key: 'nextTime' },
            {
                title: '操作',
                dataIndex: '',
                key: 'action',
                render: (text, record) => (
                    <Button onClick={() => this.setState({ showModal: true, selectedDeviceId: record.id })}>绑定</Button>
                ),
            },
        ];

        return (
            <div>
                <h1>设备列表</h1>
                <Button type="primary" style={{ marginBottom: 16 }} onClick={this.handleAddDevice}>新增设备</Button>
                <Table dataSource={devices} columns={columns} />

                <Modal
                    title="绑定模型"
                    visible={showModal}
                    onCancel={() => this.setState({ showModal: false, selectedDeviceId: null })}
                    onOk={this.handleBindModel}
                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="选择模型"
                        onChange={this.handleSelectDevice}
                        value={selectedDeviceId}
                    >
                        {models.map((model, index) => <Option value={model.name}>{model.name}</Option>)}
                    </Select>
                </Modal>
                <Modal
                    title="新增设备"
                    visible={equipmentVisible}
                    onCancel={this.handleCloseEquipment}
                    footer={[
                        <Button key="cancel" onClick={this.handleCloseModal}>取消</Button>,
                        <Button key="add" type="primary" onClick={this.handleAddEquipment}>新增</Button>
                    ]}
                >
                    <Row gutter={16} style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <label style={{ display: 'block', marginBottom: 8 }}>设备名称</label>
                            <Input
                                placeholder="设备名称"
                                onChange={(e) => this.handleInputChange(e.target.value, 'name')}
                            />
                        </Col>
                        <Col span={8}>
                            <label style={{ display: 'block', marginBottom: 8 }}>模型</label>
                            <Select
                                placeholder="选择模型"
                                onChange={(e) => this.handleInputChange(e, 'model')}
                                style={{ width: '100%' }}
                            >
                                {models.map((model, index) => <Option value={model.name}>{model.name}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default DeviceListPage;
