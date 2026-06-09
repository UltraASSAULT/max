// /src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './app/Navbar';
import HomePage from './app/HomePage';
import SearchPage from './app/SearchPage';
import WeatherForecast from './app/WeatherForecast';
import PlanetsPage from './app/PlanetsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/weather" element={<WeatherForecast />} />
        <Route path="/planets" element={<PlanetsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;