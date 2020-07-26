import React from "react";
import {
  Header,
  HeaderName,
} from "carbon-components-react/lib/components/UIShell";

import Home from './Components/Home';

function App() {
  return (
    <div className="container" style={{width: '100%', height: '100%'}}>
      <Header aria-label="Spaceways Atlas">
        <HeaderName href="/" prefix="Spaceways">
          Atlas
        </HeaderName>
      </Header>
      <Home />
    </div>
  );
}

export default App;