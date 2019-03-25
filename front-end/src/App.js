import React, { Component } from 'react';

import Login from './views/Login';
import LoginUser from './views/Login-User';
import "antd/dist/antd.css";
import "ant-design-pro/dist/ant-design-pro.css";
import './App.css';

import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom'
import Procesos from "./views/Procesos";
import AppLayout from "./components/AppLayout";
import Documentos from "./views/Documentos";
import DocumentosSubir from "./views/DocumentosSubir";
import Restablecer from './views/Restablecer';
import Register from './views/Registro';
import API from "./tools/API";
import ProcesoNuevo from "./views/ProcesoNuevo";
import AppLayoutUser from './components/AppLayoutUser';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            toLogin:false
        };
        API.bodySiteRef = React.createRef();
    }

    componentWillMount(){
        console.log("A");

    }

    componentDidMount(){
        document.getElementById("site_loader").remove();

    }


    render() {
    return (
            <Router className="App" ref={API.bodySiteRef}>
                <div>
                    <Route exact path="/" component={this.LoginUserView} />
                    <Route exact path="/dashboard" component={this.DashboardView} />
                    <Route exact path="/procesos" component={this.ProcesosView} />
                    <Route exact path="/proceso/nuevo" component={this.ProcesoNuevoView} />
                    <Route exact path="/estudiantes" component={this.EstudiantesView} />
                    <Route exact path="/administradores" component={this.AdministradoresView} />
                    <Route exact path="/documentos" component={this.DocumentosView} />
                    <Route exact path="/documentos/subir" component={this.DocumentosSubirView} />
                    <Route exact path="/restaurar/:uid/:token" component={this.Restaurar} />
                    <Route exact path="/login" component={this.LoginView} />
                    <Route exact path="/registro" component={this.RegisterView} />
                    <Route exact path="/mistramites" component={this.EstudentView} />
                </div>
            </Router>
    );
  }

    Restaurar = ({match}) => {
        return (<Restablecer uid={match.params.uid} token={match.params.token}/>);
    };

    LoginView = () => {
        return (<Login/>);
      };

    LoginUserView = () => {
        return (<LoginUser/>);
    }

    RegisterView = () => {
        return (<Register/>);
    }

    EstudentView = () => {
        return (
            <AppLayoutUser type={"basic"}>
            
            </AppLayoutUser>
        )
    }

    DashboardView = () => {

        return (
            <AppLayout view={"0"} type={"basic"}>

            </AppLayout>
        );
    };

    AdministradoresView = () => {
        return (
            <AppLayout view={"1"} type={"basic"}>

            </AppLayout>
        );
    };


    EstudiantesView = () => {
        return (
            <AppLayout view={"2"} type={"basic"}>

            </AppLayout>
        );
    };

    ProcesosView = () => {
        return (
            <AppLayout view={"3"} type={"basic"}>
                <Procesos/>
            </AppLayout>
        );
    };


    DocumentosView = () => {
        return (
            <AppLayout view={"4"} type={"basic"}>
                <Documentos/>
            </AppLayout>
        );
    };

    DocumentosSubirView = () => {
        return (
            <AppLayout view={"4"} type={"basic"}>
                <DocumentosSubir/>
            </AppLayout>
        );
    };

    ProcesoNuevoView = () => {
        return (
            <AppLayout view={"3"} type={"basic"}>
                <ProcesoNuevo/>
            </AppLayout>
        );
    };
}


export default App;
