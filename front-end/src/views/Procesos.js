import React, { Component } from 'react';
import {
    Icon, Button, Modal, Form, Input
} from 'antd';
import DataTable from "../components/DataTable";
import API from "../tools/API";
import { Link } from 'react-router-dom'
import moment from 'moment';

class ProcesosForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            loading:true,
            data: []
        }
    }

    refreshData = () => {
        this.setState({loading:true});
        API.call('procesos/',[], (response) => {
            this.setState({data: response, loading:false});
        });
    };

    componentWillMount() {
        this.refreshData();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((error, values) => {
            if (!error) {
                //console.log('Valores recibidos ', values);
            }
        });
    };

    deleteProcs = (rows) => {
        this.setState({loading:true});
        API.call('borrar-procesos/', {procesos:JSON.stringify(rows)}, (response) => {

            this.setState({ loading:false});
            this.refreshData();
        }, () => {this.setState({ loading:false});});
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        let permitirBorrar
        let botonAgregar

        if (localStorage.getItem("tipo") == '2') {
            botonAgregar = <Link to={'/proceso/nuevo'}> <Button style={{float:'right'}} type="secondary" icon="plus" disabled>
                    Agregar proceso nuevo</Button></Link>

            permitirBorrar=false
        }
        else {
            botonAgregar = <Link to={'/proceso/nuevo'}> <Button style={{float:'right'}} type="secondary" icon="plus">
                    Agregar proceso nuevo</Button></Link>

            permitirBorrar=true
            
        }

        return (
            <div>  

                {botonAgregar}
    
                <h1><Icon type="cluster" /> Procesos</h1>
                    <DataTable data={this.state.data} loading={this.state.loading}
                               deleteFunc={this.deleteProcs} rowSelection={permitirBorrar}
                           columns={[
                               {title: 'Nombre del proceso',key: 'nombre', },
                               {title: 'Pasos',key: 'pasos',},
                               {title: 'Fecha de creación',key: 'fecha',
                               render: (text, record) => (
                                <div style={{textAlign:'center'}}>
                                    <div>{moment(text).format('DD-MMM-YYYY')}</div>
                                </div>
                                ),}
                               ]}/>
                <Modal
                    title="Agregar proceso nuevo"
                    visible={this.state.visible}
                    onCancel={() => {this.setState({visible:false})}}
                    footer={[
                        <Button key="back" onClick={() => {this.setState({visible:false})}}>Cancelar</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleSubmit}>
                            OK
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal" className={'form-normal'}>
                        <Form.Item label="Nombre del procesos" type="text">
                            {getFieldDecorator('proceso', {
                                rules: [{ required: true, message: 'Por favor escribe un nombre para el proceso' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const Procesos = Form.create({ name: 'normal_login' })(ProcesosForm);
export default Procesos;