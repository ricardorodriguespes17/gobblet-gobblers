import { useEffect, useState } from "react";

import "./styles.css";

interface BallType {
  id: string;
  value: number;
  player: "p1" | "p2";
}

export default function Home() {
  const [turn, setTurn] = useState<"p1" | "p2">("p1");
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | "">("");
  const [numberOfBalls] = useState(6);
  const [p1Balls, setP1Balls] = useState<BallType[]>([]);
  const [p2Balls, setP2Balls] = useState<BallType[]>([]);
  const [matriz, setMatriz] = useState<(BallType | undefined)[][]>([]);
  const [param, setParam] = useState(0);

  useEffect(() => {
    if (param === 0) {
      generateGame();
      setParam(param + 1);
    }
    // eslint-disable-next-line
  }, []);

  function generateGame() {
    const matriz = [] as (BallType | undefined)[][];

    //Generate table
    for (let i = 0; i < 3; i++) {
      const line = [];
      for (let j = 0; j < 3; j++) {
        line.push(undefined);
      }
      matriz.push(line);
    }

    setMatriz(matriz);

    //Generate player's balls
    const p1 = [] as BallType[];
    const p2 = [] as BallType[];
    for (let i = 0; i < numberOfBalls; i++) {
      p1.push({
        id: `1${i}`,
        value: i + 1,
        player: "p1",
      });
      p2.push({
        id: `2${i}`,
        value: i + 1,
        player: "p2",
      });
    }

    setP1Balls(p1);
    setP2Balls(p2);
  }

  function winVerify() {
    for (let i = 0; i < matriz.length; i++) {
      if (
        matriz[0][i]?.player === matriz[1][i]?.player &&
        matriz[1][i]?.player === matriz[2][i]?.player
      ) {
        setWinner(matriz[0][i]?.player ?? "");
        return;
      }

      if (
        matriz[i][0]?.player === matriz[i][1]?.player &&
        matriz[i][1]?.player === matriz[i][2]?.player
      ) {
        setWinner(matriz[i][0]?.player ?? "");
        return;
      }
    }

    if (
      matriz[0][0]?.player === matriz[1][1]?.player &&
      matriz[1][1]?.player === matriz[2][2]?.player
    ) {
      setWinner(matriz[2][0]?.player ?? "");
      return;
    }

    if (
      matriz[0][2]?.player === matriz[1][1]?.player &&
      matriz[1][1]?.player === matriz[2][0]?.player
    ) {
      setWinner(matriz[2][0]?.player ?? "");
      return;
    }

    //Draw verify
    let full = true;
    let hasPossibility = false;
    let itemsOfTurn = turn === "p2" ? p1Balls : p2Balls;

    matriz.map((row) =>
      row.map((ball) => {
        if (ball === undefined) {
          full = false;
        } else if (
          ball.player === turn &&
          itemsOfTurn.filter((item) => item.value > ball.value).length > 0
        ) {
          hasPossibility = true;
        }
        return ball;
      })
    );

    if (full && !hasPossibility) {
      setWinner("draw");
    }
  }

  function reset() {
    setTurn("p1");
    setWinner("");
    generateGame();
  }

  function dragStart(event: React.DragEvent) {
    event.dataTransfer.setData("value", event.currentTarget.id);
  }

  function dropItem(i: number, j: number, value: string) {
    const box = matriz[i][j];

    if (box && box.value !== 0 && Number(box.id) % 10 >= Number(value) % 10) {
      console.log("só sobrepõe com itens maiores");
      return;
    }

    var newMatriz = matriz.map((item) => item);

    newMatriz[i][j] =
      p1Balls.find((item) => item.id === value) ??
      p2Balls.find((item) => item.id === value) ??
      undefined;

    setP1Balls(p1Balls.filter((item) => item.id !== newMatriz[i][j]?.id));
    setP2Balls(p2Balls.filter((item) => item.id !== newMatriz[i][j]?.id));

    setTurn(turn === "p1" ? "p2" : "p1");

    winVerify();
  }

  return (
    <main className="home-page">
      {winner !== "" && (
        <div className="modal-winner">
          <div className="modal">
            {winner === "draw" ? (
              <h1>Deu velha!</h1>
            ) : (
              <h1>Jogador {winner} é o vencedor</h1>
            )}

            <button onClick={() => reset()}>OK</button>
          </div>
        </div>
      )}

      <div className={turn === "p1" ? "player-space on-turn" : "player-space"}>
        {p1Balls.map((item, index) => (
          <div
            id={item.id}
            key={index}
            className="item"
            draggable={turn === "p1"}
            onDragStart={dragStart}
          >
            {item.value}
          </div>
        ))}
      </div>
      <div className="table">
        {matriz.map((item, rowIndex) => {
          return item.map((ball, columnIndex) => (
            <div
              id={`box-${rowIndex}${columnIndex}`}
              onDragOver={(event) => {
                event.preventDefault();
                event.currentTarget.className = "selected";
              }}
              onDragLeave={(event) => {
                event.currentTarget.className = "";
              }}
              onDrop={(event) => {
                event.currentTarget.className = "";
                dropItem(
                  rowIndex,
                  columnIndex,
                  event.dataTransfer.getData("value")
                );
              }}
            >
              {ball && (
                <div id={ball.id} key={ball.id} className="item">
                  {ball.value}
                </div>
              )}
            </div>
          ));
        })}
      </div>
      <div className={turn === "p2" ? "player-space on-turn" : "player-space"}>
        {p2Balls.map((item, index) => (
          <div
            id={item.id}
            key={index}
            className="item"
            draggable={turn === "p2"}
            onDragStart={dragStart}
          >
            {item.value}
          </div>
        ))}
      </div>
    </main>
  );
}
