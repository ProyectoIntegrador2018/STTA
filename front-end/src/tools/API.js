import Cookies from 'universal-cookie';
import FetchHttpClient, {form, header, json} from "fetch-http-client/lib/index";
import Notifications from './Notifications'

export default class API {

    static bodySiteRef = null;
    static cookies = new Cookies();

    static call(options){
        // Default options
        let op = {
            url:"http://vitau-api.us-west-2.elasticbeanstalk.com",
            //url:"http://localhost:8000",
            method: "get",
            service: "",
            params: "",
            tokenType: "Bearer",
            success: (function(response){}),
            error: (function(response){}),
            credentials: true,
            contentType: "form",
            multipart:false
        };

        // Replacing default options
        for (let key in options){
            op[key] = options[key];
        }

        // Creating a new client
        let client = new FetchHttpClient(op.url);

        // Content-Type: application/json
        client.addMiddleware(form());
        client.addMiddleware(json());
        if(op.credentials){
            client.addMiddleware(header({'Authorization': op.tokenType + " " + localStorage.getItem('token')}));
        }
        let params = {};
        if (op.multipart){
            let formData = new FormData();

            for (var k in op.params){
                if (op.params.hasOwnProperty(k)) {
                    formData.append(k, op.params[k])
                }
            }
            params['body'] = formData;
        }else{
            params[op.contentType] = op.params;
        }
        //Performing the request
        client[op.method](op.service, params).then(response => {
            console.log(op.method)
            if (response.status < 300) {
                console.log(response.jsonData);
                return op.success(response.jsonData);
            }else {
                console.log(response);
                return op.error(response);
            }
        });
    }

    static restCall(options){
        let op = {
            method: "get",
            service: "",
            params: "",
            success: (function(response){}),
            error: (function(response){}),
            wToken: true
        }
        for (var key in options){
            op[key] = options[key];
        }

        let  client = new FetchHttpClient('http://127.0.0.1:8000/');
        client.addMiddleware(form());
        client.addMiddleware(json());
        if(op.wToken){
            client.addMiddleware(header({'Authorization': 'Token ' + localStorage.getItem('token')}));
        }
        client[op.method](op.service, {form: op.params}).then(response => {
            console.log(op.method)
            if (response.status === 200) {
                console.log(response.jsonData);
                return op.success(response.jsonData);
            }else if (response.status === 500)  {
                console.log(response);
                Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,"");
                return op.error(response);
            }else{
                console.log(response);
                if (response.jsonData){
                    Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,response.jsonData.detail);
                    //API.redirectTo('/login');
                }else{
                    Notifications.openNotificationWithIcon('error',response.status + ' ' + response.statusText,"");
                }
                return op.error(response);
            }
        });
    }

    static redirectTo(to){
        if (API.bodySiteRef != null && API.bodySiteRef.current != null){
            console.log(API.bodySiteRef);
            API.bodySiteRef.current.history.push(to);
        }else{
            //API.bodySiteRef.current.history.push(to);
            //document.getElementById("site_loader").hidden = false;
            window.location.href = "/login";
        }
    }

    static validateToken(){
        if (localStorage.getItem('token') != null){
            return true;
        }else{
            API.logout();
            return false;
        }
    }

    static logout() {
        if (localStorage.getItem('token')!= null){
            API.call("logout/",{}, (response)=>{
                console.log(response);
                Notifications.openNotificationWithIcon('success',"Sesión cerrada con éxito","");
            });
            localStorage.removeItem('token');
            API.redirectTo('/login');
        }else{
            localStorage.removeItem('token');
            //API.cookies.remove('token');
            API.redirectTo('/login');
        }
    }

    static logoutUser() {
        if (localStorage.getItem('token')!= null){
            API.call("logout/",{}, (response)=>{
                console.log(response);
                Notifications.openNotificationWithIcon('success',"Sesión cerrada con éxito","");
            });
            localStorage.removeItem('token');
            API.redirectTo('/');
        }else{
            localStorage.removeItem('token');
            //API.cookies.remove('token');
            API.redirectTo('/');
        }
    }
}