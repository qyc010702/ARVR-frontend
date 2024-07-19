import React, { Component } from 'react';
import { Card, Button, Input, Modal, Row, Col, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

class ModelPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchData: [],
            modalChangeVisible: false,
            modalVisible: false,
            newModel: { name: '', directory: '', detail: '', image: null },
            changeModel: { id: '', name: '', directory: '', detail: '', image: null },
            modelData: [],
            changeId: '',
        };
    }


    componentDidMount() {
        this.fetchModels();
    }

    fetchModels = () => {
        axios.get('http://localhost:8081/model/allModels').then(response => {
            console.log(response.data.data)
            this.setState({
                modelData: response.data.data,
            });
        });
    };

    handleSearch = (value) => {
        const { modelData } = this.state;
        const searchData = modelData.filter(item => item.name.includes(value) || item.detail.includes(value));
        this.setState({ searchData });
    };

    handleOpenModal = () => {
        this.setState({ modalVisible: true });
    };

    handleCloseModal = () => {
        this.setState({ modalVisible: false });
    };

    handleChangeModal = () => {
        this.setState({ modalChangeVisible: false });
    };

    handleInputChange = (e, key) => {
        const { newModel } = this.state;
        this.setState({
            newModel: {
                ...newModel,
                [key]: e.target.value,
            },
        });
    };

    handleFileChange = (e) => {
        const { newModel } = this.state;
        this.setState({
            newModel: {
                ...newModel,
                image: e.target.files[0],
            },
        });
    };

    handleInputChange2 = (e, key) => {
        const { changeModel } = this.state;
        this.setState({
            changeModel: {
                ...changeModel,
                [key]: e.target.value,
            },
        });
    };

    handleEditModel = (record) => {
        this.setState({
            modalChangeVisible: true,
            changeModel: record,
            changeId: record.id,
        });
    };

    handleAddModel = () => {
        const { newModel } = this.state;
        const formData = new FormData();
        formData.append('name', newModel.name);
        formData.append('directory', newModel.directory);
        formData.append('detail', newModel.detail);
        formData.append('image', newModel.image);

        axios.post('http://localhost:8081/model/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            this.setState({
                newModel: { name: '', directory: '', detail: '', image: null },
                modalVisible: false,
            });
            this.fetchModels();
        });
    };

    handleDeleteModel = (record) => {
        axios.delete(`http://localhost:8081/model/${record.id}`).then(this.fetchModels);
    };

    handleChangeModel = () => {
        const { changeModel, changeId } = this.state;
        const formData = new FormData();
        formData.append('name', changeModel.name);
        formData.append('directory', changeModel.directory);
        formData.append('detail', changeModel.detail);
        if (changeModel.image) {
            formData.append('image', changeModel.image);
        }

        axios.put(`http://localhost:8081/model/${changeId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            this.setState({
                changeModel: { id: '', name: '', directory: '', detail: '', image: null },
                modalChangeVisible: false,
            });
            this.fetchModels();
        });
    };

    render() {
        const { searchData, modelData, modalVisible, newModel, modalChangeVisible, changeModel } = this.state;

        const data = searchData.length > 0 ? searchData : modelData;

        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="输入模型名称或标签搜索"
                        prefix={<SearchOutlined />}
                        onPressEnter={(e) => this.handleSearch(e.target.value)}
                        style={{ marginRight: 8, width: 200 }}
                    />
                    <Button onClick={() => this.setState({ searchData: [] })}>还原</Button>
                </div>

                <Button type="primary" onClick={this.handleOpenModal} style={{ marginBottom: 16 }}>
                    新增
                </Button>

                <Row gutter={[24, 24]}>
                    {data.map((item) => (
                        <Col span={8} key={item.id}>
                            <Card
                                title={item.name}
                                extra={
                                    <Space size="middle">
                                        <Button onClick={() => this.handleEditModel(item)}>修改</Button>
                                        <Button onClick={() => this.handleDeleteModel(item)}>删除</Button>
                                    </Space>
                                }
                                cover={
                                    <img
                                        alt="模型图片"
                                        src={`data:image/png;base64,${item.image.data}`}
                                        style={{ padding: '10px', maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                }
                                bodyStyle={{ padding: '10px' }}
                                style={{ width: '100%', margin: '0 auto' }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <p><strong>标签：</strong>{item.detail}</p>
                                        <p><strong>时间：</strong>{item.time}</p>
                                        <p><strong>地址：</strong>{item.directory}</p>
                                        <p><strong>所属单位：</strong>沪东造船厂</p>
                                    </Col>
                                    <Col span={12}>
                                        <p><strong>尺寸：</strong>150cm*150cm</p>
                                        <p><strong>负责人：</strong>葛煜</p>
                                        <p><strong>模型编号：</strong>{item.id}</p>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title="新增模型"
                    visible={modalVisible}
                    onCancel={this.handleCloseModal}
                    footer={[
                        <Button key="cancel" onClick={this.handleCloseModal}>取消</Button>,
                        <Button key="add" type="primary" onClick={this.handleAddModel}>新增</Button>,
                    ]}
                >
                    <Input
                        placeholder="模型名称"
                        value={newModel.name}
                        onChange={(e) => this.handleInputChange(e, 'name')}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="标签"
                        value={newModel.detail}
                        onChange={(e) => this.handleInputChange(e, 'detail')}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="地址"
                        value={newModel.directory}
                        onChange={(e) => this.handleInputChange(e, 'directory')}
                    />
                    <input type="file" onChange={this.handleFileChange} style={{ marginTop: 8 }} />
                </Modal>

                <Modal
                    title="修改模型"
                    visible={modalChangeVisible}
                    onCancel={this.handleChangeModal}
                    footer={[
                        <Button key="cancel" onClick={this.handleChangeModal}>取消</Button>,
                        <Button key="add" type="primary" onClick={this.handleChangeModel}>修改</Button>,
                    ]}
                >
                    <Input
                        placeholder="模型名称"
                        value={changeModel.name}
                        onChange={(e) => this.handleInputChange2(e, 'name')}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="标签"
                        value={changeModel.detail}
                        onChange={(e) => this.handleInputChange2(e, 'detail')}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="地址"
                        value={changeModel.directory}
                        onChange={(e) => this.handleInputChange2(e, 'directory')}
                    />
                    <input type="file" onChange={(e) => this.setState({ changeModel: { ...changeModel, image: e.target.files[0] } })} style={{ marginTop: 8 }} />
                </Modal>
            </div>
        );
    }
}

export default ModelPage;
