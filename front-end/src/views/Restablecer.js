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

class Restablecer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: props.uid,
            token: props.token,
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

    componentDidMount() {
        this.validateToken();
    }

    validateToken = () => {
        this.setState({ loading: true, });
        {/* Valida que el link para cambiar la contraseña aún esté activo
        Ya que el link solo está activo por 24 hrs.
        Si ya expiró el tiempo manda mensaje de error
        y redirige a la página de Login*/}
        API.call('validate_password_token/',{uid: this.state.uid, token:this.state.token}, (response) => {
            if(response === 1) {
            } else {
                this.setState({ warning: true });
                Modal.warning({
                    title: 'Lo sentimos!',
                    content: 'El url no existe o ha expirado ',
                    onOk:() => {API.redirectTo('/login')}
                });
            }
            this.setState({ loading: false, });
        }, (response) => {
            this.setState({ loading: false, });
        }, false);
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        {/* Método que valida si la primera contraseña es igual a la contraseña de confirmación
        obtiene los valores de los campos y los compara
        si hay un error muestra un mensaje que la contraseña no coincide
        de lo contrario, se hace el cambio de contraseña*/}
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
        e.preventDefault(); {/* Método para cambiar la contraseña del usuario*/}
        this.props.form.validateFields((error, values) => {
          if (!error) {
                this.setState({ loading: true, });
                API.restCall({
                    service:'reset_password/',
                    method: "post",
                    params: {uid: this.state.uid,password:values.password, token: this.state.token},
                    success:(response) => {
                        {/* Notificación de éxito cuando se restablece la contraseña
                        redirige a la página de Login*/}
                        Notifications.openNotificationWithIcon("success","Tu contraseña se restableció con éxito","");
                        API.logout();
                        API.redirectTo("/")
                    },
                    error:(response) => {
                        {/* Notificación de error cuando no se puede restablecer la contraseña
                        redirige a la página de Login*/}
                        Notifications.openNotificationWithIcon("success","Tu contraseña se restableció con éxito","");
                        API.logout();
                        API.redirectTo("/")
                    },
                    wToken: false
                });
            }
        });
      };

    render() {

        const { getFieldDecorator } = this.props.form;

        if (this.state.redirect) {
            return (<Redirect to={'/login'}/>);
        }

        return (
            <div className="App">
                <Row>
                <Col xs={0} sm={0} md={0} lg={12} xl={14}>
                    <div className="login-image-container">
                        {/* Formulario de registro con el mensaje desplegable de cambiar contraseña*/}
                    <img className="login-image" src={loginImage} alt={''}/>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <div className="logo-image-container">
                        <img className="logo-image" src={logo} alt={''}/>
                    </div>
                    <Form.Item className="restore-title">
                        <h2>Restablecer contraseña</h2>
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Por favor ingresa la nueva contraseña' }, ,
                            {validator: this.validateToNextPassword,}],
                        })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Nueva contraseña" />
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
                        Restablecer contraseña
                        </Button> 
                    </Form.Item>
                    </Form>
                </Col>
                </Row>
            </div>           
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'restablecer' })(Restablecer);
export default WrappedNormalLoginForm;