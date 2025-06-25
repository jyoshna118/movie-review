
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/App.css';

import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from  "./pages/login";
import Home from "./pages/Home";
import TopRated from "./pages/TopRated";
import LowRated from "./pages/LowRated";
import RecentMovies from "./pages/RecentMovies";
import Oldest from "./pages/Oldest";
import Search from "./pages/Search";
import Filter from "./pages/Filter";
import ProtectedRoute from "./components/ProtectedRoute";
import ReviewPage from './pages/ReviewPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/low-rated" element={<LowRated />} />
        <Route path="/recent" element={<RecentMovies />} />
        <Route path="/oldest" element={<Oldest />} />
        <Route path="/search" element={<Search />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/movies/:id/reviews" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="/reviews/:id" element={<ReviewPage />} />

      </Routes>
    </Router>
  );
}

export default App;
