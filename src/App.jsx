import React from 'react';

import FileManager from './components/FileManager';
import { BACKEND_URL } from './constants';
import './App.css';

const App = () => (
  <div className="app">
    <div className="header">
      <h1>FileManager</h1>
    </div>
    <FileManager backendUrl={BACKEND_URL} />
  </div>
);
App.displayName = 'App';

export default App;
