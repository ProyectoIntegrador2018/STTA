import React, { Component } from 'react';
import { Collapse, Spin } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';
import '../App.css';
import "antd/dist/antd.css";
import API from "../tools/API";

const Panel = Collapse.Panel;

function callback(key) {
    //console.log(key);
}

class DashboardView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tramitesMes: 0,
            tramitesSemana: 0,
            loadingMonth: false,
            loadingWeek: false,
            tramitesAcademicos: false,
            salesPieData:[],
            totalTramites: 0,
            tramitesTerminados: 0,
            salesPieData2: [],
            tramiteTransferencia: false,
            pasosTransferencia: [],
            procs:[]
        }
    }

    componentWillMount() {
        this.setState({loadingMonth: true});
        let tramitesMes = 0;
        let totalTramites = 0;
        API.restCall({
            service: 'get_tramite_alumnos_status',
            method:'get',
            success:(response) => {
                for (let i in response) {
                    totalTramites += 1;
                    if (response[i].status == "TERMINADO") {
                        tramitesMes += 1;
                    }
                }   
                this.setState({tramitesMes: tramitesMes, totalTramites: totalTramites, loadingMonth: false});
                let tramitesTerminados = 0;
                if (this.state.totalTramites != 0) {
                    tramitesTerminados = this.state.tramitesMes / this.state.totalTramites * 100;
                }
                this.setState({tramitesTerminados: tramitesTerminados});
            },
            error:(response) => {
                this.setState({loadingMonth: false});
            }
        });
        this.setState({tramitesAcademicos: true});
        API.restCall({
            service: 'get_tramite_alumnos_status',
            method:'get',
            success:(response) => {
                let xy = [  {
                    x: 'Baja de materias',
                    y: 0,
                },
                {
                    x: 'InterCampus',
                    y: 0,
                },
                {
                    x: 'Cambio de carrera',
                    y: 0,
                },
                {
                    x: 'Baja temporal',
                    y: 0,
                },
                {
                    x: 'Transferencia',
                    y: 0,
                }]
                for (let i in response) {
                    if (response[i].nombre == "Intercampus") {
                        xy[1].y += 1;
                    }
                    else if (response[i].nombre == "Baja de materias") {
                        xy[0].y += 1;
                    }
                    else if (response[i].nombre == "Cambio de carrera") {
                        xy[2].y += 1;
                    }
                    else if (response[i].nombre == "Baja temporal") {
                        xy[3].y += 1;
                    }
                    else if (response[i].nombre == "Transferencia") {
                        xy[4].y += 1;
                    }
                }   
                this.setState({tramitesAcademicos: false, salesPieData:xy});    
            },
            error:(response) => {
                this.setState({tramitesAcademicos: false});
            }
        });
        this.setState({loadingWeek: true});
        let tramitesSemana = 0;
        API.restCall({
            service: 'get_tramite_alumnos_status_week',
            method:'get',
            success:(response) => {
                for (let i in response) {
                    if (response[i].status == "TERMINADO") {
                        tramitesSemana += 1;
                    }
                }   
                this.setState({tramitesSemana: tramitesSemana, loadingWeek: false});    
            },
            error:(response) => {
                this.setState({loadingWeek: false});
            }
        });
        API.restCall({
            service: 'get_procesos',
            method:'get',
            success:(response) => {
                let datos = [];
                console.log(response)

                for (let i in response) {
                    datos[i] = {x: response[i].nombre, y: 0};
                }
                this.setState({procesos: datos, procs: response});
            },
            error:(response) => {
                this.setState({tramiteTransferencia: false});
            }
        });
    }
    getData = (key, item) => {
        this.setState({["data_"+key+"spinner"]:true});
        API.restCall({
            service: 'get_pasos_proceso/' + item.id,
            method:'get',
            success:(response) => {
                console.log(response);
                let pasos = response;
                API.restCall({
                    service: 'get_tramites_resumen/' + item.id + "/" + (this.state["data_"+key+"month"] != undefined ?
                        this.state["data_"+key+"month"] : 0) + "/" + (this.state["data_"+key+"status"] != undefined  ?
                        this.state["data_"+key+"status"] : -1),
                    method:'get',
                    success:(response) => {

                    },
                    error:(response) => {
                        this.setState({["data_"+key+"spinner"]:false});
                    }
                });
            },
            error:(response) => {
                this.setState({["data_"+key+"spinner"]:false});
            }
        });
    };

    render() {
        return (
            <div className="graficas">
                {/* Gráficas que muestran el número de trámites terminados por semana y mes */}
                <div className="row">
                    <div className="column"  style={{height: '400px'}} >
                        <Spin spinning={this.state.loadingMonth}>
                            <div className="column"  style={{backgroundColor: "#7798AB",width: '545px' ,height: '350px'}} >
                                <h1 style={{ color: 'white' }}>Total de trámites concluidos este mes </h1>
                                <p style={{ color: 'white', fontSize:130, textAlign:"center"}}> {this.state.tramitesMes} </p>
                            </div>
                        </Spin>
                    </div>
                    <div className="column" style={{height: '400px'}} >
                        <Spin spinning={this.state.loadingWeek}>
                            <div className="column"  style={{backgroundColor: "#828A95",width: '545px' ,height: '350px'}} >
                                <h1 style={{ color: 'white' }}>Total de trámites concluidos esta semana </h1>
                                <p style={{ color: 'white', fontSize:130, textAlign:"center"}}> {this.state.tramitesSemana} </p>
                            </div>
                        </Spin>
                    </div>
                </div>
                {/* Gráfica que muestran el número de todos los trámites academicos que están en el sistema */}
                <div className="row">
                    <div className="column">
                        <h1>Trámites académicos </h1>
                        <Pie className="pie"
                            hasLegend
                            title="Trámites académicos"
                            subTitle="Total"
                            total={() => (
                                <Spin spinning={this.state.tramitesAcademicos}>
                                    <span className="chart-data"
                                        dangerouslySetInnerHTML={{
                                            __html: (this.state.salesPieData.reduce((pre, now) => now.y + pre, 0))
                                        }}
                                    />
                                </Spin>
                            )}
                            data={this.state.salesPieData}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: (val) }} />}
                            height={294}
                        />
                    </div>
                    {/* Gráficas que muestran el porcentaje de trámites que se han completado*/}
                    <div className="column">
                        <h1>Trámites completados </h1>
                        <Pie percent={this.state.tramitesTerminados} subTitle="Procesos completos" total={this.state.tramitesTerminados + "%"} height={294} />
                    </div>
                </div>

                <Collapse defaultActiveKey={['1']} onChange={callback}>
                    {this.state.procs.map((item, key) => (
                    <Panel header={item.nombre} key={key}>
                        <h2>{item.nombre}</h2>
                        <Pie
                            hasLegend
                            title={item.nombre}
                            subTitle="Total"
                            total={() => (
                                <Spin spinning={this.state.tramiteTransferencia}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: (this.state.salesPieData2.reduce((pre, now) => now.y + pre, 0))
                                        }}
                                    />
                                </Spin>
                            )}
                            data={this.state.salesPieData}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: (val) }} />}
                            height={294}
                        />
                        </Panel>)
                        )}
                </Collapse>
            </div>
        );
    }
}

export default DashboardView;