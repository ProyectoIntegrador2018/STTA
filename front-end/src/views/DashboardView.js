import React, { Component } from 'react';
import { Switch, Collapse, Spin } from 'antd';
import Charts from 'ant-design-pro/lib/Charts';
import { Pie } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import '../App.css';
import "antd/dist/antd.css";
import API from "../tools/API";

const Panel = Collapse.Panel;

function callback(key) {
    console.log(key);
}

// Transferencia otro campus    QUITAR
const salesPieData3 = [
    {
        x: 'Director de programa autoriza',
        y: 100,
    },
    {
        x: 'Escolar origen autoriza',
        y: 220,
    },
    {
        x: 'Tesorería',
        y: 40,
    },
    {
        x: 'Escolar destino autoriza',
        y: 40,
    },
    {
        x: 'Trámite terminado',
        y: 40,
    },
];

// Baja de materias    QUITAR
const salesPieData4 = [
    {
        x: 'Escolar inicia trámite',
        y: 40,
    },
    {
        x: 'Becas autoriza',
        y: 30,
    },
    {
        x: 'DC autoriza',
        y: 10,
    },
    {
        x: 'Trámite terminado',
        y: 5,
    },
];



class DashboardView extends Component {

    constructor(props){
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
                let tramitesTerminados = this.state.tramitesMes / this.state.totalTramites * 100;
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

        /*this.setState({tramiteTransferencia: true});
        API.restCall({
            service: 'get_tramite_alumnos_transferencia_pasos',
            method:'get',
            success:(response) => {
                let xy = [];
                for (let i in response) {
                    xy[i] = response[i].nombre;
                }   
                this.setState({pasosTransferencia: xy});    
            },
        });
        API.restCall({
            service: 'get_tramite_alumnos_transferencia',
            method:'get',
            success:(response) => {
                let xy = [];
                for (let i in this.state.pasosTransferencia) {
                    xy[i] = {x: this.state.pasosTransferencia[i], y: 0};
                }
                for (let i in response) {
                    xy[response[i].paso_actual - 1].y += 1;
                }
                this.setState({tramiteTransferencia: false, salesPieData2: xy});      
            },
            error:(response) => {
                this.setState({tramiteTransferencia: false});
            }
        });*/
    }

    render() {

        return (
            <div className="graficas">
                {/* Gráficas que muestran el número de trámites terminados por semana y mes */}
                <div className="row">
                    <div className="column"  style={{height: '400px'}} >
                        <Spin spinning={this.state.loadingMonth}>
                            <div className="column"  style={{backgroundColor: "#088A85",width: '545px' ,height: '350px'}} >
                                <h1 style={{ color: 'white' }}>Total de trámites concluidos este mes </h1>
                                <p style={{ color: 'white', fontSize:130}}> {this.state.tramitesMes} </p>
                            </div>
                        </Spin>
                    </div>
                    <div className="column" style={{height: '400px'}} >
                        <Spin spinning={this.state.loadingWeek}>
                            <div className="column"  style={{backgroundColor: "#B4045F",width: '545px' ,height: '350px'}} >
                                <h1 style={{ color: 'white' }}>Total de trámites concluidos esta semana </h1>
                                <p style={{ color: 'white', fontSize:130}}> {this.state.tramitesSemana} </p>
                            </div>
                        </Spin>
                    </div>
                </div>
                {/* RENGLON 0 END */}
                {/* RENGLON 1 BEGIN */}
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
                    <div className="column">
                        <h1>Trámites completados </h1>
                        <Pie percent={this.state.tramitesTerminados} subTitle="Procesos completos" total={this.state.tramitesTerminados + "%"} height={294} />
                    </div>
                </div>
                {/* RENGLON 1 END*/}
                <Collapse defaultActiveKey={['1']} onChange={callback}>
                    <Panel header="Estatus Transferencias como destino Monterrey" key="1">
                        <h1>Estatus trámites transferencias como destino Monterrey </h1>
                        <Pie
                            hasLegend
                            title="Transferencias como destino Monterrey"
                            subTitle="Total"
                            total={() => (
                                <Spin spinning={this.state.tramiteTransferencia}>
                                    <span
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
                    </Panel>
                    <Panel header="Estatus de Transferencias a otros campus" key="2">
                        <h1>Estatus de Transferencias a otros campus </h1>
                        <Pie
                            hasLegend
                            title="Transferencias a otros campus"
                            subTitle="Total"
                            total={() => (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: (salesPieData3.reduce((pre, now) => now.y + pre, 0))
                                    }}
                                />
                            )}
                            data={salesPieData3}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: (val) }} />}
                            height={294}
                        />
                    </Panel>
                    <Panel header="Estatus de trámites baja de materias" key="3">
                        <h1>Estatus de trámites baja de materias </h1>
                        <Pie
                            hasLegend
                            title="Baja de materias"
                            subTitle="Total"
                            total={() => (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: (salesPieData4.reduce((pre, now) => now.y + pre, 0))
                                    }}
                                />
                            )}
                            data={salesPieData4}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: (val) }} />}
                            height={294}
                        />


                    </Panel>
                </Collapse>



            </div>
        );
    }
}

export default DashboardView;