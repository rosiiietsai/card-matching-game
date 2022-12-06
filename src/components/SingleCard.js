import './SingleCard.css';

export default function SingleCard({
  card,
  handleChoice,
  isFlipped,
  isDisable,
}) {
  const handleClick = () => {
    if (isDisable || isFlipped) return;
    handleChoice(card);
  };

  return (
    <div className="card">
      <div className={isFlipped ? 'isFlipped' : ''}>
        <div className="card__content">
          <img src={card.src} alt="Card content" />
        </div>
        <div className="card__cover" onClick={handleClick}>
          <img src="/img/cover.jpg" alt="Card cover" />
        </div>
      </div>
    </div>
  );
}
