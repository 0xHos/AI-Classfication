import { useState } from "react";

import "./App.css";
import Upload from "./upload";
import Resulte from "./assets/Resulte";

function App() {
  const [result, setResult] = useState([]); // State to hold the result of the upload

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100 w-screen">
        <div className="shadow-lg bg-white flex w-2/3 h-1/2 items-center justify-center  ">
          <div className="flex items-center justify-center h-full text-xl font-bold border-b  basis-1/2">
            <Upload setResult={setResult} /> {/* Pass setResult to Upload */}
          </div>
          <div className="flex items-center justify-center h-full text-lg font-semibold bg-gray-50 basis-1/2">
            <Resulte result={result} /> {/* Pass result to Resulte */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
