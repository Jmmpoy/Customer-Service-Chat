//customer view

import React, { Component } from "react";
import axios from "axios";
import Chatkit from "@pusher/chatkit-client";
import Spinner from "react-spinkit";
import Dialog from "./Dialog";
import ChatWidget from "./ChatWidget";
import { handleInput, sendMessage, connectToRoom } from "./sharedMethods";
import './button.css'

class Customer extends Component {
  constructor() {
    super();

    this.state = {
      currentUser: null,
      currentRoom: null,
      newMessage: "",
      messages: [],
      isLoading: false,
      userId: "",
      isDialogOpen: false
    };

    this.connectToRoom = connectToRoom.bind(this);
    this.sendMessage = sendMessage.bind(this);
    this.handleInput = handleInput.bind(this);
  }

  showDialog = () => {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    });
  };

  addSupportStaffToRoom = () => {
    const { currentRoom, currentUser } = this.state;

    return currentUser.addUserToRoom({
      userId: "support",
      roomId: currentRoom.id
    });
  };

  createRoom = () => {
    const { currentUser } = this.state;

    currentUser
      .createRoom({
        name: currentUser.name,
        private: true
      })
      .then(room => this.connectToRoom(room.id))
      .then(() => this.addSupportStaffToRoom())
      .catch(console.error);
  };

  launchChat = event => {
    event.preventDefault();

    this.setState({
      isDialogOpen: false,
      isLoading: true
    });

    const { userId } = this.state;

    if (userId === null || userId.trim() === "") {
      alert("Invalid userId");
    } else {
      axios
        .post("http://localhost:5200/users", { userId })
        .then(() => {
          const tokenProvider = new Chatkit.TokenProvider({
            url: "http://localhost:5200/authenticate"
          });

          const chatManager = new Chatkit.ChatManager({
            instanceLocator: "v1:us1:6dbf19d7-3477-47a2-b8c2-3f9976c57845",
            userId,
            tokenProvider
          });

          return chatManager.connect().then(currentUser => {
            this.setState(
              {
                currentUser,
                isLoading: false
              },
              () => this.createRoom()
            );
          });
        })
        .catch(console.error);
    }
  };

  render() {
    const {
      newMessage,
      messages,
      currentUser,
      currentRoom,
      isDialogOpen,
      userId,
      isLoading
    } = this.state;

    return (
      <div classname="mx-auto"style={{"paddingTop":"100px"}}>
        <h1>Imaginary Service</h1>
        <h5>Need help ? Chat with us</h5>

        {currentRoom ? (
          <ChatWidget
            newMessage={newMessage}
            sendMessage={this.sendMessage}
            handleInput={this.handleInput}
            currentUser={currentUser}
            messages={messages}
          />
        ) : (
          <button onClick={this.showDialog} className="btn">
            Contact Support
          </button>
        )}

        {isLoading ? <Spinner name="three-bounce" color="#300d4f" /> : null}

        {isDialogOpen ? (
          <Dialog
            username={userId}
            handleInput={this.handleInput}
            launchChat={this.launchChat}
          />
        ) : null}
      </div>
    );
  }
}

export default Customer;