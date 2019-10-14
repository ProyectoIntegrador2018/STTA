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


class DashboardView extends Component {

    constructor(props){
        super(props);
        this.state = {
            tramiteTransferencia: false,
            procs:[]
        }
    }

    componentWillMount() {
        API.restCall({
            service: 'get_procesos',
            method:'get',
            success:(response) => {
                for (let i in response) { this.getData(i, response[i]); }
                this.setState({procs: response});
            },
            error:(response) => { this.setState({tramiteTransferencia: false}); }
        });
    }

    getData = (key, item) => {
        this.setState({["data_"+key+"spinner"]:true});
        API.restCall({
            service: 'get_pasos_proceso/' + item.id,
            method:'get',
            success:(response) => {
                let pasos = response;
                API.restCall({
                    service: 'get_tramites_resumen/' + item.id + "/" + (this.state["data_"+key+"month"] != undefined ?
                        this.state["data_"+key+"month"] : 0) + "/" + (this.state["data_"+key+"status"] != undefined  ?
                        this.state["data_"+key+"status"] : -1),
                    method:'get',
                    success:(response) => {
                        let data = [];
                        let finished = 0;
                        let sumDays = 0;
                        // pasos are ordered by paso.numero
                        for (let i in pasos) { data[i] = {numero: pasos[i].numero, x: pasos[i].nombre, y: 0}; }
                        for (let i in response) {
                            data[response[i].numero - 1].y = response[i].num_tramites;
                            if (response[i].status == 2){
                                sumDays += response[i].num_days;
                                finished += response[i].num_tramites;
                            }
                        }
                        this.setState({["data_"+key+"spinner"]:false, ["data_"+key+"xy"]:data,  ["data_"+key+"prom"]: (sumDays / finished)});
                    },
                    error:(response) => { this.setState({["data_"+key+"spinner"]:false}); }
                });
            },
            error:(response) => { this.setState({["data_"+key+"spinner"]:false}); }
        });
    };
    render() {
        return (
            <div className="graficas">
                <Collapse defaultActiveKey={['1']}>
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
                            <h2>{item.nombre} </h2><h4><br/>Duración promedio en días:<br/>{this.state["data_"+key+"prom"] ? this.state["data_"+key+"prom"] : ""}</h4>
                            <Pie hasLegend title={item.nombre} subTitle="Total"
                                total={() => (<Spin spinning={this.state["data_"+key+"spinner"]}><span dangerouslySetInnerHTML={{ __html: ((this.state["data_"+key+"xy"] ? this.state["data_"+key+"xy"]  : []).reduce((pre, now) => now.y + pre, 0))}}/></Spin>)}
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
