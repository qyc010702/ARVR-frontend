import { Component } from 'react';
import { Table, Button, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from "axios";
import pic from '../pic/Pallet.png'
class ModelPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchData: [],
            modalChangeVisible:false,
            modalVisible: false,
            newModel: { name: '', directory: '', detail: '' },
            changeModel: { id:'',name: '', directory: '', detail: '' },
            modelData:[],
            changeId:"",
            detailVisible:false,
            selectedModel:[],
        };
    }

    componentDidMount() {
        this.fetchModels()
        // 在组件挂载后，添加按钮点击事件
    }

    fetchModels=()=>{
        axios.get('http://localhost:8081/model/allModels')
            .then(response => {
                this.setState({
                    modelData: response.data.data,
                });
            })
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

    handleSearch = (value) => {
        console.log(this.state.modelData)
        const { modelData } = this.state;
        const searchData = modelData.filter(item =>
            item.name.includes(value) || item.detail.includes(value)
        );
        this.setState({ searchData });
    };

    handleOpenModal = () => {
        this.setState({ modalVisible: true });
    };

    handleCloseModal = () => {
        this.setState({ modalVisible: false });
    };

    handleChangeModal =()=>{
        this.setState({ modalChangeVisible: false });
    }

    handleInputChange = (e, key) => {
        const { newModel } = this.state;
        this.setState({
            newModel: {
                ...newModel,
                [key]: e.target.value
            }
        });
    };

    handleInputChange2 = (e, key) => {
        const { changeModel } = this.state;
        this.setState({
            changeModel: {
                ...changeModel,
                [key]: e.target.value
            }
        });
    };

    handleEditModel = (record)=>{
        this.setState({
            modalChangeVisible:true,
            changeModel:record,
            changeId:record.id
        })
    }

    handleAddModel = () => {
        const { modelData, newModel } = this.state;
        const newTableData = [...modelData, { ...newModel, id: Date.now() }];
        this.setState({ modelData: newTableData, modalVisible: false, newModel: { name: '', tag: '', address: '' } });
        console.log(newModel)
        axios.post('http://localhost:8081/model/create', newModel)
            .then(response => {
                this.setState({
                    newModel: { name: '', directory: '', detail: '' },
                });
                this.fetchModels()
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: 'Failed to fetch models'
                });
            });
    };

    handleDeleteModel=(record)=>{
        console.log(record)
        axios.delete(`http://localhost:8081/model/${record.id}`).then(this.fetchModels)
    }

    handleChangeModel=()=>{
        const { changeModel } = this.state;
        axios.put(`http://localhost:8081/model/${this.state.changeId}`, changeModel)
            .then(response => {
                this.setState({
                    changeModel:  { id:'',name: '', directory: '', detail: '' },
                    modalChangeVisible:false
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
        const { searchData, modelData, modalVisible, newModel ,modalChangeVisible,changeModel,selectedModel} = this.state;

        const columns = [
            {
                title: '模型名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '标签',
                dataIndex: 'detail',
                key: 'detail',
            },
            {
                title: '时间',
                dataIndex: 'time',
                key: 'time',
            },
            {
                title: '地址',
                dataIndex: 'directory',
                key: 'directory',
            },
            {
                title: '操作',
                key: 'action',
                width: 200, // Set a specific width for the Actions column
                render: (text, record) => (
                    <Space size="middle">
                        <Button onClick={() => this.showDetailModal(record)}>查看</Button>
                        <Button onClick={() => this.handleEditModel(record)}>修改</Button>
                        <Button onClick={() => this.handleDeleteModel(record)}>删除</Button>
                    </Space>
                ),
            },
        ];

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

                <Button type="primary" onClick={this.handleOpenModal} style={{ marginBottom: 16 }}>新增</Button>

                <Table
                    dataSource={searchData.length > 0 ? searchData : this.state.modelData}
                    columns={columns}
                    style={{ marginTop: '16px' }}
                    bordered
                    size="middle"
                    pagination={{ pageSize: 10 }}
                />

                <Modal
                    title="新增模型"
                    visible={modalVisible}
                    onCancel={this.handleCloseModal}
                    footer={[
                        <Button key="cancel" onClick={this.handleCloseModal}>取消</Button>,
                        <Button key="add" type="primary" onClick={this.handleAddModel}>新增</Button>
                    ]}
                >
                    <Input placeholder="模型名称" value={newModel.name} onChange={(e) => this.handleInputChange(e, 'name')} style={{ marginBottom: 8 }} />
                    <Input placeholder="标签" value={newModel.detail} onChange={(e) => this.handleInputChange(e, 'detail')} style={{ marginBottom: 8 }} />
                    <Input placeholder="地址" value={newModel.directory} onChange={(e) => this.handleInputChange(e, 'directory')} />
                </Modal>
                <Modal
                    title="修改模型"
                    visible={modalChangeVisible}
                    onCancel={this.handleChangeModal}
                    footer={[
                        <Button key="cancel" onClick={this.handleChangeModal}>取消</Button>,
                        <Button key="add" type="primary" onClick={this.handleChangeModel}>修改</Button>
                    ]}
                >
                    <Input placeholder="模型名称" value={changeModel.name} onChange={(e) => this.handleInputChange2(e, 'name')} style={{ marginBottom: 8 }} />
                    <Input placeholder="标签" value={changeModel.detail} onChange={(e) => this.handleInputChange2(e, 'detail')} style={{ marginBottom: 8 }} />
                    <Input placeholder="地址" value={changeModel.directory} onChange={(e) => this.handleInputChange2(e, 'directory')} />
                </Modal>
                <Modal
                    title="三维模型详情"
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
                    <p><strong>模型名称：</strong>{selectedModel.name}</p>
                    <img src={pic} alt="模型图片" style={{ width: '100%' }} />
                </Modal>
            </div>
        );
    }
}

export default ModelPage;
