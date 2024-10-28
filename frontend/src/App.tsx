import React from 'react';

function App() {
  return (
    <div>
      <h1>Accessible Tic-Tac-Toe</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
        {Array.from(Array(9).keys()).map(i => (
          <button key={i} style={{ width: '100px', height: '100px' }}>
            {/* Placeholder for game moves */}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
