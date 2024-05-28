import React, { Component } from 'react';
import {Table, Button, Modal, Input, Select, Row, Col} from 'antd';
import axios from "axios";
import {SearchOutlined} from "@ant-design/icons";
import pic from "../pic/scene.jpg";

const { Search } = Input;
const { Option } = Select;
class ChecklistPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalContent: [],
            newCheck:{
                id:'',
                place:'',
                time:'',
                status:'',
                person:''
            },
            searchData:[],
            detailVisible:false,
            selectedModel:[],
        };
    }

    fetchChecks=()=>{
        axios.get('http://localhost:8081/check/allChecks')
            .then(response => {
                console.log(response)
                this.setState({
                    checklistData: response.data.data,
                });
            })
    }

    componentDidMount() {
        this.fetchChecks()
        // 在组件挂载后，添加按钮点击事件
    }

    // 显示模态框
    showDetailModal = (record) => {
        this.setState({
            detailVisible:true,
            selectedModel:record,
        })
    };

    // 点击确认按钮
    handleDetailOk = () => {
        this.setState({
            detailVisible:false,
        })
    };

    // 点击取消或关闭按钮
    handleDetailCancel = () => {
        this.setState({
            detailVisible:false,
        })
    };

    handleViewDetail = (record) => {
        if (record.videos) {
            this.setState({ modalContent: record.videos.map((video, index) => <video key={index} src={video} controls />) });
        } else if (record.images) {
            this.setState({ modalContent: record.images.map((image, index) => <img key={index} src={image} alt={`Image ${index}`} style={{ width: '100%' }} />) });
        }
        this.setState({ modalVisible: true });
    };

    handleCloseModal = () => {
        this.setState({ modalVisible: false, modalContent: [] });
    };

    handleSearch = (value) => {
        // 进行搜索逻辑，这里只是简单演示，可以根据需要进行完善
        const { checklistData } = this.state;
        const searchData = checklistData.filter(item =>
            item.person.includes(value) || item.place.includes(value)
        );
        this.setState({ searchData });
    };

    handleSort = (sorter) => {
        // 进行排序逻辑，这里只是简单演示，可以根据需要进行完善
        const { checklistData } = this.state;
        const { columnKey, order } = sorter;
        const sortedData = checklistData.sort((a, b) => {
            if (order === 'ascend') {
                return a[columnKey] > b[columnKey] ? 1 : -1;
            } else if (order === 'descend') {
                return a[columnKey] < b[columnKey] ? 1 : -1;
            }
            return 0;
        });
        this.setState({ checklistData: sortedData });
    };

    handleOpenModal = () => {
        this.setState({ modalVisible: true });
    };

    handleAddModel = () => {
        axios.post('http://localhost:8081/check/create', this.state.newCheck)
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
                this.fetchChecks()
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: 'Failed to fetch models'
                });
            });
    };

    handleInputChange = (e, key) => {
        const { newCheck } = this.state;
        this.setState({
            newCheck: {
                ...newCheck,
                [key]: e
            }
        });
    };

    render() {
        const { checklistData, modalVisible, modalContent,newCheck,searchData } = this.state;

        const columns = [
            {
                title: '点检编号',
                dataIndex: 'id',
                key: 'id',
                sorter: true,
            },
            {
                title: '点检时间',
                dataIndex: 'time',
                key: 'time',
                sorter: true,
            },
            {
                title: '点检区域信息',
                dataIndex: 'place',
                key: 'place',
                sorter: true,
            },
            {
                title: '点检状态信息',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
            },
            {
                title: '点检员信息',
                dataIndex: 'person',
                key: 'person',
                sorter: true,
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Button onClick={() => this.showDetailModal(record)}>查看详情</Button>
                ),
            },
        ];

        return (
            <div>
                <div>
                    <Input
                    placeholder="输入点检区域或点检员搜索"
                    prefix={<SearchOutlined />}
                    onPressEnter={(e) => this.handleSearch(e.target.value)}
                    style={{ marginRight: 8, width: 200 }}
                    />
                <Button onClick={() => this.setState({ searchData: [] })}>还原</Button>

                </div>
                <Button type="primary" onClick={this.handleOpenModal} style={{ marginBottom: 16,marginTop:10 }}>新增</Button>
                <Table
                    dataSource={searchData.length > 0 ? searchData :checklistData}
                    columns={columns}
                    onChange={this.handleSort}
                    pagination={{ pageSize: 5 }}
                    scroll={{ y: 500 }} // 根据需要设置最大高度
                />

                <Modal
                    title="新增点检记录"
                    visible={modalVisible}
                    onCancel={this.handleCloseModal}
                    footer={[
                        <Button key="cancel" onClick={this.handleCloseModal}>取消</Button>,
                        <Button key="add" type="primary" onClick={this.handleAddModel}>新增</Button>
                    ]}
                >
                    <Row gutter={16} style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <label style={{ display: 'block', marginBottom: 8 }}>点检区域</label>
                            <Input
                                placeholder="点检区域"
                                value={newCheck.place}
                                onChange={(e) => this.handleInputChange(e.target.value, 'place')}
                            />
                        </Col>
                        <Col span={8}>
                            <label style={{ display: 'block', marginBottom: 8 }}>点检状态</label>
                            <Select
                                placeholder="选择点检状态"
                                value={newCheck.status}
                                onChange={(e) => this.handleInputChange(e, 'status')}
                                style={{ width: '100%' }}
                            >
                                <Option value="完成">完成</Option>
                                <Option value="待检查">待检查</Option>
                                <Option value="出错">出错</Option>
                                <Option value="检查中">检查中</Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <label style={{ display: 'block', marginBottom: 8 }}>点检人员</label>
                            <Input
                                placeholder="点检人员"
                                value={newCheck.person}
                                onChange={(e) => this.handleInputChange(e.target.value, 'person')}
                            />
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    title="点检详情"
                    visible={this.state.detailVisible}
                    onOk={this.handleDetailOk}
                    onCancel={this.handleDetailCancel}
                    footer={[
                        <Button key="back" onClick={this.handleDetailCancel}>
                            返回
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleDetailOk}>
                            确认
                        </Button>,
                    ]}
                >
                    <p><strong>点检号：</strong>{this.state.selectedModel.id}</p>
                    <img src={pic} alt="模型图片" style={{ width: '100%' }} />
                </Modal>
            </div>
        );
    }
}

export default ChecklistPage;
