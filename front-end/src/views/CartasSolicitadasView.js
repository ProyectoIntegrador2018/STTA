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
        API.restCall({
            service:'obtener_cartas_alumnos/',
            method: "get",
            params: "",
            success:(response) => {
                console.log(response)
                this.setState({data: response, loading:false});
            },
            error:(response) => {this.setState({ loading: false })},
        });
        
    };

    deleteFiles = (rows) => {
        this.setState({loading:true});
        // API.call('eliminar-documentos/',{documentos:JSON.stringify(rows)}, (response) => {
        //     this.setState({ loading:false});
        //     this.refreshData();
        // }, (response) => {this.setState({ loading:false})});
    };

    componentWillMount() {
        this.refreshData();
    }

    showContent = (record) => {
        let data = JSON.parse(record.contenido_subido);
        console.log(data);
        this.setState({cols:data.cols, data2:data.data, visible:true,record:record});
    };

    render() {

        let permitirBorrar
     
        permitirBorrar=true

        return (
            <div>

                <h1><Icon type="solution" /> Cartas Solicitadas</h1>
                <DataTable loading={this.state.loading} data={this.state.data}
                           deleteFunc={this.deleteFiles} rowSelection={permitirBorrar}

                columns={[{
                    title: 'Matrícula del alumno',
                    key: 'matricula',

                }, {
                    title: 'Nombre',
                    key: 'nombre_alumno',

                },{
                    title: 'Fecha solicitada',
                    key: 'fecha_creacion',

                }, {
                    title: 'Tipo de carta',
                    key: 'nombre_carta',
                }
              ]}/>
              </div>
        );
    }
}