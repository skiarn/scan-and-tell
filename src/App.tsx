import React from 'react';
import Game from './Game';
import './App.css';
import { OpenAIKeyProvider } from './shared/context/OpenAIKeyContext';

function App() {
  return (
    <OpenAIKeyProvider>
      <Game />
    </OpenAIKeyProvider>
  );
}

export default App;
