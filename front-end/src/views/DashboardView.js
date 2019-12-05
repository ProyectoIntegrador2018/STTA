import React, { Component } from 'react';
import { Button, Collapse, Spin } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';
import { Table } from 'antd';
import '../App.css';
import "antd/dist/antd.css";
import API from "../tools/API";
import Select from "antd/lib/select";

const Panel = Collapse.Panel;

const columns = [
    {
      dataIndex: 'x',
      key: '1',
    },
    {
      dataIndex: 'y',
      key: '2',
    },
  ];

class DashboardView extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            procs:[],
            data:[],
            cartas:{},
            month: "0"
        }
    }

    componentWillMount() {
        API.restCall({
            service:'obtener_cartas/',
            method: "get",
            success:(response) => {
                let cartas = {};
                for (let i in response){
                    cartas[response[i].id] = {x: response[i].descripcion, y: 0};
                }
                this.setState({cartas: cartas});
                this.getStats();
            },
            error:(response) => {this.setState({ loading: false })},
        });
    }

    getStats = () => {
        this.setState({loading:true});
        API.restCall({
            service:'get_student_letter_stats/' + this.state.month,
            method: "get",
            success:(response) => {
                let data = JSON.parse(JSON.stringify(this.state.cartas));
                for (let i in response) {
                    data[response[i].id].y = response[i].num_cartas;
                }
                this.setState({loading: false, data: Object.values(data), prom: 0});
            },
            error:(response) => {this.setState({ loading: false })},
        });
    }

    render() {
        return (
            <div className="graficas">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={"Cartas"} key={'cartas'}>
                        <Button onClick={()=> this.getStats()} style={{float:"right", width:"100px", marginRight:5}} type={"primary"}>Consultar</Button>
                        <Select defaultValue="0"  onChange={(value)=> this.setState({month: value})}   style={{float:"right", width:"200px", marginRight:5}}>
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
                        <h2>{'Cartas'} </h2><h4><br/>Duración promedio en días:<br/>{this.state.prom ? this.state.prom : ""}</h4>
                        <Pie title={"Cartas"} subTitle="Total" tooltip
                    total={() => (<Spin spinning={this.state.loading}><span dangerouslySetInnerHTML={{ __html: ((this.state.data).reduce((pre, now) => pre + now.y, 0))}}/></Spin>)}
                    data={this.state.data}
                    height={294}
                    />
                    <Table dataSource={this.state.data} columns={columns} />;
                    </Panel>
                </Collapse>
            </div>
        );
    }
}

export default DashboardView;
