import React, { Component } from 'react';
import {
    Icon, Upload, message, Select, Divider,Button
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class Documentos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            data: [],
            dataTable: [],
            columns: [],
            disabled: true,
            proceso: {},
            loadingTable:false,
            fileName:"",
            id_proceso:undefined
        }
    }

    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service: 'get_procesos',
            method:'get',
            success:(response) => {
                this.setState({data: response, loading:false});
            }
        });
    };

    componentWillMount() {
        this.refreshData();
    }

    uploadData = () => {
        let csv = JSON.stringify({data: this.state.dataTable, cols: this.state.columns });
        if (this.state.id_proceso == undefined  ||   csv == undefined || csv == "" ||
             this.state.fileName == undefined ||
            this.state.fileName == "" ) {
            Notifications.openNotificationWithIcon("warning","Verifica que todos los campos estén completos","")
        } else {
            API.call('subir-documento/',{proceso: this.state.id_proceso, filename:this.state.fileName, content: csv}, (resposne) => {
                Notifications.openNotificationWithIcon("success","¡Información cargada exitosamente!","")
                API.redirectTo('/documentos');
            });
        }
    };

    parseFile = (file) => {
        this.setState({fileName:file.name});
        let Papa = require("papaparse/papaparse.min.js");
        Papa.parse(file, {
            header: false,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        });
    };

    updateData = (result) => {
        const data = result.data;
        // Here this is available and we can call this.setState (since it's binded in the constructor)
        // or shorter ES syntax: this.setState({ data });
        if (this.state.columns && this.state.columns.length > 0) {
            let dataT = [];
            data.splice(1).map((item,index) => {
                let row = {};
                this.state.columns.map((col) => {
                    row[col.key] = item[col.llave];
                });
                dataT.push(row);
            });
            this.setState({dataTable: dataT});
        }
    };

    handleChange = (value) => {
        if (value != null) {
            let cols = [];
            this.setState({disabled: false, proceso: this.state.data[value], loadingTable: false});
            cols.push({key:"ticket",title:'# Ticket', llave:0});
            cols.push({key:"matricula",title:'Matrícula', llave:0});
            this.setState({id_proceso: this.state.data[value].id});
            API.restCall({
                service: 'get_pasos_proceso/' + this.state.data[value].id,
                method:'get',
                success:(response) => {
                    response.map((val) => {
                        cols.push({key:"paso_" + val.numero, title:val.nombre, llave:val.id});
                    });
                    this.setState({columns: cols});
                }
            });
        }
    };

    render() {
        return (
            <div>
                <Select
                    loading={this.state.loading}
                    showSearch
                    style={{ width: '100%', marginBottom:20 }}
                    placeholder="Selecciona un proceso"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.data.map((val,index) => (<Select.Option value={index}>{val.nombre}</Select.Option>))}
                </Select>
                <Upload.Dragger
                    beforeUpload={(file, fileList) => {this.parseFile(file);return false;}}
                    disabled={this.state.disabled}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="upload" />
                    </p>
                    <p className="ant-upload-text">Haz clic o arrastra un documento en esta área</p>
                    <p className="ant-upload-hint">El sistema solo soporta archivos CSV</p>
                </Upload.Dragger>

                <Divider/>
                <h2>Previsualización de datos</h2>
                <DataTable loading={this.state.loadingTable} data={this.state.dataTable} columns={this.state.columns}/>
                <div style={{textAlign:'right'}}>
                    <Button onClick={this.uploadData} style={{marginTop:10}} className={'button-success'}><Icon type={'upload'}/> Subir datos</Button>
                </div>
            </div>
        );
    }
}
