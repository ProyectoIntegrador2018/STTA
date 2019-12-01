import React, { Component } from 'react';
import Login from './views/Login';
import "antd/dist/antd.css";
import "ant-design-pro/dist/ant-design-pro.css";
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
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
import CartaSolicitar from "./views/CartaSolicitar";
import FormatoCartas from "./views/FormatoCartas"
import EditarCarta from './views/EditarCarta';
import EditarFormatoCartas from "./views/EditarFormatoCartas"
import FormatoSubir from "./views/FormatoSubir"
import AdminBaseDatos from "./views/AdminBaseDatos"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toLogin: false
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
          <Route exact path="/" component={this.LoginView} />
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
          <Route exact path="/registro" component={this.RegisterView} />
          <Route exact path="/tramite" component={this.StudentView} />
          <Route exact path="/tramite/:id" component={this.AlumnosAdminTramiteView} />
          <Route exact path="/cartasSolicitadas" component={this.CartasSolicitadasView} />
          <Route exact path="/cartas" component={this.CartaSolicitarView} />
          <Route exact path="/cartas/editar/:carta_id/:student_id" component={this.EditarCartaView} />
          <Route exact path="/formatoCartas" component={this.FormatoCartasView} />
          <Route exact path="/formatoCartas/editar/:id" component={this.EditarFormatoCartasView} />
          <Route exact path="/formatoCartas/subir" component={this.FormatoSubirView} />
          <Route exact path="/adminBD" component={this.AdminBaseDatosView} />
        </div>
      </Router>
    );
  }

  Restaurar = ({ match }) => {
    return (<Restablecer uid={match.params.uid} token={match.params.token} />);
  };
  LoginView = () => {
    return (<Login />);
  };
  RegisterView = () => {
    return (<Register />);
  };
  StudentView = () => {
    return (
      <AppLayoutUser type={"basic"}>
        <Estudiante />
      </AppLayoutUser>
    )
  };

  DashboardView = () => {
    return (
      <AppLayout view={"0"} type={"basic"}>
        <DashboardView />
      </AppLayout>
    );
  };
  AdministradoresView = () => {
    return (
      <AppLayout view={"1"} type={"basic"}>
        <Administradores />
      </AppLayout>
    );
  };
  AlumnosTramiteView = ({ match }) => {
    return (
      <AppLayoutUser type={"basic"}>
        <Tramite id={match.params.id} />
      </AppLayoutUser>
    );
  };
  AlumnosAdminTramiteView = ({ match }) => {
    return (
      <AppLayout type={"basic"}>
        <Tramite id={match.params.id} />
      </AppLayout>
    );
  };
  AlumnosView = () => {
    return (
      <AppLayout type={"basic"}>
        <Alumnos />
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
        <Procesos />
      </AppLayout>
    );
  };
  DocumentosView = () => {
    return (
      <AppLayout view={"4"} type={"basic"}>
        <Documentos />
      </AppLayout>
    );
  };
  DocumentosSubirView = () => {
    return (
      <AppLayout view={"4"} type={"basic"}>
        <DocumentosSubir />
      </AppLayout>
    );
  };
  ProcesoNuevoView = () => {
    return (
      <AppLayout view={"3"} type={"basic"}>
        <ProcesoNuevo />
      </AppLayout>
    );
  };
  TramitesView = () => {
    return (
      <AppLayout view={"5"} type={"basic"}>
        <TramitesAdmin />
      </AppLayout>
    );
  };
  CartasSolicitadasView = () => {
    return (
      <AppLayout view={"7"} type={"basic"}>
        <CartasSolicitadasView />
      </AppLayout>
    );
  };

  FormatoCartasView = () => {
    return (
      <AppLayout view={"8"} type={"basic"}>
        <FormatoCartas />
      </AppLayout>
    );
  };

  EditarFormatoCartasView = (props) => {
    return (
      <AppLayout view={"8"} type={"basic"} {...props}>
        <EditarFormatoCartas {...props} />
      </AppLayout>
    );
  };

  FormatoSubirView = () => {
    return (
      <AppLayout view={"8"} type={"basic"}>
        <FormatoSubir />
      </AppLayout>
    );
  };

  CartaSolicitarView = () => {
    return (
      <AppLayout view={"9"} type={"basic"}>
        <CartaSolicitar />
      </AppLayout>
    );
  };

  EditarCartaView = (props) => {
    return (
      <AppLayout view={"9"} type={"basic"} {...props}>
        <EditarCarta {...props} />
      </AppLayout>
    );
  };

  AdminBaseDatosView = () => {
    return (
      <AppLayout view={"10"} type={"basic"}>
        <AdminBaseDatos />
      </AppLayout>
    );
  };
}

export default App;
