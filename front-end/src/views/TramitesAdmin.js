import React, { Component } from 'react';
import {
    Icon, Button, Modal
} from 'antd';
import DataTable from "../components/DataTable";
import { Link } from 'react-router-dom'
import API from "../tools/API";




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
                this.setState({data: response, loading:false});
            },
            error:(response) => {
                this.setState({loading:false});
            }
        })
    };

    deleteFiles = (rows) =>{
        this.setState({loading:true});
        API.call('eliminar_tramites/',{tramites:JSON.stringify(rows)},(response) => {
            this.setState({ loading:false});
            this.refreshData();
        },(response) => {this.setState({ loading:false})});
    };

    componentWillMount() {
        this.refreshData();
    }

    render() {
        return (
            <div>
                <h1><Icon type="solution" /> Tramites</h1>
                <DataTable loading={this.state.loading} data={this.state.data}
                           deleteFunc={this.deleteFiles} rowSelection={true}
                columns={[{
                    title: 'Matricula',
                    key: 'matricula',

                }, {
                    title: '# de ticket',
                    key: 'numero_ticket',

                }, {
                    title: 'Fecha inicio',
                    key: 'fecha_inicio',
                }, {
                    title: 'Fecha última actualización',
                    key: 'fecha_ultima_actualizacion',
                },{
                    title: 'Paso actual',
                    key: 'paso_actual',
                },
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
