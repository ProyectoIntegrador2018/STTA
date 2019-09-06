import React, { Component } from 'react';
import {
    Icon, Button, Modal
} from 'antd';
import DataTable from "../components/DataTable";
import { Link } from 'react-router-dom'
import API from "../tools/API";
import moment from 'moment';

export default class Documentos extends Component {

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
        API.call('documentos/',[], (response) => {
            this.setState({data: response, loading:false});
        });
    };

    deleteFiles = (rows) => {
        this.setState({loading:true});
        API.call('eliminar-documentos/',{documentos:JSON.stringify(rows)}, (response) => {
            this.setState({ loading:false});
            this.refreshData();
        }, (response) => {this.setState({ loading:false})});
    };

    componentWillMount() {
        this.refreshData();
    }

    showContent = (record) => {
        let data = JSON.parse(record.contenido_subido);
        this.setState({cols:data.cols, data2:data.data, visible:true,record:record});
    };

    render() {
        
        let botonsubir
        let permitirBorrar

        if (localStorage.getItem("tipo") == '2') {
            botonsubir = <Link to={'/documentos/subir'}><Button style={{float:'right'}} type="secondary" icon="upload" disabled>
                    Subir documento de proceso</Button></Link>
            permitirBorrar=false
        }
        else {
            botonsubir = <Link to={'/documentos/subir'}><Button style={{float:'right'}} type="secondary" icon="upload">
                    Subir documento de proceso</Button></Link>
            permitirBorrar=true
        }

        return (
            <div>
                {botonsubir}

                <h1><Icon type="file-excel" /> Documentos</h1>
                <DataTable loading={this.state.loading} data={this.state.data}
                           deleteFunc={this.deleteFiles} rowSelection={permitirBorrar}
                columns={[{
                    title: 'Nombre del documento',
                    key: 'nombre',

                }, {
                    title: 'Usuario',
                    key: 'email',

                }, {
                    title: 'Fecha',
                    key: 'fecha',
                    render: (text, record) => (
                        <div style={{textAlign:'center'}}>
                            <div>{moment(text).format('DD-MMM-YYYY')}</div>
                        </div>
                    ),
                }, {
                    title: 'Contenido subido',
                    key: 'id',
                    render: (text, record) => (
                        <div style={{textAlign:'center'}}>
                            <a onClick={() => this.showContent(record)}><Icon type={'table'}/> Ver contenido</a>
                        </div>
                    ),
                }]}/>

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
                    <div style={{textAlign:'right'}}><h3>{moment(this.state.record.fecha).format('DD-MMM-YYYY')}</h3></div>
                    <DataTable columns={this.state.cols} data={this.state.data2}/>
                </Modal>
            </div>
        );
    }
}
