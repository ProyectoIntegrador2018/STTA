import React, { Component } from 'react';
import WebSocketInstance from '../tools/WebSocket'
import Chat from './components/Chat'
import InitChat from './components/InitChat'

export default class ChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            username: "jolumm"
        }
        WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
        WebSocketInstance.fetchMessages(this.props.currentUser);
    }

    addMessage(message) {
        this.setState({ messages: [...this.state.messages, message]});
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse()});
    }

    handleLoginSubmit = (username) => {
        this.setState({ loggedIn: true, username: username });
        WebSocketInstance.connect();
    }

    render() {
        return (<div>{
            this.state.loggedIn ?
                <Chat
                    currentUser={this.state.username}
                />
                :
                <InitChat
                    onSubmit={this.handleLoginSubmit}
                />
        }</div>)
    }

}
