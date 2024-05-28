import React from 'react';
import {
    Button,
    Col,
    Layout, Row,
} from 'antd';
import {css, StyleSheet} from 'aphrodite';


const styles = StyleSheet.create({
    header: {
        //display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: 'white',
    },
});

const title = '点检云平台';

const {Header} = Layout;

export default function titleBar(props) {
    return (
        <Header className={css(styles.header)}>
                <Row>
                    <Col className={css(styles.title)}>
                        {title}
                    </Col>
                    <Col offset={20}>
                        <Button onClick={props.onClick}>log out</Button>
                    </Col>
                </Row>
        </Header>
    );
}
