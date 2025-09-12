import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Artenity from './components/artenity';
import Login from './components/login';
import Register from './components/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Artenity />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
