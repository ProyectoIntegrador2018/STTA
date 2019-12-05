import React, { Component } from 'react';
import {
    Icon, Button, Modal
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import moment from 'moment';
import { setState } from '../tools/common';

export default class TramitesAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = setState();
    }

    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service:'get_tramites/',
            method:'get',
            success:(response) => {this.setState({data: response, loading:false});},
            error:(response) => {this.setState({loading:false});}
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
        let permitirBorrar
        if (localStorage.getItem("tipo") == '2') {permitirBorrar=false}
        else {permitirBorrar=true}
        return (
            <div>
                <h1><Icon type="solution" /> Trámites</h1>
                <DataTable loading={this.state.loading} data={this.state.data} deleteFunc={this.deleteFiles} rowSelection={permitirBorrar}
                columns={[{title: 'Matrícula', key: 'alumno__matricula',},
                 { title: '# De ticket', key: 'numero_ticket', render: (text, record) => (<div style={{textAlign:'center'}}><a onClick={() => {localStorage.setItem("matAlumno", record.alumno__matricula);API.redirectTo("/tramite/"+record.id)}}> #{text}</a></div>)},
                 { title: 'Fecha de inicio', key: 'fecha_creacion', render: (text, record) => (<div style={{textAlign:'center'}}><div>{moment(text).format('DD-MMM-YYYY')}</div></div>)},
                 { title: 'Fecha de última actualización', key: 'fecha_modificacion', render: (text, record) => (<div style={{textAlign:'center'}}><div>{moment(text).format('DD-MMM-YYYY')}</div></div>)},
                 { title: 'Paso actual', key: 'paso__numero',},
                 { title: 'Paso actual', key: 'proceso__nombre', }
                ]}/>
                <Modal width={1300} title={this.state.record.nombre} visible={this.state.visible} onCancel={() => {this.setState({visible:false})}}
                    footer={[
                        <Button key="back" onClick={() => {this.setState({visible:false})}}>Cancelar</Button>,
                        <Button key="submit" type="primary" onClick={() => {this.setState({visible:false})}}>OK</Button>,]}>
                    <div style={{textAlign:'right'}}><h3>{this.state.record.fecha}</h3></div>
                    <DataTable columns={this.state.cols} data={this.state.data2}/>
                </Modal>
            </div>
        );
    }
}
