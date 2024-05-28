import React, { Component } from 'react';
import {Table, Modal, Button, Input, Popconfirm} from 'antd';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;

class DatasetDetail extends Component {
    state = {
        dataset: []
    };

    componentDidMount() {
        this.fetchData();
    }

    getDataUrl = () => {
        return "http://localhost:8081/dataset/data";
    }

    fetchData = async () => {
        const dataUrl = this.getDataUrl();
        try {
            const response = await axios.get(dataUrl);
            this.setState({ dataset: JSON.parse(response.data.data) });
            console.log(this.dataset);
        } catch (error) {
            console.error(error);
        }
    };

    //timeValue是指excel中的时间整数值

    formatDate(timeValue) {

        let time = new Date((timeValue - 1) * 24 * 3600000 + 1);
        time.setYear(time.getFullYear() - 70);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        if (this.leapyear(year)) {
            //如果是闰年
            date = time.getDate() - 1 + "";
        }
        return year + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
    }
    leapyear(year) {
        var flag = false;
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            flag = true;
        }
        return flag;
    }

    render() {
        const { dataset } = this.state;

        const columns = [
            { title: '时间', dataIndex: '时间', key: '时间',render:(value,Object)=>{return this.formatDate(value)} },
            { title: '氢气', dataIndex: '氢气', key: '氢气' },
            { title: '甲烷', dataIndex: '甲烷', key: '甲烷' },
            { title: '乙烷', dataIndex: '乙烷', key: '乙烷' },
            { title: '乙烯', dataIndex: '乙烯', key: '乙烯' },
            { title: '乙炔', dataIndex: '乙炔', key: '乙炔' },
            { title: '一氧化碳', dataIndex: '一氧化碳', key: '一氧化碳' },
            { title: '二氧化碳', dataIndex: '二氧化碳', key: '二氧化碳' },
            { title: '总烃', dataIndex: '总烃', key: '总烃' },
        ];

        return (
            <div>
                <Table dataSource={dataset} columns={columns}  />
            </div>
        );
    }
}

export default DatasetDetail;
