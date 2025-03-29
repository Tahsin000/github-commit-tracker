import { useState } from 'react';
import CommitTracker from "./components/CommitTracker";
import Documentation from "./components/Documentation";

function App() {
  const [showDocs, setShowDocs] = useState(false);
  
  return (
    <>
      {showDocs ? (
        <Documentation onBack={() => setShowDocs(false)} />
      ) : (
        <CommitTracker onShowDocs={() => setShowDocs(true)} />
      )}
    </>
  );
}

export default App;
