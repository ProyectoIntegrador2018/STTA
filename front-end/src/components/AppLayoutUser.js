import React, { Component } from 'react';
import {
    Layout, Menu, Icon
} from 'antd';
import tec from '../images/tec.png'
import { Link } from 'react-router-dom'
import API from "../tools/API";

const { Header, Content, Footer, Sider } = Layout;

export default class AppLayoutUser extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        }
    }

    Basic = () => {
        return (
            <Layout className={'layout'}>

                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => { console.log(broken); }}
                    className={'ant-menu-tec'}
                    onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
                    style={{minHeight:'100vh'}}

                >

                    <div className="logo"><img alt="ExSaM" className={'logo'} src={tec}/></div>

                    <Menu  theme="dark" className={'ant-menu-tec'} mode="inline" defaultSelectedKeys={[this.props.view || 0]}>
                        <Menu.Item key="0">
                            <Link to={"/tramite"}><Icon type="profile" />
                                <span className="nav-text">Mis trámites</span></Link>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Link to={"/historial"}><Icon type="user" />
                                <span className="nav-text">Trámites pasados</span></Link>
                        </Menu.Item>
                        <Menu.Item key="3" onClick={(e) => {API.logoutUser();}}>
                            <Icon type="logout" />
                            <span>Salir</span>
                        </Menu.Item>
                    </Menu>

                </Sider>

                <Layout>
                    <Header className={'primaryBackground header-bar'}><h2 className={'logoName'} >Sistema de Trazabilidad de Tramites Academicos</h2></Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360}}>
                            <Content style={{ padding: '0', height:'100%' }}>
                                {this.props.children}
                            </Content>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        STTA ITESM - Sistema de Trazabilidad de Tramites Academicos ITESM ©2019
                    </Footer>
                </Layout>
            </Layout>
        )};

    render() {

        return API.validateToken() ? this.Basic() : (<div></div>);
    }
}
