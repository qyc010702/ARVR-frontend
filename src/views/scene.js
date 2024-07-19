import React, { Component } from 'react';
import { Select, Input, Button } from 'antd';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useLoader } from '@react-three/fiber'
const { Option } = Select;


class FileUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '场景导入',
            fileAddress: ''
        };
    }

    handleOptionChange = (value) => {
        this.setState({ selectedOption: value });
    };

    handleAddressChange = (e) => {
        this.setState({ fileAddress: e.target.value });
    };

    handleUpload = () => {
        const { selectedOption, fileAddress } = this.state;
        // 执行上传操作，使用 selectedOption 和 fileAddress
        console.log('上传选项:', selectedOption);
        console.log('文件地址:', fileAddress);
    };


    render() {
        const { selectedOption, fileAddress } = this.state;

        return (
            <div>
                <h2>虚拟场景构建</h2>
                <div>
                    <Select value={selectedOption} onChange={this.handleOptionChange} style={{ width: 150 }}>
                        <Option value="场景导入">场景导入</Option>
                        <Option value="预设模型导入">预设模型导入</Option>
                    </Select>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <Input
                        value={fileAddress}
                        onChange={this.handleAddressChange}
                        placeholder="请输入文件地址"
                        style={{ width: '70%', marginRight: '10px' }}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <Button type="primary" onClick={this.handleUpload}>上传</Button>
                </div>

            </div>
        );
    }
}

export default FileUploader;
