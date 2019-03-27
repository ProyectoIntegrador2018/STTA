import React, { Component } from 'react';
import {
    Icon, Upload, Form, Divider,Button, Input, Steps, Select,Switch, Row, Col, Modal
} from 'antd';
import API from "../tools/API";
import Notifications from "../tools/Notifications";

export default class Tramite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            columns: [],
            disabled: true,

            ultima_actualizacion:"",
            fecha_apertura:"",
            pasos:[]
        }
    }

    refreshData = () => {

    };

    render() {
        return (
            <div>
                <h2>Mi trámite</h2>
                
            </div>
        );
    }
}
