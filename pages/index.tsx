import Image from "next/image";
import { useEffect, useState } from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import Logo from "../public/logo.svg";
import { shuffle } from '../utils/shuffle';


export default function Home() {
  // memory game cards data
  const data = [
    { id: 3, name: "Papa", image: "/bandit.png", flipped: false, matched: false },
    { id: 9, name: "Maman", image: "/chilli.png", flipped: false, matched: false },
    { id: 7, name: "Bingo", image: "/bingo.png", flipped: false, matched: false },
    { id: 2, name: "Papa", image: "/bandit.png", flipped: false, matched: false },
    { id: 6, name: "Bluey", image: "/bluey.png", flipped: false, matched: false },
    { id: 8, name: "Mamie", image: "/mamie.png", flipped: false, matched: false },
    { id: 5, name: "Bingo", image: "/bingo.png", flipped: false, matched: false },
    { id: 1, name: "Maman", image: "/chilli.png", flipped: false, matched: false },
    { id: 10, name: "Papi", image: "/papi.png", flipped: false, matched: false },
    { id: 11, name: "Bluey", image: "/bluey.png", flipped: false, matched: false },
    { id: 4, name: "Papi", image: "/papi.png", flipped: false, matched: false },
    { id: 12, name: "Mamie", image: "/mamie.png", flipped: false, matched: false },
  ];

  // const shuffledData = shuffle(data);

  const maxMoves = 10;
  const targertScore = data.length / 2;

  const [cards, setCards] = useState<any[]>(data);
  const [flipped, setFlipped] = useState<any[]>([]);
  const [matched, setMatched] = useState<any[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const [isExploding, setIsExploding] = useState(false);

  function handleClick(id: number) {
    if (!canPlay) return;
    const findCard = cards.find((card) => card.id === id);
    if (!findCard.flipped) {
      setFlipped([...flipped, findCard]);
      findCard.flipped = true;
    }
    setCards([...cards]);
  }

  // use effect to handle compare flipped cards
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(moves + 1);
      setCanPlay(false);
      const findCard1 = cards.find((card) => card.id === flipped[0].id);
      const findCard2 = cards.find((card) => card.id === flipped[1].id);
      if (flipped[0].name === flipped[1].name) {
        findCard1.matched = true;
        findCard2.matched = true;
        setMatched([...matched, flipped[0], flipped[1]]);
        setScore(score + 1);
        setIsExploding(true);
        setCards((prevCards) => [...prevCards]);
      } else {
        if (findCard1) {
          setTimeout(() => {
            findCard1.flipped = false;
          }, 1000);
        }
        if (findCard2) {
          setTimeout(() => {
            findCard2.flipped = false;
          }, 1000);
        }
        setIsExploding(false);

        setCards((prevCards) => [...prevCards]);
      }

      if (moves === maxMoves) {
        setGameOver(true);
        setCanPlay(false);
      }

      setTimeout(() => {
        setCanPlay(true);
        setFlipped([]);
      }, 1000);
    }
  }, [flipped]);

  // type for mouse event
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const card = e.target as HTMLDivElement;
    const { x, y } = card.getBoundingClientRect();

    const relativeX = e.clientX - x;
    const relativeY = e.clientY - y;

    card.style.setProperty("--x-cursor-position", String(relativeX));
    card.style.setProperty("--y-cursor-position", String(relativeY));
  }

  return (
    <main className={`flex flex-col gap-2 p-24 min-h-screen`}>
      <div className="flex flex-col items-center gap-4 pb-10">
        <h1 className="text-4xl text-[#5a5a87] font-bold relative">Score: {score}/{targertScore}<div className="absolute left-1/2 -translate-1/2">{isExploding && <ConfettiExplosion />}</div></h1>
        {/* <h1 className="text-2xl text-[#5a5a87] font-bold text-center flex flex-col items-center justify-center relative">
          Essais: {moves}/{maxMoves}
          
        </h1> */}
      

      </div>

      {/* {gameOver && <h1 className="text-white">Game Over</h1>} */}
      <div className="flex flex-wrap justify-center gap-8">
        {cards.map((card) => (
          <div
            className={`flip-card ${card.flipped ? "flipped" : ""}`}
            key={card.id}
            onClick={() => handleClick(card.id)}
            onMouseMove={(e) => handleMouseMove(e)}
          >
            <div className="flip-card-inner">
              <div
                className={`flip-card-front rounded-lg flex items-center justify-center bg-white ${
                  card.matched ? "border-8 !border-green-400" : ""
                }`}
              >
                <div className="flex flex-col justify-center items-center">
                  <p className="text-[#5a5a87] text-center">{card.name}</p>
                  <img src={card.image} alt="" width={120} />
                </div>
              </div>
              <div className="flip-card-back rounded-lg flex items-center justify-center border border-slate-500 bg-[#5a5a87]">
                <Image src={Logo} alt="" width={120} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
