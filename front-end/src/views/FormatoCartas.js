import React, { Component } from 'react';
import {
  Icon, Button, Modal, Collapse,
} from 'antd';
import DataTable from "../components/DataTable";
import { Link } from 'react-router-dom'
import API from "../tools/API";
import { setState } from '../tools/common';
import moment from 'moment';

const Panel = Collapse.Panel;

function callback(key) {
  console.log(key);
}


export default class FormatoCartas extends Component {

  constructor(props) {
    super(props);
    this.state = setState();
  }

  refreshData = () => {
    this.setState({ loading: true });
    API.restCall({
      service: 'obtener_cartas/',
      method: "get",
      params: "",
      success: (response) => {
        console.log(response)
        this.setState({ data: response, loading: false });
      },
      error: (response) => { this.setState({ loading: false }) },
    });

  };

  deleteFiles = (rows) => {
    this.setState({ loading: true });
    API.call('eliminar_cartas/', { cartas: JSON.stringify(rows) }, (response) => {
      this.setState({ loading: false });
      this.refreshData();
    }, (response) => { this.setState({ loading: false }) });
  };

  editFiles = (rows) => {
    window.location.href = '/formatoCartas/editar/' + rows[0].id
  };
  componentWillMount() {
    this.refreshData();
  }

  showContent = (record) => {
    let data = JSON.parse(record.contenido_subido);
    this.setState({ cols: data.cols, data2: data.data, visible: true, record: record });
  };
  render() {
    let botonsubir
    let permitirBorrar
    botonsubir = <Link to={'/formatoCartas/subir'}><Button style={{ float: 'right' }} type="secondary" icon="upload" >Subir nuevo formato de carta</Button></Link>
    permitirBorrar = true
    return (
      <div>
        {botonsubir}
        <h1><Icon type="file-text" /> Formato de Cartas</h1>
        <Collapse defaultActiveKey={['0']} onChange={callback}>
          <Panel header="Instrucciones" key="1"> <p>{"Si quiere saber más sobre como crear una carta presione el siguiente botón:"}</p> <Button key="instructions" icon="question-circle" href="https://docs.google.com/document/d/15ReAuFoavQNVQSqVvKKkB6zbbe79Tt57OqfHdfQ5eeQ/edit?usp=sharing">Aprender Más</Button> </Panel>
        </Collapse>
        <DataTable loading={this.state.loading} data={this.state.data} deleteFunc={this.deleteFiles} editFunc={this.editFiles} canEdit={true} rowSelection={permitirBorrar}
          columns={[
            { title: 'Nombre', key: 'descripcion', },
            { title: 'Archivo', key: 'nombre_carta', },
            // { title: 'Admin', key: 'nombre', },
            { title: 'Fecha', key: 'fecha_creacion', },
          ]} />
        <Modal width={1300} title={this.state.record.nombre} visible={this.state.visible} onCancel={() => { this.setState({ visible: false }) }}
          footer={[
            <Button key="back" onClick={() => { this.setState({ visible: false }) }}>Cancelar</Button>,
            <Button key="submit" type="primary" onClick={() => { this.setState({ visible: false }) }}> OK </Button>,]}>
          <div style={{ textAlign: 'right' }}><h3>{moment(this.state.record.fecha).format('DD-MMM-YYYY')}</h3></div>
          <DataTable columns={this.state.cols} data={this.state.data2} />
        </Modal>
      </div>
    );
  }
}
