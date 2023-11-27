import React from "react";
import "./Card.css";

export default function Card(props) {
  const { id, isFlipped, setFlippedCards, setMatchedCards, disabled, image } =
    props;

  function flipCard() {
    if (disabled) return;

    setFlippedCards((flippedCards) => {
      const updatedFlippedCards = [...flippedCards];
      updatedFlippedCards[id] = true;
      return updatedFlippedCards;
    });
    setMatchedCards((matchedCards) => {
      const updatedMatchedCards = [...matchedCards];
      updatedMatchedCards.push(id);
      return updatedMatchedCards;
    });
  }

  function coverCard() {
    if (disabled) return;
    setFlippedCards((flippedCards) => {
      const updatedFlippedCards = [...flippedCards];
      updatedFlippedCards[id] = false;
      return updatedFlippedCards;
    });
    setMatchedCards((matchedCards) => {
      const updatedMatchedCards = [...matchedCards];
      updatedMatchedCards.pop();
      return updatedMatchedCards;
    });
  }

  if (!isFlipped) {
    return (
      <section className="card card--flipped" onClick={flipCard}>
        <h3 className="card__symbol">?</h3>
      </section>
    );
  }
  return (
    <section className="card card--covered" onClick={coverCard}>
      <img src={image} alt={id} className="card__image" />
    </section>
  );

}
