import React, { Component } from 'react';
import moment from 'moment'
import {
    Icon, Divider, Steps,  Row, Col, Spin, Statistic
} from 'antd';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class Tramite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:props.id || -1,
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
            fecha2:"",
            status:"",
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // only update chart if the data has changed
        if (prevProps.id !== this.props.id ) {
            this.setState({id:this.props.id})
            this.refreshData();
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
                this.setState({ pasos: response, loading:false, status:this.state.step==response.length ?
                        "TERMINADO" : this.state.step == 0 ? "INICIADO":"ENPROCESO" });
            },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    }

    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service:'get_datos_tramite_alumno/' + this.props.id ,
            success:(response) => {

                this.setState({step: response[0].paso_actual, proceso: response[0].proceso__nombre,
                ticket:response[0].numero_ticket, fecha1: response[0].fecha_inicio, fecha2:response[0].fecha_ultima_actualizacion});
                this.getPasos(response[0].proceso_id)
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

                <Row style={{float:'right'}} gutter={8}>
                    <Col span={12}>
                        <Statistic title="Dias transcurridos" groupSeparator={""} value={moment().diff(moment(this.state.fecha1),'days')} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Estatus" groupSeparator={""} value={this.state.status} />
                    </Col>
                </Row>
                <h2 style={{marginBottom:50}}>{this.state.proceso}</h2>
                <Steps labelPlacement={'vertical'} current={this.state.step} style={{marginBottom:50}}>
                    {
                        this.state.pasos.map(value=>{
                            return (<Steps.Step title={value.nombre_mostrar} />)
                        })
                    }
                </Steps>

                {this.state.step==this.state.pasos.length ?  <Row style={{textAlign:'center', }} gutter={8}>
                        <h2><a href={"https://forms.gle/GzcmC4f9cmFKS2ee9  "}>Evalúa los trámites escolares</a></h2>
                </Row> : <div></div>}
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
