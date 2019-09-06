import React, { Component } from 'react';
import {
    Icon, Upload, message, Select, Divider,Button, Input, Form,
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import Notifications from "../tools/Notifications";
import { throws } from 'assert';

export default class Documentos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            descripcion: '', 
            loading: true,
            disabled: true,
            loadingTable: false,
        }
    }

    componentWillMount() {

    }

    uploadData = () => {
        const axios = require('axios');
        const data = new FormData()

        data.append('id_admin', 6)
        data.append('descripcion', this.state.descripcion)
        data.append('file', this.state.file)

        axios.post(API.apiLocal + 'agregar_cartas/', data, {
        })
        .then(response => {
            console.log(response)
            Notifications.openNotificationWithIcon("success","¡Información cargada exitosamente!","")
            API.redirectTo('/formatoCartas');
        })
        .catch(error => {
            console.log(error);
        });

    };

    handleSelect = (keyvalue) => {
        this.setState({descripcion: keyvalue});
    };

    render() {
        return (
            <div>
            <h2>Carta nueva</h2>
            <Form.Item label="Descripción de la carta: ">
                <Input type={'text'} onChange={(e) => this.handleSelect(e.target.value)}/>
            </Form.Item>

            <Upload.Dragger
                beforeUpload={(file, fileList) => {
                    console.log(file.name)
                    this.setState({file: file});
                    return false;
                }}>
                <p className="ant-upload-drag-icon">
                    <Icon type="upload" />
                </p>
                <p className="ant-upload-text">Haz clic o arrastra un documento en esta área</p>
                <p className="ant-upload-hint">El sistema solo soporta archivos HTML</p>
            </Upload.Dragger>

            <Divider/>

            <Button onClick={this.uploadData} style={{marginTop:10}} className={'button-success'}><Icon type={'upload'}/> Subir datos</Button>
            </div>
        );
    }
}
