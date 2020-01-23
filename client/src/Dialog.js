//Customer view modal input

//The Dialog component takes three props: username which is the name the user enters in the input, 
//handleInput which updates the username as the user types and 
//launchChat which will connect to our Chatkit instance once the .dialog-form is submitted. 
//All of the above will be passed down as props from Customer.js.

import React from "react";
import Proptypes from "prop-types";
import "./Dialog.css";


const Dialog = props => {
  const { username, handleInput, launchChat } = props;

  return (
    <div className="dialog-container">
      <div className="dialog">
        <form className="dialog-form" onSubmit={launchChat} style={{"backgroundColor":"#e6e6ea"}}>
          <label className="username-label text-center" htmlFor="username">
            What is your name?
          </label>
          <input
            id="username"
            className="username-input"
            autoFocus
            type="text"
            name="userId"
            value={username}
            onChange={handleInput}
            style={{"outline":"none"}}
          />
          <button type="submit" className="btnsubmit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

Dialog.propTypes = {
  username: Proptypes.string.isRequired,
  handleInput: Proptypes.func.isRequired,
  launchChat: Proptypes.func.isRequired
};

export default Dialog;