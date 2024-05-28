import React, { Component } from 'react';
import { Table, Button, Modal, Select } from 'antd';
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
            showModal: false,
            selectedDeviceId: null,
            models: ['模型A', '模型B', '模型C', '模型D'],
        };
    }



    handleAddDevice = () => {
        // 添加设备的逻辑
        console.log('添加设备');
    };

    handleBindModel = () => {
        // 绑定模型的逻辑
        console.log('绑定模型', this.state.selectedDeviceId);
        this.setState({ showModal: false, selectedDeviceId: null });
    };

    handleSelectDevice = (deviceId) => {
        this.setState({ selectedDeviceId: deviceId });
    };

    render() {
        const { devices, showModal, selectedDeviceId, models } = this.state;

        const columns = [
            { title: '设备名称', dataIndex: 'name', key: 'name' },
            { title: '模型', dataIndex: 'model', key: 'model' },
            { title: '入库日期', dataIndex: 'entryDate', key: 'entryDate' },
            { title: '状态', dataIndex: 'status', key: 'status' },
            { title: '下次检查日期', dataIndex: 'nextCheckDate', key: 'nextCheckDate' },
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
                        {models.map((model, index) => (
                            <Option key={index} value={index + 1}>{model}</Option>
                        ))}
                    </Select>
                </Modal>
            </div>
        );
    }
}

export default DeviceListPage;
