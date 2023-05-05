import './App.css'
import Index from './components/Index'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:url" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
