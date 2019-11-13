import React, { Component } from 'react';
import {
  Icon, Upload, Form, Divider, Button, Input, Steps, Select, Switch, Row, Col, Modal
} from 'antd';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class ProcesoNuevo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      columns: [],
      disabled: true,
      nombre: "",
      pasos: []
    }
  }

  refreshData = () => { };

  componentWillMount() {
    this.refreshData();
  }

  getColumnByKey = (key) => {
    return this.state.columns[key];
  };

  uploadData = () => {

    let params = {
      nombre: this.state.nombre,
      pasos: this.state.pasos
    };

    if (params.nombre == "" || params.pasos == "") {
      Notifications.openNotificationWithIcon("warning", "Verifica que todos los campos estén completos", "")
    } else {
      Modal.confirm({
        title: 'Estos son los datos a subir:',
        content: <div>
          <b><label>Nombre: </label></b> {params.nombre}<br />
          <Divider />
          {params.pasos.map((p) => <div>
            <b> <label># de paso: </label></b> {p.numero}<br />
            <b> <label>Nombre: </label></b> {p.nombre}<br />
            <b> <label>Mostrar: </label></b> {p.mostrar ? 'Sí' : 'No'}<br />
            <Divider />
          </div>)}
        </div>,
        onOk: () => {
          params = {
            nombre: this.state.nombre,
            num_pasos: this.state.pasos.length,
            pasos: JSON.stringify(this.state.pasos)
          };
          this.setState({ loading: true });
          console.log(this.state.pasos)
          API.call('agregar-proceso/', params, (response) => {
            Notifications.openNotificationWithIcon("success", "¡Proceso nuevo creado exitosamente!", "")
            API.redirectTo('/procesos');
            this.setState({ loading: false });
          }, (response) => { this.setState({ loading: false }); });
        },
        cancelText: "Cancelar",
        onCancel() {
          //console.log('Cancel');
        }
      });
    }
  };

  handleSelect = (name, keyvalue) => {
    this.setState({ [name]: keyvalue });
  };

  add = () => {
    this.state.pasos.push({ nombre: "", mostrar: true, numero: this.state.pasos.length + 1 });
    this.setState({ pasos: this.state.pasos });
  };

  remove = () => {
    this.state.pasos.splice(-1, 1);
    this.setState({ pasos: this.state.pasos });
  };

  edit = (index, campo, value) => {
    let pasos = this.state.pasos;
    if (campo === 'columna_csv') {
      let c = this.getColumnByKey(value);
      pasos[index][campo] = value;
      pasos[index].nombre = c.nombre;
      pasos[index].title = c.title;
    } else {
      pasos[index][campo] = value;
    }

    this.setState({ pasos: pasos });
  };

  render() {
    return (
      <div><h2>Proceso nuevo</h2>
        <Form.Item label="Nombre del proceso: "><Input type={'text'} onChange={(e) => this.handleSelect('nombre', e.target.value)} /></Form.Item>
        <Divider /><h2>Selección de pasos</h2>
        <Form.Item label="Columnas de pasos: "><Steps direction="vertical" current={1} style={{ width: '100%' }}>
          {this.state.pasos.map((k, index) => (<Steps.Step key={index} status={'process'} style={{ width: '100%' }}
            title={
              <div>
                <Row gutter={8} style={{ width: '100%', maxHeight: '50px' }}>
                  <Col span={3}><Form.Item label="Mostrar: " style={{ textAlign: 'center' }}><Switch defaultChecked onChange={(checked) => this.edit(index, 'mostrar', checked)} /></Form.Item></Col>
                  <Col span={10}><Form.Item label="Nombre: "><Input placeholder="Paso" style={{ width: '100%', marginRight: 15 }} onChange={(e) => this.edit(index, 'nombre', e.target.value)} /></Form.Item></Col>
                  <Col span={1}><Form.Item label=" " colon={false}><Button type={'danger'} disabled={this.state.pasos.length - 1 !== index} hidden={this.state.pasos.length - 1 !== index} onClick={() => this.remove()} icon={"minus-circle-o"} /></Form.Item></Col>
                </Row>
                <Divider hidden={this.state.pasos.length - 1 === index} styles={{ marginTop: "12px", marginBottom: "12px" }} />
              </div>
            }>
          </Steps.Step>
          ))}
        </Steps>
          <div style={{ textAlign: 'center' }}><Button type="dashed" onClick={this.add} style={{ width: '60%' }}> <Icon type="plus" /> Agregar paso </Button></div>
        </Form.Item>
        <div style={{ textAlign: 'right' }}><Button loading={this.state.loading} disabled={this.state.loading} onClick={this.uploadData} style={{ marginTop: 10 }} className={'button-success'}><Icon type={'upload'} /> Crear Proceso</Button></div>
      </div>
    );
  }
}
