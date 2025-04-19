import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent'; // Import MainContent
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter


function App() {
  return (
    <BrowserRouter> {/* Wrap your app with BrowserRouter */}
      <div className="App">
        <Header />
        <MainContent /> 
      </div>
    </BrowserRouter>
  );
}

export default App;