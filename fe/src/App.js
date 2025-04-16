import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter


function App() {
  return (
    <BrowserRouter> {/* Wrap your app with BrowserRouter */}
      <div className="App">
        <Header />
      </div>
    </BrowserRouter>
  );
}

export default App;