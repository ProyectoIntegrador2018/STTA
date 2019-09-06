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
import Tramite from './views/Tramite';
import Estudiante from './views/Estudiante';
import Administradores from './views/Administradores';
import Alumnos from './views/Alumnos';
import TramitesAdmin from "./views/TramitesAdmin";
import DashboardView from "./views/DashboardView";
import CartasSolicitadasView from "./views/CartasSolicitadasView";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toLogin:false
        };
        API.bodySiteRef = React.createRef();
    }

    componentDidMount() {
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
                        <Route exact path="/administradores" component={this.AdministradoresView} />
                        <Route exact path="/alumnos" component={this.AlumnosView} />
                        <Route exact path="/alumnos/tramite/:id" component={this.AlumnosTramiteView} />
                        <Route exact path="/tramites" component={this.TramitesView} />
                        <Route exact path="/documentos" component={this.DocumentosView} />
                        <Route exact path="/documentos/subir" component={this.DocumentosSubirView} />
                        <Route exact path="/restaurar/:uid/:token" component={this.Restaurar} />
                        <Route exact path="/login" component={this.LoginView} />
                        <Route exact path="/registro" component={this.RegisterView} />
                        <Route exact path="/tramite" component={this.StudentView} />
                        <Route exact path="/tramite/:id" component={this.AlumnosAdminTramiteView} />
                        <Route exact path="/cartasSolicitadas" component={this.CartasSolicitadasView} />

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
    };
    RegisterView = () => {
        return (<Register/>);
    };
    StudentView = () => {
        return (
            <AppLayoutUser type={"basic"}>
                <Estudiante/>
            </AppLayoutUser>
        )
    };
    DashboardView = () => {
        return (
            <AppLayout view={"0"} type={"basic"}>
                <DashboardView/>
            </AppLayout>
        );
    };
    AdministradoresView = () => {
        return (
            <AppLayout view={"1"} type={"basic"}>
                <Administradores/>
            </AppLayout>
        );
    };
    AlumnosTramiteView = ({match}) => {
        return (
            <AppLayoutUser type={"basic"}>
                <Tramite id={match.params.id}/>
            </AppLayoutUser>
        );
    };
    AlumnosAdminTramiteView = ({match}) => {
        return (
            <AppLayout type={"basic"}>
                <Tramite id={match.params.id}/>
            </AppLayout>
        );
    };
    AlumnosView = () => {
        return (
            <AppLayout type={"basic"}>
                <Alumnos/>
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
    TramitesView = () => {
        return (
            <AppLayout view={"5"} type={"basic"}>
                <TramitesAdmin/>
            </AppLayout>
        );
    };
    CartasSolicitadasView = () => {
        return (
            <AppLayout view={"7"} type={"basic"}>
                <CartasSolicitadasView/>
            </AppLayout>
        );
    };
}

export default App;
