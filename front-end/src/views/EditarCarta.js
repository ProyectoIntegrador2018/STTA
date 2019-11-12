import React, { Component } from 'react';
import {
  Icon, Button, Form, Collapse, Input
} from 'antd';
import { Link } from 'react-router-dom'
import API from "../tools/API";
import axios from 'axios'

const Panel = Collapse.Panel;


export default class EditarFormatoCartas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: null,
      loading: true
    }

    this.loadData();
  }

  loadData = () => {
    const carta_id = this.props.match.params.carta_id;
    const student_id = this.props.match.params.student_id;
    axios(API.apiLocal + 'obtener_carta_para_editar/' + student_id + "/" + carta_id + "/" + localStorage.getItem('id'), {
      method: 'GET',
      responseType: 'json'
    })
      .then(response => {
        //Create a Blob from the PDF Stream
        this.setState({ content: response.data.carta, loading: false })
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  printLetter = () => {
    axios.post(API.apiLocal + 'html_to_pdf',
      {
        content: this.state.content,
        student_id: this.props.match.params.student_id,
        carta_id: this.props.match.params.carta_id,
        admin_id: localStorage.getItem('id')
      },
      {
        responseType: 'blob', //Force to receive data in a Blob Format,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        //Create a Blob from the PDF Stream
        const file = new Blob(
          [response.data],
          { type: 'application/pdf' });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChange = (content) => {
    this.setState({ content });
  }

  render() {
    if (this.state.loading) {
      return (<div />)
    }

    return (
      <div>
        <h1><Icon type="file-text" /> Editar Carta</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            <Input.TextArea
              placeholder="Descripción"
              value={this.state.content}
              rows={17}
              size="large"
              autoSize
              onChange={event =>
                this.handleChange(event.target.value)
              }
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.printLetter} type="primary" htmlType="submit" className="login-form-button">
              Imprimir
          </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
