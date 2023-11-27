import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import "./App.css";

import Card from "./components/Card";
import WelcomeModal from "./components/Modal";
import { fetchImages } from "./api/images";

export default function App() {
  const [score, setScore] = React.useState(0);
  const [errors, setErrors] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cards, setCards] = React.useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const [cardPositions, setCardPositions] = React.useState([]);
  const [matchedCards, setMatchedCards] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [flippedCards, setFlippedCards] = React.useState(
    Array.from({ length: 20 }, () => false)
  );

  const name = localStorage.getItem("userName") || "Guest";

  function shuffleCards(unshuffledCards) {
    for (let i = unshuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = unshuffledCards[i];
      unshuffledCards[i] = unshuffledCards[j];
      unshuffledCards[j] = temp;
    }

    return unshuffledCards;
  }

  function generateCardPositions(cardsArray) {
    let cardPositionsArray = [];
    cardsArray.forEach((card) => {
      cardPositionsArray.push(card.meta.name);
    });

    return setCardPositions(cardPositionsArray);
  }

  function checkForMatch() {
    setDisabled(true);

    const [firstCard, secondCard] = matchedCards;

    if (cardPositions[firstCard] === cardPositions[secondCard]) {
      setScore((score) => score + 1);
      setMatchedCards([]);
    } else {
      setTimeout(() => {
        setErrors((errors) => errors + 1);
        setFlippedCards((flippedCards) => {
          const updatedFlippedCards = [...flippedCards];
          updatedFlippedCards[firstCard] = false;
          updatedFlippedCards[secondCard] = false;
          return updatedFlippedCards;
        });
        setMatchedCards([]);
      }, 1000);
    }

    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  }

  function checkForGameOver() {
    let gameOver = true;
    //break the loop if there is a false value

    for (const card of flippedCards) {
      if (!card) {
        gameOver = false;
        break;
      }
    }

    if (gameOver) {
      toast.success("Congrats! You did it!");
    }
    return false;
  }

  async function getCardImages() {
    setIsLoading(true);
    try {
      const response = await fetchImages();
      if (!response) {
        setIsLoading(false);
        throw new Error("No cards found");
      }

      const firstTenCards = response.entries.slice(0, 10);
      const cards = [...firstTenCards, ...firstTenCards];

      const shuffledCards = shuffleCards(cards);
      setCards(shuffledCards);
      generateCardPositions(shuffledCards);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  }

  React.useEffect(() => {
    if (matchedCards.length === 2) {
      checkForMatch();
      checkForGameOver();
    }
  }, [matchedCards]);

  React.useEffect(() => {
    getCardImages();
    if (
      localStorage.getItem("userName") === null ||
      localStorage.getItem("userName") === ""
    ) {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <div className="App">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
      <header className="App-header">
        <div className="headerItems">
          <a href="/" className="headerItems__link">
            <h1 className="headerItems__title">Matching Game</h1>
          </a>
          <p className="headerItems__author">
            <span>Made by:</span> Juan Pablo Capobianco Ramos
          </p>
        </div>
        <div className="stats">
          <p className="stats__item">User: {name}</p>
          <p className="stats__item">Score: {score}</p>
          <p className="stats__item">Errors: {errors}</p>
        </div>
      </header>
      <section className="sectionContainer">
        {isLoading ? (
          <Circles
            height="80"
            width="80"
            color="#ffffff"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={isLoading}
          />
        ) : (
          <div className="cardsContainer">
            {cards !== null &&
              cards.map((card, id) => {
                return (
                  <Card
                    key={card.meta.uuid + id}
                    id={id}
                    isFlipped={flippedCards[id]}
                    setFlippedCards={setFlippedCards}
                    setMatchedCards={setMatchedCards}
                    image={card.fields.image.url}
                    disabled={disabled}
                  />
                );
              })}
          </div>
        )}
      </section>
      <WelcomeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="App__modal"
      />
    </div>
  );
}
