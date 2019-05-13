import React, { Component } from 'react';
import {
    Icon, Button, Modal, Form, Input
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import moment from 'moment';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component {
      render() {
        const {
          visible, onCancel, onCreate, form, loading
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="Registro de nuevo administrador"
                okText="Enviar"
                onCancel={onCancel}
                okButtonProps={{ disabled: loading, loading:loading }}
                onOk={onCreate}>
                <Form layout="vertical">
                    <Form.Item label="Nombre del administrador" type="user">
                        {getFieldDecorator('nombre', {
                        rules: [{ required: true, message: 'Por favor introduce el nombre del administrador' }],
                        })(
                        <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="Correo electrónico" type="email">
                        {getFieldDecorator('correo', {
                        rules: [{ required: true, message: 'Por favor introduce su correo electrónico' }],
                        })(
                        <Input />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )}
    }
);

export default class Administradores extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            data2:[],
            loading:true,
            record:{},
            cols:[],
        }
    }

    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({ visible: true });
    };
    
    handleCancel = () => {
        this.setState({ visible: false });
    };

    refreshData = () => {
        this.setState({loading:true});
        API.restCall({
            service:'return_admins/',
            method: "get",
            params: "",
            success:(response) => {
                this.setState({data: response, loading:false});
            },
            error:(response) => {this.setState({ loading: false })},
        });
    };

    deleteAdmin = (rows) => {
        this.setState({loading:true});
        API.call('eliminar_administradores/',{admin:JSON.stringify(rows)}, (response) => {
            this.setState({ loading:false});
            this.refreshData();
        }, (response) => {this.setState({ loading:false})});
    };

    componentWillMount() {
        this.refreshData();
    }

    showContent = (record) => {
        let data = JSON.parse(record.contenido_subido);
        this.setState({cols:data.cols, data2:data.data, visible:true,record:record});
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
    
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
    
            this.setState({ loading: true });
            form.resetFields();
            API.call('agregar_administrador/', {nombre: values.nombre, email: values.correo}, (response) => {
                this.setState({ visible: false  });
                this.setState({ loading: false  });
                this.refreshData();
            }, (response) => {
                this.setState({ visible: false  });
                this.setState({ loading: false  });
            });
        });
    };

    render() {
        return (
            <div>
                <Button style={{float:'right'}} onClick={this.showModal} type="secondary" icon="plus">
                    Agregar administrador</Button>
                <h1><Icon type="user" /> Administradores</h1>
                <DataTable loading={this.state.loading} data={this.state.data}
                           deleteFunc={this.deleteAdmin} rowSelection={true}
                columns={[{
                    title: 'Nombre del administrador',
                    key: 'nombre',

                }, {
                    title: 'Email',
                    key: 'email',

                }, {
                    title: 'Último login',
                    key: 'last_login',
                    render: (text, record) => (
                        <div style={{textAlign:'center'}}>
                            <div>{moment(text).format('DD-MMM-YYYY')}</div>
                        </div>
                    )
                }
                ]}/>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}/>
            </div>
        );
    }
}
