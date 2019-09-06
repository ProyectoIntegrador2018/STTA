import React, { Component } from 'react';
import { Button, Collapse, Spin } from 'antd';
import Charts from 'ant-design-pro/lib/Charts';
import { Pie } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import '../App.css';
import "antd/dist/antd.css";
import API from "../tools/API";
import Select from "antd/lib/select";

const Panel = Collapse.Panel;

function callback(key) {
    //console.log(key);
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
        API.restCall({
            service: 'get_procesos',
            method:'get',
            success:(response) => {
                let datos = [];
                console.log(response)

                for (let i in response) {
                    this.getData(i, response[i]);
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
                        let data = [];
                        console.log(response)
                        let finished = 0;
                        let sumDays = 0;
                        for (let i in pasos) {
                            data[i] = {numero: pasos[i].numero, x: pasos[i].nombre_mostrar, y: 0};
                        }
                        for (let i in response) {
                            for (let r in data){
                                if (data[r].numero == response[i].numero_paso_actual){
                                    data[r].y += 1;
                                }
                            }
                            if (response[i].Status == 2){
                                sumDays += moment(response[i].fecha_ultima_actualizacion).diff(moment(response[i].fecha_inicio),'days');
                                finished += 1;
                            }
                        }
                        console.log(sumDays);
                        this.setState({["data_"+key+"spinner"]:false, ["data_"+key+"xy"]:data,  ["data_"+key+"prom"]: (sumDays / finished)});
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


                <Collapse defaultActiveKey={['1']} onChange={callback}>

                    {this.state.procs.map((item, key) => (
                        <Panel header={item.nombre} key={key}>
                            <Button onClick={()=>this.getData(key, item)} style={{float:"right", width:"100px", marginRight:5}} type={"primary"}>Consultar</Button>

                            <Select defaultValue="-1" onChange={(value)=> this.setState({["data_"+key+"status"]:value})}  style={{float:"right", width:"200px", marginRight:5}}>
                                <Select.Option value="-1">Todos los status</Select.Option>
                                <Select.Option value="0">Iniciado</Select.Option>
                                <Select.Option value="1">En Proceso</Select.Option>
                                <Select.Option value="2">Finalizado</Select.Option>
                            </Select>

                            <Select defaultValue="0"  onChange={(value)=> this.setState({["data_"+key+"month"]:value})}   style={{float:"right", width:"200px", marginRight:5}}>
                                <Select.Option value="0">Todos los meses</Select.Option>
                                <Select.Option value="1">Enero</Select.Option>
                                <Select.Option value="2">Febrero</Select.Option>
                                <Select.Option value="3">Marzo</Select.Option>
                                <Select.Option value="4">Abril</Select.Option>
                                <Select.Option value="5">Mayo</Select.Option>
                                <Select.Option value="6">Junio</Select.Option>
                                <Select.Option value="7">Julio</Select.Option>
                                <Select.Option value="8">Agosto</Select.Option>
                                <Select.Option value="9">Septiembre</Select.Option>
                                <Select.Option value="10">Octubre</Select.Option>
                                <Select.Option value="11">Noviembre</Select.Option>
                                <Select.Option value="12">Diciembre</Select.Option>
                            </Select>
                            <h2>{item.nombre} </h2>
                            <h4><br/>Duración promedio en días:<br/>{this.state["data_"+key+"prom"] ? this.state["data_"+key+"prom"] : ""}</h4>

                            <Pie
                                hasLegend
                                title={item.nombre}
                                subTitle="Total"
                                total={() => (
                                    <Spin spinning={this.state["data_"+key+"spinner"]}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: ((this.state["data_"+key+"xy"] ? this.state["data_"+key+"xy"]  : []).reduce((pre, now) => now.y + pre, 0))
                                        }}
                                    />
                                    </Spin>
                                )}
                                data={this.state["data_"+key+"xy"] ? this.state["data_"+key+"xy"]  : []}
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