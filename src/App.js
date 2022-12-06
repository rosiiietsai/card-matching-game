import './App.css';

import { useEffect, useState } from 'react';
import SingleCard from './components/SingleCard';
import Modal from './components/Modal';
import Footer from './components/Footer';

const cardImages = [
  { src: '/img/hamster-1.png', isMatched: false },
  { src: '/img/parrot-1.png', isMatched: false },
  { src: '/img/cat-1.png', isMatched: false },
  { src: '/img/corgi-1.png', isMatched: false },
  { src: '/img/owl-1.png', isMatched: false },
  { src: '/img/turtle-1.png', isMatched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [timer, setTimer] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [isWin, setIsWin] = useState(true);

  const time = `${String(Math.floor(timer / 60)).padStart(2, 0)}:${String(
    timer % 60
  ).padStart(2, 0)}`;

  const shuffleCards = () => {
    // duplicate cards -> sorted in random order -> add random id
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);

    // reset state
    setTurns(0);
    setTimer(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setIsWin(true);
  };

  const resetTurn = () => {
    // reset choice
    setChoiceOne(null);
    setChoiceTwo(null);

    // increase turn
    setTurns(prevTurn => prevTurn + 1);

    // be able to select card
    setIsDisable(false);
  };

  const handleChoice = card => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    setIsWin(false);
  };

  // start timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    // stop timer
    if (isWin) clearInterval(intervalId);

    // cleanup function
    return () => clearInterval(intervalId);
  }, [isWin]);

  // matching 2 selected cards when choice state changes
  useEffect(() => {
    // check if win
    if (cards.every(card => card.isMatched === true))
      setTimeout(() => setIsWin(true), 500);

    // check if 2 cards are selected
    if (!choiceOne || !choiceTwo) return;
    setIsDisable(true);

    // matching cards
    if (choiceOne.src === choiceTwo.src) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.src === choiceOne.src ? { ...card, isMatched: true } : card
        )
      );

      resetTurn();
    } else {
      // stay the same turn for a while to keep the unmatched cards flipped
      setTimeout(resetTurn, 1000);
    }
  }, [choiceOne, choiceTwo, cards]);

  // start a new game when initial rendered
  useEffect(shuffleCards, []);

  return (
    <div className="App">
      <h1>Animal Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            isFlipped={
              card === choiceOne || card === choiceTwo || card.isMatched
            }
            isDisable={isDisable}
          />
        ))}
      </div>
      <div className="details">
        <p className="details-turns">Turns: {turns}</p>
        <p className="details-time">Time: {time}</p>
      </div>
      <Footer />

      {isWin && turns > 0 && (
        <Modal>
          <h2>YOU WIN!!!</h2>
          <p>Turns: {turns}</p>
          <p>Time: {time}</p>
          <button onClick={shuffleCards}>Play Again</button>
        </Modal>
      )}
    </div>
  );
}

export default App;
