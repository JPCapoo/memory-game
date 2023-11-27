import React from "react";
import Modal from "react-modal";

import "./Modal.css";

export default function WelcomeModal(props) {
  const { isModalOpen, setIsModalOpen } = props;
  const [userName, setUserName] = React.useState("");

  function closeModal() {
    localStorage.setItem("userName", userName);
    setIsModalOpen(false);
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Welcome Modal"
      className="welcomeModal"
      overlayClassName="welcomeModal__overlay"
    >
      <div className="welcomeModal__content">
        <h2 className="welcomeModal__title">Welcome to the Matching Game!</h2>
        <p className="welcomeModal__description">
          Your memory skills will be tested here.
        </p>
        <form className="welcomeModal__inputContainer" onSubmit={closeModal}>
          <label className="welcomeModal__label" htmlFor="name">
            Please enter your name:
          </label>
          <input
            type="text"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="welcomeModal__input"
          />
        </form>
        <button type="submit" className="welcomeModal__button">
          Submit
        </button>
      </div>
    </Modal>
  );
}
