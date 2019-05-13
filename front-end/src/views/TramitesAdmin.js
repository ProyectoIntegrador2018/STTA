import React, { Component } from 'react';
import {
    Icon, Button, Modal
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import moment from 'moment';

export default class TramitesAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            data2:[],
            loading:true,
            record:{},
            cols:[],
        }
    }

    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service:'get_tramites/',
            success:(response) => {
                console.log(response);
                this.setState({data: response, loading:false});
            },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    };

    deleteFiles = (rows) => {
        this.setState({loading:true});
        API.call('eliminar_tramites/',{tramites:JSON.stringify(rows)}, (response) => {
            this.setState({ loading:false});
            this.refreshData();
        }, (response) => {this.setState({ loading:false})});
    };

    componentWillMount() {
        this.refreshData();
    }

    render() {
        return (
            <div>
                <h1><Icon type="solution" /> Trámites</h1>
                <DataTable loading={this.state.loading} data={this.state.data}
                           deleteFunc={this.deleteFiles} rowSelection={true}
                columns={[{
                    title: 'Matrícula',
                    key: 'matricula',

                }, {
                    title: '# De ticket',
                    key: 'numero_ticket',
                    render: (text, record) => (
                        <div style={{textAlign:'center'}}>
                            <a onClick={() => {localStorage.setItem("matAlumno", record.matricula);
                            API.redirectTo("/tramite/"+record.id)}}> #{text}</a>
                        </div>
                    )

                }, {
                    title: 'Fecha de inicio',
                    key: 'fecha_inicio',
                    render: (text, record) => (
                        <div style={{textAlign:'center'}}>
                            <div>{moment(text).format('DD-MMM-YYYY')}</div>
                        </div>
                    )
                }, {
                    title: 'Fecha de última actualización',
                    key: 'fecha_ultima_actualizacion',
                    render: (text, record) => (
                        <div style={{textAlign:'center'}}>
                            <div>{moment(text).format('DD-MMM-YYYY')}</div>
                        </div>
                    )
                },{
                    title: 'Paso actual',
                    key: 'numero_paso_actual',
                },{
                    title: 'Paso actual',
                    key: 'proceso__nombre',
                }
                ]}/>
                <Modal
                    width={1300}
                    title={this.state.record.nombre}
                    visible={this.state.visible}
                    onCancel={() => {this.setState({visible:false})}}
                    footer={[
                        <Button key="back" onClick={() => {this.setState({visible:false})}}>Cancelar</Button>,
                        <Button key="submit" type="primary"  onClick={() => {this.setState({visible:false})}}>
                            OK
                        </Button>,]}>
                    <div style={{textAlign:'right'}}><h3>{this.state.record.fecha}</h3></div>
                    <DataTable columns={this.state.cols} data={this.state.data2}/>
                </Modal>
            </div>
        );
    }
}
