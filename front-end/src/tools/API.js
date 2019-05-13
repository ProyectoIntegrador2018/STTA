import Cookies from 'universal-cookie';
import FetchHttpClient, {form, header, json} from "fetch-http-client/lib/index";
import Notifications from './Notifications'

export default class API {

    static bodySiteRef = null;
    static cookies = new Cookies();

    static call(service, params={}, responseFunc=(function(response){}),errorFunc=(function(response){}), wToken=true) {
        let  client = new FetchHttpClient('https://api.tramitesescolares.com.mx/');
        //let  client = new FetchHttpClient('http://localhost:8000/');
        client.addMiddleware(form());
        client.addMiddleware(json());

        if (wToken) {
            client.addMiddleware(header({'Authorization': 'Token ' + localStorage.getItem('token')}));
        }

        client.post(service, {form: params }).then(response => {
            if (response.status === 200) {
                //console.log(response.jsonData);
                return responseFunc(response.jsonData);
            } else if (response.status === 500)  {
                //console.log(response);
                Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,"");
                return errorFunc(response);
            } else {
                //console.log(response);
                if (response.jsonData) {
                    Notifications.openNotificationWithIcon('error',"",response.jsonData.detail);
                    //API.redirectTo('/login');
                } else {
                    Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,"");
                }
                return errorFunc(response);
            }
        });
    }

    static restCall(options) {
        let op = {
            method: "get",
            service: "",
            params: "",
            success: (function(response){}),
            error: (function(response){}),
            wToken: true
        }
        for (var key in options) {
            op[key] = options[key];
        }

        let  client = new FetchHttpClient('https://api.tramitesescolares.com.mx/');
        //let  client = new FetchHttpClient('http://localhost:8000/');
        client.addMiddleware(form());
        client.addMiddleware(json());
        if (op.wToken) {
            client.addMiddleware(header({'Authorization': 'Token ' + localStorage.getItem('token')}));
        }
        client[op.method](op.service, {form: op.params}).then(response => {
            //console.log(op.method)
            if (response.status === 200) {
                //console.log(response.jsonData);
                return op.success(response.jsonData);
            } else if (response.status === 500)  {
                //console.log(response);
                Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,"");
                return op.error(response);
            } else {
                //console.log(response);
                if (response.jsonData) {
                    Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,response.jsonData.detail);
                    //API.redirectTo('/login');
                } else {
                    Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,"");
                }
                return op.error(response);
            }
        });
    }

    static redirectTo(to) {
        if (API.bodySiteRef != null && API.bodySiteRef.current != null) {
            //console.log(API.bodySiteRef);
            API.bodySiteRef.current.history.push(to);
        } else {
            //API.bodySiteRef.current.history.push(to);
            //document.getElementById("site_loader").hidden = false;
            window.location.href = "/login";
        }
    }

    static validateToken() {
        if (localStorage.getItem('token') != null) {
            return true;
        } else {
            API.logout();
            return false;
        }
    }

    static logout() {
        if (localStorage.getItem('token')!= null) {
            API.call("logout/",{}, (response) => {
                //console.log(response);
                Notifications.openNotificationWithIcon('success',"Sesión cerrada con éxito","");
            });
            localStorage.removeItem('token');
            API.redirectTo('/login');
        } else {
            localStorage.removeItem('token');
            //API.cookies.remove('token');
            API.redirectTo('/login');
        }
    }

    static logoutUser() {
        if (localStorage.getItem('token')!= null) {
            API.call("logout/",{}, (response) => {
                //console.log(response);
                Notifications.openNotificationWithIcon('success',"Sesión cerrada con éxito","");
            });
            localStorage.removeItem('token');
            API.redirectTo('/');
        } else {
            localStorage.removeItem('token');
            //API.cookies.remove('token');
            API.redirectTo('/');
        }
    }
}