import React, { Component } from 'react';
import {
  Icon, Button, Modal, Divider, Input, Form,
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import moment from 'moment';
import Select from "antd/lib/select";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { toFileBlob } from '../tools/common';

export default class CartaSolicitar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      idCarta: -1,
      type: '',
      label: '',
      idAlumno: -1,
      cartas: [],
      alumnos: [],
      carta: ''
    }
  }

  componentWillMount() {
    this.refreshData();
  }

  handleChange(event) {
    console.log(event.target.value)
    this.setState({ value: event.target.value });
  }

  refreshData = () => {
    this.setState({ loading: true });

    API.restCall({
      service: 'obtener_cartas/',
      method: "get",
      params: "",
      success: (response) => {
        console.log(response)
        this.setState({ cartas: response, loading: false });
      },
      error: (response) => { this.setState({ loading: false }) },
    });

    API.restCall({
      service: 'obtener_alumnos/',
      method: "get",
      params: "",
      success: (response) => {
        console.log(response)
        this.setState({ alumnos: response, loading: false });
      },
      error: (response) => { this.setState({ loading: false }) },
    });
  };

  printLetter = () => {
    const axios = require('axios');
    axios(API.apiLocal + 'obtener_carta/' + this.state.idAlumno + "/" + this.state.idCarta + "/" + localStorage.getItem('id'), {
      method: 'GET',
      responseType: 'blob' //Force to receive data in a Blob Format
    })
      .then(response => {
        toFileBlob(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  previewLetter = () => {
    const axios = require('axios');
    axios(API.apiLocal + 'preview_carta/' + this.state.idAlumno + "/" + this.state.idCarta + "/" + localStorage.getItem('id'), {
      method: 'GET',
      responseType: 'blob' //Force to receive data in a Blob Format
    })
      .then(response => {
        toFileBlob(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  editarCarta = () => {
    window.location.href = '/cartas/editar/' + this.state.idCarta + '/' + this.state.idAlumno
  }

  render() {
    let cartasItems = this.state.cartas.map((carta) => <Select.Option key={carta.id}>{carta.descripcion}</Select.Option>);

    let alumnosItems = this.state.alumnos.map((alumno) => <Select.Option key={alumno.id} title={alumno.nombre}>{alumno.matricula}</Select.Option>);

    return (
      <div>
        <Button style={{ float: 'right' }}
          onClick={this.printLetter}
          type="secondary"
          icon="printer">
          Solicitar
        </Button>
        <Button style={{ float: 'right', 'marginRight': '10px' }}
          onClick={this.previewLetter}
          type="secondary"
          icon="eye">
          Vista Previa
        </Button>
        <Button style={{ float: 'right', 'marginRight': '10px' }}
          onClick={this.editarCarta}
          type="secondary"
          icon="edit">
          Editar
        </Button>
        <h1><Icon type="solution" /> Cartas y Constancias</h1>

        <br></br>
        <p>Las constancias académicas (cartas oficiales) incluyen el nombre completo y su número de matrícula y de acuerdo al tipo de documento que se solicite, especificará la información correspondiente</p>

        {/* Cartas select */}
        <div style={{ maxWidth: "550px", margin: "0 auto" }}>
          <Select defaultValue="Seleccionar carta o constancia"
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            optionFilterProp="children"
            onChange={(value) => {this.setState({ idCarta: value }); }}
            autosize={false}
            style={{ width: "100%" }}>
            {cartasItems}
          </Select>
        </div>

        <br></br>

        {/* Alumnos select */}
        <div style={{ maxWidth: "550px", margin: "0 auto" }}>
          <Select defaultValue="Seleccionar alumno"
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            optionFilterProp="children"
            onChange={(value) => {
              this.setState({ idAlumno: value });
            }}
            autosize={false}
            style={{ width: "100%" }}>
            {alumnosItems}
          </Select>
        </div>

        <br></br>

        <table width="100%">
          <thead>
            <tr style={{ backgroundColor: "#D3D3D3" }}><th id="TituloCarta" colSpan="2">{this.state.selectedOption}</th></tr>
          </thead>
          <br></br>
          <tr>
            <th width="200px">Descripción: </th>
            <td id="descInfo">Carta donde especifica que el alumno se encuentra inscrito en cierto periodo incluyendo el listado de materias inscritas, así como el promedio acumulado y el promedio del semestre anterior.</td>
          </tr>
          <br></br>
          <tr>
            <th>Requisitos: </th>
            <td id="reqInfo">Ser alumno inscrito en el periodo académico vigente en Campus Monterrey</td>
          </tr>
        </table>

      </div>

    );
  }
}
