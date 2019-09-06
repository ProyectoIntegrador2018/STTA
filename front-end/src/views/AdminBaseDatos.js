import React, { Component } from 'react';
import {
    Icon, Upload, message, Select, Divider,Button
} from 'antd';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class Documentos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            disabled: false,
            loadingTable: false,
            fileName:"",
            dataAlumnos: []
        }
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    uploadData = () => {
        let alumnosJson = JSON.stringify({data: this.state.dataAlumnos});
        API.call('agregar_alumnos/', {content: alumnosJson}, (resposne) => {
            console.log(resposne)
            Notifications.openNotificationWithIcon("success","¡Información cargada exitosamente!","")
        });
    };

    parseFile = (file) => {
        console.log("Parse File")
        var alumnos = []

        this.setState(
            {
                fileName: file.name
            }
        );
      
        let Papa = require("papaparse/papaparse.min.js");
        Papa.parse(file, {
            complete: function(results) {
                console.log("results.data: ", results.data);
                var fileData = results.data
                var alumnosColumns = results.data[0]
                var alumno = {}

                for (var i = 1; i < fileData.length; i++){
                    var arrayAux = fileData[i]
                    if (arrayAux[0] === ""){
                        break; 
                    }
                    for (var x = 0; x < arrayAux.length; x++){
                        alumno[alumnosColumns[x]] = arrayAux[x]
                    }
                    alumnos.push(alumno)
                    alumno = {}
                }
                console.log(alumnos)
            }
        });

        this.setState(
            {
                dataAlumnos: alumnos
            }
        );

    };

    handleChange = (value) => {
        console.log('Handle Change')
    };

    render() {
        return (
            <div>
                <Upload.Dragger
                    beforeUpload={(file, fileList) => {
                        this.parseFile(file);
                        return false;
                    }}
                    disabled={this.state.disabled}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="upload" />
                    </p>
                    <p className="ant-upload-text">Haz clic o arrastra un documento en esta área</p>
                    <p className="ant-upload-hint">El sistema solo soporta archivos CSV</p>
                </Upload.Dragger>

                <Divider/>
                
                <div style={{textAlign:'right'}}>
                    <Button onClick={this.uploadData} style={{marginTop:10}} className={'button-success'}><Icon type={'upload'}/> Subir datos</Button>
                </div>
            </div>
        );
    }
}
