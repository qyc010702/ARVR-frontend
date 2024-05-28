import React from 'react';
import {Layout} from 'antd';
import {css, StyleSheet} from 'aphrodite';

const styles = StyleSheet.create({
    copyright: {
        textAlign: 'center',
        color: 'black',
        fontSize: 'small',
        background: '#DCDCDC'
    },
});

const {Footer} = Layout;

const PageFooter = () => (
    <Footer className={css(styles.copyright)}>
        Copyright © 2024 XR Platform All Rights Reserved.
    </Footer>
);

export default PageFooter;
