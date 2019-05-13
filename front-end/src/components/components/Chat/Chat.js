import React, { Component } from 'react';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import WebSocketInstance from '../../../tools/WebSocket'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {messages:[]}
    this.waitForSocketConnection(() => {
      WebSocketInstance.initChatUser(this.props.currentUser);
      WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
      WebSocketInstance.fetchMessages(this.props.currentUser);
    });
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          //console.log("Connection is made")
          callback();
          return;
        } else {
          //console.log("Wait for connection...")
          component.waitForSocketConnection(callback);
        }
    }, 100); // wait 100 milisecond for the connection...
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message]});
    if (message.author != this.props.currentUser)
      addResponseMessage(message.content);
  }

  handleNewUserMessage = (message) => {
    //console.log(`New message incomig! ${message}`);
    const messageObject = {
      from: this.props.currentUser,
      text: message
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: ''
    })
  }

  setMessages(messages) {
    this.setState({ messages: messages.reverse()});
    for (let i = 0; i < this.state.messages.length; i++) {
      //console.log(this.state.messages[i])
      if (this.state.messages[i].author != this.props.currentUser) {
        addResponseMessage(this.state.messages[i].content);
      } else {
        addUserMessage(this.state.messages[i].content);
      }
    }
  }

  messageChangeHandler = (event) =>  {
    this.setState({
      message: event.target.value
    })
  }

  sendMessageHandler = (e, message) => {
    const messageObject = {
      from: this.props.currentUser,
      text: message
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: ''
    })
    addUserMessage(message);
    e.preventDefault();
  }

  renderMessages = (messages) => {
    const currentUser = this.props.currentUser;
    return messages.map((message, i) => <li key={message.id} className={message.author === currentUser ? 'me' : 'him'}> <h4 className='author'>{ message.author } </h4><p>{ message.content }</p></li>);
  }

  render() {
    const messages = this.state.messages;
    const currentUser = this.props.currentUser;
    return (
      <div >
          <Widget
              handleNewUserMessage={this.handleNewUserMessage}
              title="Ayuda en linea"
              subtitle=""
              senderPlaceHolder={"Escribe un mensaje..."}
          />
      </div>
    );
  }
}
