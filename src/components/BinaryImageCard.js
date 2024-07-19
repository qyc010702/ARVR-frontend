import React from 'react';
import { Card, Col, Button, Space } from 'antd';

const BinaryImageCard = ({ data }) => {
    const convertToBase64 = (binaryData) => {
        return Buffer.from(binaryData).toString('base64');
    };

    return (
        <div>
            {data.map((item) => (
                <Col span={12} key={item.id}>
                    <Card
                        title={item.name}
                        extra={
                            <Space size="middle">
                                <Button onClick={() => handleEditModel(item)}>修改</Button>
                                <Button onClick={() => handleDeleteModel(item)}>删除</Button>
                            </Space>
                        }
                        cover={
                            <img
                                alt="模型图片"
                                src={`data:image/png;base64,${convertToBase64(item.image)}`}
                                style={{ padding: '10px', maxHeight: '200px', objectFit: 'contain' }}
                            />
                        }
                        bodyStyle={{ padding: '10px' }}
                        style={{ width: '100%', margin: '0 auto' }}
                    >
                        <p><strong>标签：</strong>{item.detail}</p>
                        <p><strong>时间：</strong>{item.time}</p>
                        <p><strong>地址：</strong>{item.directory}</p>
                    </Card>
                </Col>
            ))}
        </div>
    );
};

export default BinaryImageCard;
