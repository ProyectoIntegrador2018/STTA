import React, { Component } from 'react';
import {
  Icon, Button, Form, Collapse, Input
} from 'antd';
import { Link } from 'react-router-dom'
import API from "../tools/API";

const Panel = Collapse.Panel;


export default class EditarFormatoCartas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      descripcion: null
    }
  }

  editData = () => {
    const id = this.props.match.params.id;
    const descripcion = this.state.descripcion
    this.setState({ loading: true });
    API.call('editar_cartas/', { carta: JSON.stringify({ id, descripcion }) }, (response) => {
      this.props.history.push('/formatoCartas/');
    }, (response) => { this.setState({ loading: false }) });

  };

  handleChange = (descripcion) => {
    this.setState({ descripcion });
  }

  render() {
    return (
      <div>
        <h1><Icon type="file-text" /> Editar Formato de Cartas</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            <Input
              placeholder="Descripción"
              onChange={event =>
                this.handleChange(event.target.value)
              }
            />,
        </Form.Item>
          <Form.Item>
            <Button onClick={this.editData} type="primary" htmlType="submit" className="login-form-button">
              Guardar
          </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
