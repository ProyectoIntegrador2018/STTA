import React, { Component } from 'react';
import { Switch, Collapse } from 'antd';
import Charts from 'ant-design-pro/lib/Charts';
import { Pie, yuan } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import '../App.css';
import "antd/dist/antd.css";

const Panel = Collapse.Panel;

function callback(key) {
    console.log(key);
}

//Botón mensual
function onChange(checked) {
    console.log(`switch to ${checked}`);
}

// Estado de trámites academicos    QUITAR
const salesPieData = [
    {
        x: 'Baja de materias',
        y: 4544,
    },
    {
        x: 'InterCampus',
        y: 3321,
    },
    {
        x: 'Cambio de carrera',
        y: 3113,
    },
    {
        x: 'Baja temporal',
        y: 2341,
    },
];
// Estado de Transferencias como destino Monterrey    QUITAR
const salesPieData2 = [
    {
        x: 'Carta recibida por el alumno',
        y: 100,
    },
    {
        x: 'Escolar recibe carta',
        y: 220,
    },
    {
        x: 'Trámite terminado',
        y: 40,
    },
];

// Transferencia otro campus    QUITAR
const salesPieData3 = [
    {
        x: 'Director de programa autoriza',
        y: 100,
    },
    {
        x: 'Escolar origen autoriza',
        y: 220,
    },
    {
        x: 'Tesorería',
        y: 40,
    },
    {
        x: 'Escolar destino autoriza',
        y: 40,
    },
    {
        x: 'Trámite terminado',
        y: 40,
    },
];

// Baja de materias    QUITAR
const salesPieData4 = [
    {
        x: 'Escolar inicia trámite',
        y: 40,
    },
    {
        x: 'Becas autoriza',
        y: 30,
    },
    {
        x: 'DC autoriza',
        y: 10,
    },
    {
        x: 'Trámite terminado',
        y: 5,
    },
];


class DashboardView extends Component {


    render() {

        return (
            <div className="graficas">
                <div align="right">
                    <p> Mensual  <Switch defaultChecked onChange={onChange} /> </p>
                </div>
                {/* RENGLON 0 BEGIN */}
                <div className="row">
                    <div className="column"  style={{height: '400px'}} >
                        <div className="column"  style={{backgroundColor: "#088A85",width: '545px' ,height: '350px'}} >
                            <h1 style={{ color: 'white' }}>Total de trámites concluidos este mes </h1>
                            <p style={{ color: 'white', fontSize:130}}> 180 </p>
                        </div>
                    </div>
                    <div className="column" style={{height: '400px'}} >
                        <div className="column"  style={{backgroundColor: "#B4045F",width: '545px' ,height: '350px'}} >
                            <h1 style={{ color: 'white' }}>Total de usuarios </h1>
                            <p style={{ color: 'white', fontSize:130}}> 2500</p>
                        </div>
                    </div>
                </div>
                {/* RENGLON 0 END */}
                {/* RENGLON 1 BEGIN */}
                <div className="row">
                    <div className="column">
                        <h1>Trámites academicos </h1>
                        <Pie
                            hasLegend
                            title="Trámites académicos"
                            subTitle="Trámites académicos "
                            total={() => (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))
                                    }}
                                />
                            )}
                            data={salesPieData}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                            height={294}
                        />
                    </div>
                    <div className="column">
                        <h1>Trámites completados </h1>
                        <Pie percent={70} subTitle="Procesos completos" total="70%" height={294} />
                    </div>
                </div>
                {/* RENGLON 1 END*/}
                <Collapse defaultActiveKey={['1']} onChange={callback}>
                    <Panel header="Estatus Transferencias como destino Monterrey" key="1">
                        <h1>Estatus trámites transferencias como destino Monterrey </h1>
                        <Pie
                            hasLegend
                            title="Transferencias como destino Monterrey"
                            subTitle="Transferencias como destino Monterrey"
                            total={() => (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: yuan(salesPieData2.reduce((pre, now) => now.y + pre, 0))
                                    }}
                                />
                            )}
                            data={salesPieData2}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                            height={294}
                        />
                    </Panel>
                    <Panel header="Estatus de Transferencias a otros campus" key="2">
                        <h1>Estatus de Transferencias a otros campus </h1>
                        <Pie
                            hasLegend
                            title="Transferencias a otros campus"
                            subTitle="Transferencias a otros campus"
                            total={() => (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: yuan(salesPieData3.reduce((pre, now) => now.y + pre, 0))
                                    }}
                                />
                            )}
                            data={salesPieData3}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                            height={294}
                        />
                    </Panel>
                    <Panel header="Estatus de trámites baja de materias" key="3">
                        <h1>Estatus de trámites baja de materias </h1>
                        <Pie
                            hasLegend
                            title="Baja de materias"
                            subTitle="Baja de materias"
                            total={() => (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: yuan(salesPieData4.reduce((pre, now) => now.y + pre, 0))
                                    }}
                                />
                            )}
                            data={salesPieData4}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                            height={294}
                        />


                    </Panel>
                </Collapse>



            </div>
        );
    }
}

export default DashboardView;