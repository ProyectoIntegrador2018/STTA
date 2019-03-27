import React, { Component } from 'react';
import '../App.css';
import {
    Form, Icon, Input, Button, Row, Col,Modal
  } from 'antd';
import {Redirect} from 'react-router-dom';
import loginImage from '../images/stte.png';
import logo from '../images/logo.png';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

class Registro extends Component {

    constructor(props) {
        super(props);

        this.state = {
            confirmDirty: false,
            loading: false,
            warning: false,
            redirect:false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
        this.validateToNextPassword = this.validateToNextPassword.bind(this);
    }

    handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('La contraseña no coincide con la introducida previamente');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((error, values) => {
          if (!error) {
              this.setState({ loading: true, });
              API.call('registro-estudiante/',{nombre: values.name, apellido: values.lastName, email: values.userName, password:values.password},(response)=>{
                  if(response === 1){
                      Notifications.openNotificationWithIcon("success","Tu cuenta ha sido creada con éxito","");
                      API.redirectTo('/')
                  }
                  this.setState({ loading: false, });

              },(response)=>{this.setState({ loading: false, });},false);
          }
        });
      };

    render() {

        const { getFieldDecorator } = this.props.form;


        return (
            <div className="App">
                <Row>
                <Col xs={0} sm={0} md={0} lg={12} xl={14}>
                    <div className="login-image-container">
                    <img className="login-image" src={loginImage} alt={''}/>
                    </div>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <div className="logo-image-container">
                        <img className="logo-image" src={logo} alt={''}/>
                    </div>
                    <Form.Item className="restore-title">
                        <h2 className="admin-login-title">Registro de nueva cuenta</h2>
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Por favor ingresa tu nombre' }],
                        })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nombre" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('lastName', {
                        rules: [{ required: true, message: 'Por favor ingresa tus apellidos' }],
                        })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Apellidos" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Por favor ingresa tu correo electrónico (A00...)' }],
                        })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Correo electrónico (A0...@itesm.mx)" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Por favor ingresa la contraseña' }, ,
                            {validator: this.validateToNextPassword,}],
                        })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('passwordVerification', {
                        rules: [{ required: true, message: 'Por favor ingresa la verificación de la contraseña' }, {
                            validator: this.compareToFirstPassword,
                        }],
                        })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Verificar contraseña" onBlur={this.handleConfirmBlur}/>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={this.state.loading} disabled={this.state.loading}>
                            Crear cuenta
                        </Button> 
                    </Form.Item>
                    </Form>
                </Col>
                </Row>
            </div> 
        );
    }
}

const WrappedNormalRegisterForm = Form.create({ name: 'restablecer' })(Registro);
export default WrappedNormalRegisterForm;