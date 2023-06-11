import Game from "./components/Game";
import { GameStateProvider } from "./contexts/GameContext";
import "./App.css";

const App = () => (
  <GameStateProvider>
    <h1>Tic Tac Toe</h1>
    <Game />
  </GameStateProvider>
);

export default App;
