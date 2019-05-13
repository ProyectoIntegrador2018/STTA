import React, { Component } from 'react';
import {
    Layout, Menu, Icon
} from 'antd';
import tec from '../images/tec.png'
import { Link } from 'react-router-dom'
import API from "../tools/API";

const { Header, Content, Footer, Sider } = Layout;

export default class AppLayout extends Component {

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
                    style={{minHeight:'100vh'}}>

                    <div className="logo"><img alt="ExSaM" className={'logo'} src={tec}/></div>

                    <Menu  theme="dark" className={'ant-menu-tec'} mode="inline" defaultSelectedKeys={[this.props.view || 0]}>
                        <Menu.Item key="0">
                            <Link to={"/dashboard"}><Icon type="pie-chart" />
                                <span className="nav-text">Dashboard</span></Link>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Link to={"/administradores"}><Icon type="user" />
                                <span className="nav-text">Administradores</span></Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={"/alumnos"}><Icon type="team" />
                                <span className="nav-text">Alumnos</span></Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to={"/tramites"}><Icon type="solution" />
                                <span className="nav-text">Trámites</span></Link>
                        </Menu.Item>
                        <Menu.Item  key="3">
                            <Link to={"/procesos"}><Icon type="cluster" />
                                <span className="nav-text">Procesos</span></Link>
                        </Menu.Item>
                        <Menu.Item  key="4">
                            <Link to={"/documentos"}><Icon type="file-excel" />
                            <span className="nav-text">Documentos CSV</span></Link>
                        </Menu.Item>
                        <Menu.Item key="5" onClick={(e) => {API.logout();}}>
                            <Icon type="logout" />
                            <span>Salir</span>
                        </Menu.Item>
                    </Menu>

                </Sider>

                <Layout>
                    <Header className={'primaryBackground header-bar'}>
                        <span className={'logoName'} >Sistema para Consulta de Estatus de Trámites Escolares</span>
                        <span className={'logoName'} style={{float:'right'}} ><Icon type={'user'}/> {(localStorage.getItem("email") || "").toLocaleLowerCase() + " | " + localStorage.getItem("nombre")}</span>
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360}}>
                            <Content style={{ padding: '0', height:'100%' }}>
                                {this.props.children}
                            </Content>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Sistema para Consulta de Estatus de Trámites Escolares ITESM ©2019
                    </Footer>
                </Layout>
            </Layout>
        )};

    render() {
        return API.validateToken() ? this.Basic() : (<div></div>);
    }
}
