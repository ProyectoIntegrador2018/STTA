import React, { Component } from 'react';
import moment from 'moment'
import {
    Icon, Divider, Steps,  Row, Col, Spin, Statistic
} from 'antd';
import API from "../tools/API";
import MediaQuery from 'react-responsive';

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
            n_paso: 1
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
                this.setState({ pasos: response, loading:false, status:this.state.n_paso==response.length ?
                        "Terminado" : this.state.n_paso == 0 ? "Iniciado":"En proceso" });
            },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    }

    refreshData = () => {
        this.setState({loading:true});
        {/*Método que muestra los datos de los trámites
        Muestra los pasos de los trámites, el nombre del proceso,
        la fecha de inicio, la fecha de última actualización,
        los días transcurridos*/}
        API.restCall({
            service:'get_datos_tramite_alumno/' + this.props.id ,
            success:(response) => {
                this.setState({step: response[0].paso_actual, proceso: response[0].proceso__nombre,
                ticket:response[0].numero_ticket, fecha1: response[0].fecha_inicio, fecha2:response[0].fecha_ultima_actualizacion,
                n_paso:response[0].numero_paso_actual });
                this.getPasos(response[0].proceso_id)
                },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    };

    /*
    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service:'get_datos_tramite_alumno/' + this.props.id ,
            success:(response) => {

                this.setState({step: response[0].paso_actual, proceso: response[0].proceso__nombre,
                ticket:response[0].numero_ticket, fecha1: response[0].fecha_inicio, fecha2:response[0].fecha_ultima_actualizacion,
                n_paso:response[0].numero_paso_actual });
                this.getPasos(response[0].proceso_id)
                },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    };
    */

    /*Layout de los trámites*/

    render() {
        return (
            <Spin spinning={this.state.loading}><div>
                <h2 style={{float:'right'}}>{ localStorage.getItem("esAdmin") ? 
                    <Statistic title="Matrícula" groupSeparator={""} value={(localStorage.getItem("matAlumno") || " ").toLocaleUpperCase()} />
                 : "" }</h2>
                <h1>{ localStorage.getItem("esAdmin") ? "Trámite del alumno" : "Mi trámite" }</h1>
                <Divider/>
                <Row style={{float:'right'}} gutter={8}>
                    <Col span={12}>
                        <Statistic title="Días transcurridos" groupSeparator={""} value={moment().diff(moment(this.state.fecha1),'days')} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Estatus" groupSeparator={""} value={this.state.status} />
                    </Col>
                </Row>
                <h2 style={{marginBottom:50}}>{this.state.proceso}</h2>
                <MediaQuery query="(min-device-width: 1224px)">
                    <Steps labelPlacement={'vertical'} current={this.state.n_paso} style={{marginBottom:50}}>
                        {
                            this.state.pasos.map(value => {
                                return (<Steps.Step title={value.nombre_mostrar} />)
                            })
                        }
                    </Steps>
                </MediaQuery>
                <MediaQuery query="(max-device-width: 1223px)">
                    <Steps direction="vertical" labelPlacement={'vertical'} current={this.state.n_paso} style={{marginBottom:50}}>
                        {
                            this.state.pasos.map(value => {
                                return (<Steps.Step title={value.nombre_mostrar} />)
                            })
                        }
                    </Steps>
                </MediaQuery>
                {this.state.n_paso==this.state.pasos.length  && !localStorage.getItem("esAdmin")  ?  <Row style={{textAlign:'center', }} gutter={8}>
                        <h2><a href={"https://forms.gle/GzcmC4f9cmFKS2ee9"} target={"_blank"}>Evalúa los trámites escolares</a></h2>
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
                                <Statistic title="Fecha de última actualización" value={moment.utc(this.state.fecha2).format("DD/MM/YYYY")} prefix={<Icon type="calendar" />}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            </Spin>
        );
    }
}
