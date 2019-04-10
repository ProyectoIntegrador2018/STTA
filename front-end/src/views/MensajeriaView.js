import React, { Component } from 'react';
import {
    Icon, Button, Modal, List
} from 'antd';
import DataTable from "../components/DataTable";
import { Link } from 'react-router-dom'
import API from "../tools/API";

export default class MensajeriaView extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    refreshData = () => {
        API.restCall({
            service:'usuarios_chat/',
            success: (response)=>{

            },
            error: (response)=>{

            },
            wToken: true
        })
    };

    componentWillMount() {
        this.refreshData();
    }


    render() {
        return (
            <div>
                <List
                    size="small"
                    header={<div>Usuarios registrados en el chat</div>}
                    bordered
                    dataSource={[]}
                    renderItem={item => (<List.Item>{item}</List.Item>)}/>
            </div>
        );
    }
}
