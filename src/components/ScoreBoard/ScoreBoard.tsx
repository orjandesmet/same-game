import './ScoreBoard.css';

type ScoreBoardProps = {
  score: number;
  movesLeft: number;
  seed: number;
};

export function ScoreBoard(props: ScoreBoardProps) {
  return (
    <div className="score-board">
      <div>
        Moves left: <span className="score-board-value">{props.movesLeft}</span>
      </div>
      <div>
        Score: <span className="score-board-value">{props.score}</span>
      </div>
      <div className="score-board-info">
        <div>
          🌱 <span className="score-board-value">{props.seed}</span>
        </div>
        <div>
          <a
            href="https://github.com/orjandesmet/same-game"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github.svg" className="external-logo" /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
