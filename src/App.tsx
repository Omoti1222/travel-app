import { Route, Routes } from "react-router-dom";
import { SearchPage } from "./SearchPage";
import { ResultsPage } from "./ResultsPage";
import { PlanPage } from "./PlanPage";
import { BookPage } from "./BookPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/plan/:planId" element={<PlanPage />} />
      <Route path="/book/:planId" element={<BookPage />} />
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}

export default App;
