import React, { Component } from 'react';
import {
    Icon, Upload, Form, Divider,Button, Input, Steps, Select,Switch, Row, Col, Modal
} from 'antd';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class ProcesoNuevo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            columns: [],
            disabled: true,
            matricula:"",
            ticket:"",
            ultima_actualizacion:"",
            fecha_apertura:"",
            pasos:[]
        }
    }

    refreshData = () => {};

    componentWillMount() {
        this.refreshData();
    }

    getColumnByKey = (key) => {
        return this.state.columns[key];
    };

    uploadData = () => {

        let params = {
            nombre: this.state.nombre,
            matricula:this.getColumnByKey(this.state.matricula),
            ticket:this.getColumnByKey(this.state.ticket),
            ultima_actualizacion:this.getColumnByKey(this.state.ultima_actualizacion),
            fecha_apertura:this.getColumnByKey(this.state.fecha_apertura),
            pasos:this.state.pasos
        };

        if (params.nombre == "" || params.matricula == "" || params.ticket == "" || params.ultima_actualizacion == "" ||
            params.fecha_apertura == "" || params.pasos ==  "") {
            Notifications.openNotificationWithIcon("warning","Verifica que todos los campos estén completos","")
        } else {
            Modal.confirm({
                title: 'Estos son los datos a subir:',
                content: <div>
                    <b><label>Nombre: </label></b> {params.nombre}<br/>
                    <b><label>Columna de la matrícula: </label></b>  {params.matricula.title}<br/>
                    <b><label>Columna del ticket: </label></b>  {params.ticket.title}<br/>
                    <b><label>Columna de fecha de apertura: </label></b>  {params.fecha_apertura.title}<br/>
                    <b><label>Columna de última actualización: </label></b>  {params.ultima_actualizacion.title}<br/>
                    <h4><b>Pasos:</b> </h4><br/>
                    <Divider/>
                    {params.pasos.map((p) =><div>
                        <b> <label>Columna: </label></b> {p.title}<br/>
                        <b> <label># de paso: </label></b> {p.numero}<br/>
                        <b> <label>Nombre a mostrar: </label></b> {p.nombre_mostrar }<br/>
                        <b> <label>Mostrar: </label></b> {p.mostrar ? "Sí" : "No"}<br/>
                        <Divider/>
                    </div>)}
                </div>,
                onOk: () => {
                    //console.log('OK');
                    params = {
                        nombre: this.state.nombre,
                        matricula:JSON.stringify(this.getColumnByKey(this.state.matricula)),
                        ticket:JSON.stringify(this.getColumnByKey(this.state.ticket)),
                        ultima_actualizacion:JSON.stringify(this.getColumnByKey(this.state.ultima_actualizacion)),
                        fecha_apertura:JSON.stringify(this.getColumnByKey(this.state.fecha_apertura)),
                        pasos:JSON.stringify(this.state.pasos)
                    };
                    this.setState({loading:true});
                    console.log(this.state.pasos)
                    API.call('agregar-proceso/',params, (resposne) => {
                        Notifications.openNotificationWithIcon("success","¡Proceso nuevo creado exitosamente!","")
                        API.redirectTo('/procesos');
                        this.setState({loading:false});
                    }, (resposne) => {this.setState({loading:false});});
                },
                cancelText:"Cancelar",
                onCancel() {
                    //console.log('Cancel');
                }
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
        let columns = [];
        for (let i = 0; i < data[0].length; i++) {
            columns.push({
                key: i,
                title: (i + 1) + " | " + data[0][i],
                nombre: data[0][i],
            });
        }
        this.setState({columns: columns});
    };

    handleSelect = (name, keyvalue) => {
        this.setState({[name]:keyvalue});
    };

    add = () => {
        this.state.pasos.push({nombre:"", columna_csv:"", nombre_mostrar:"", mostrar:true, numero:this.state.pasos.length + 1, title:""});
        this.setState({pasos: this.state.pasos});
    };

    remove = () => {
        this.state.pasos.splice(-1,1);
        this.setState({pasos: this.state.pasos});
    };

    edit = (index,campo, value) => {
        let pasos = this.state.pasos;
        if (campo === 'columna_csv') {
            let c = this.getColumnByKey(value);
            pasos[index][campo] = value;
            pasos[index].nombre = c.nombre;
            pasos[index].title = c.title;
        } else {
            pasos[index][campo] = value;
        }

        this.setState({pasos: pasos});
    };

    render() {
        return (
            <div>
                <h2>Proceso nuevo</h2>
                <Form.Item label="Nombre del proceso: ">
                    <Input type={'text'} onChange={(e) => this.handleSelect('nombre',e.target.value)}/>
                </Form.Item>
                <Upload.Dragger
                    beforeUpload={(file, fileList) => {this.parseFile(file);return false;}}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="upload" />
                    </p>
                    <p className="ant-upload-text">Haz clic o arrastra un documento en esta área</p>
                    <p className="ant-upload-hint">El sistema solo soporta archivos CSV</p>
                </Upload.Dragger>

                <Divider/>
                <h2>Selección de columnas</h2>

                <Row gutter={8}>
                    <Col span={12}>
                <Form.Item label="Columna de la matrícula: ">
                    <Select style={{ width: '100%' }} onChange={(value) => this.handleSelect('matricula',value)}>
                        {this.state.columns.map((element) => (
                                <Select.Option value={element.key}>{element.title}</Select.Option>
                            )
                        )}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={12}>
                <Form.Item label="Columna de # de ticket: ">
                    <Select style={{ width: '100%' }} onChange={(value) => this.handleSelect('ticket',value)}>
                        {this.state.columns.map((element) => (
                                <Select.Option value={element.key}>{element.title}</Select.Option>
                            )
                        )}
                    </Select>
                </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                <Form.Item label="Columna de fecha de apertura: ">
                    <Select style={{ width: '100%' }} onChange={(value) => this.handleSelect('fecha_apertura',value)}>
                        {this.state.columns.map((element) => (
                                <Select.Option value={element.key}>{element.title}</Select.Option>
                            )
                        )}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={12}>
                <Form.Item label="Columna de fecha de última actualización:">
                    <Select style={{ width: '100%' }} onChange={(value) => this.handleSelect('ultima_actualizacion',value)}>
                        {this.state.columns.map((element) => (
                                <Select.Option value={element.key}>{element.title}</Select.Option>
                            )
                        )}
                    </Select>
                </Form.Item>
                    </Col>
                </Row>
                <Divider/>
                <h2>Selección de pasos</h2>
                <Form.Item label="Columnas de pasos: ">
                    <Steps direction="vertical" current={1} style={{ width: '100%' }}>
                        {this.state.pasos.map((k, index) => (
                            <Steps.Step key={index} status={'process'}  style={{ width: '100%' }}
                            title={
                                <div>
                                <Row  gutter={8} style={{ width: '100%', maxHeight:'50px' }}>
                                    <Col span={3}>
                                        <Form.Item label="Mostrar: " style={{textAlign:'center' }}>
                                            <Switch defaultChecked onChange={(checked) => this.edit(index,'mostrar',checked)}/>
                                        </Form.Item>
                                    </Col>
                                <Col span={10}>
                                    <Form.Item label="Columna: ">
                                        <Select style={{ width: '100%', marginRight: 15 }}
                                                onChange={(value) => this.edit(index,'columna_csv',value)}>
                                            {this.state.columns.map((element) => (
                                                    <Select.Option value={element.key}>{element.title}</Select.Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Nombre a mostrar: ">
                                        <Input placeholder="Paso" style={{ width: '100%', marginRight: 15 }}
                                               onChange={(e) => this.edit(index,'nombre_mostrar',e.target.value)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={1}>
                                    <Form.Item label=" " colon={false}>
                                        <Button type={'danger'}
                                                disabled={this.state.pasos.length - 1 !== index}
                                                hidden={this.state.pasos.length - 1 !== index}
                                                onClick={() => this.remove()}
                                                icon={"minus-circle-o"}/>
                                    </Form.Item>

                                </Col>
                                </Row>
                                <Divider hidden={this.state.pasos.length - 1 === index} styles={{marginTop:"12px",
                                    marginBottom:"12px"}}/>
                                </div>
                            }>
                            </Steps.Step>
                        ))}
                    </Steps>

                    <div style={{textAlign:'center'}}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> Agregar paso
                        </Button>
                    </div>
                </Form.Item>
                <div style={{textAlign:'right'}}>
                    <Button loading={this.state.loading} disabled={this.state.loading} onClick={this.uploadData} style={{marginTop:10}} className={'button-success'}><Icon type={'upload'}/> Subir datos</Button>
                </div>

            </div>
        );
    }
}
