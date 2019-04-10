import React, { Component } from 'react';
import moment from 'moment'
import {
    Icon, Upload, Form, Divider,Button, Input, Steps, Select,Switch, Row, Col, Modal, Spin, Statistic
} from 'antd';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class Tramite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            columns: [],
            disabled: true,
            step:0,
            ultima_actualizacion:"",
            fecha_apertura:"",
            pasos:[],
            proceso:"",
            ticket:"",
            fecha1:"",
            fecha2:""
        }
    }
    componentWillMount() {
        this.refreshData();
    }

    getPasos = (id) => {
        this.setState({loading:true});
        API.restCall({
            service:'get_pasos_tramites/',
            params:{id:id},
            method:'post',
            success:(response) => {
                this.setState({ pasos: response, loading:false});
            },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    }

    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service:'get_datos_tramite_alumno/',
            success:(response) => {
                this.getPasos(response[0].proceso_id)
                this.setState({step: response[0].paso_actual, proceso: response[0].proceso__nombre,
                ticket:response[0].numero_ticket, fecha1: response[0].fecha_inicio, fecha2:response[0].fecha_ultima_actualizacion });
            },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    };

    render() {
        return (
            <Spin spinning={this.state.loading}><div>
                <h1>{"Mi trámite"}</h1>
                <Divider/>
                <h2 style={{marginBottom:50}}>{this.state.proceso}</h2>
                <Steps labelPlacement={'vertical'} current={this.state.step} style={{marginBottom:50}}>
                    {
                        this.state.pasos.map(value=>{
                            return (<Steps.Step title={value.nombre_mostrar} />)
                        })
                    }
                </Steps>
                <Row gutter={8}>
                    <Col span={12}>
                        <Statistic title="Ticket" groupSeparator={""} value={this.state.ticket} prefix={'#'} />
                    </Col>
                    <Col span={12}>
                        <Row gutter={8} style={{textAlign:'center'}}>
                            <Col span={12}>
                                <Statistic title="Fecha de inicio" value={moment.utc(this.state.fecha1).format("DD/MM/YYYY")} prefix={<Icon type="calendar" />} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Fecha de ultima actualizacion" value={moment.utc(this.state.fecha2).format("DD/MM/YYYY")} prefix={<Icon type="calendar" />}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            </Spin>
        );
    }
}
