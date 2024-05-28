import React from 'react';
import { Layout, Menu } from 'antd';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from 'react-router-dom';
import ServiceData from '../views/serviceData';
import Equipment from "../views/equipment";
import Model from "../views/model";
import Scene from "../views/scene";
import Test from "../views/test"
import GraphChart from "../views/GraphChart";
import SubMenu from "antd/es/menu/SubMenu";
const { Sider, Content } = Layout;

function AppRouter() {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider width={200} theme="dark" style={{height: '1500px'}}>
                    <Menu mode="vertical" theme="dark" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Link to="/service">业务数据管理</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/3DModel">三维模型管理</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/scene">虚拟场景构建</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/test">场景漫游</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="/equipment">设备入库管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/Graph">点检数据总览</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ minHeight: '100vh' }}>
                    <Content style={{ padding: '20px' }}>
                        <Routes>
                            <Route path="/about" element={<Equipment />} />
                            <Route path="/service" element={<ServiceData />} />
                            <Route path="/scene" element={<Scene />} />
                            <Route path="/3DModel" element={<Model />} />
                            <Route path="/equipment" element={<Equipment />} />
                            <Route path="/test" element={<Test />} />
                            <Route path="/Graph" element={<GraphChart />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

export default AppRouter;
