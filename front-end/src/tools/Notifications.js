import { message } from 'antd';

export default class Notifications {
    static openNotificationWithIcon = (type, messageText, description) => {
        message[type]( messageText + " " + description);
    };

}
