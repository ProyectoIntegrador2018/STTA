import React, { Component } from 'react';
import {
    Layout, Menu, Icon
} from 'antd';
import tec from '../images/tec.png'
import API from "../tools/API";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const datos = [{nombre:"Trámite ámite", id:"5", actual:true, ticket:"0002326562"},
       {nombre:"Proceso eso", id:"6", actual:false, ticket:"000254552"},
       {nombre:"Proceso proc", id:"7", actual:true, ticket:"021144852"},
       {nombre:"Trámite tram", id:"8", actual:true, ticket:"52944120"}];

export default class AppLayoutUser extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            data1 : [], data2 : []}
    }

    Despliega = (props) => {
        API.redirectTo('/alumnos/tramite/'+props.id)
    };

    componentWillMount() {
        API.restCall({
            service: 'get_tramites_alumno/' + localStorage.getItem('matricula'),
            method:'get',
            success:(response) => {
                let data1 = [];
                let data2 = [];
                console.log(response)
                response.map((item) => {
                        if(item.pasos == item.numero_paso_actual) {
                            data2.push(item);
                        } else {
                            data1.push(item);
                        }
                    }
                )
            this.setState({data1: data1, data2 : data2, loading:false});
        }});
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
                        <SubMenu key="subMenuTramitesActuales" title={<span><Icon type="profile" /><span>Trámites Actuales</span></span>}>
                            {
                                this.state.data1.map((objectToMap,index) => {
                                    return (<Menu.Item onClick={() =>this.Despliega(objectToMap)}>{objectToMap.nombre}</Menu.Item>)})
                            }
                        </SubMenu>
                        <SubMenu key="subMenuTramitesPasados" title={<span><Icon type="user" />
                            <span>Trámites Concluidos</span>
                        </span>}>
                            {
                                this.state.data2.map((objectToMap,index) => {
                                    return (<Menu.Item onClick={() =>this.Despliega(objectToMap)}>{objectToMap.nombre}</Menu.Item>)})
                            }
                        </SubMenu>
                        <Menu.Item key="3" onClick={(e) => {API.logoutUser();}}>
                            <Icon type="logout" />
                            <span>Salir</span>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout>
                    <Header className={'primaryBackground header-bar'}>
                        <span className={'logoName'} >Sistema para Consulta de Estatus de Trámites Escolares</span>
                        <span className={'logoName'} style={{float:'right'}} ><Icon type={'user'}/> {localStorage.getItem("matricula").toLocaleUpperCase() + " | " + localStorage.getItem("nombre")}</span>
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
