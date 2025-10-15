import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CharacterSelection } from './pages/CharacterSelection';
import { CharacterCreation } from './pages/CharacterCreation';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Battle } from './pages/Battle';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/characters"
          element={
            <PrivateRoute>
              <CharacterSelection />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/character/create"
          element={
            <PrivateRoute>
              <CharacterCreation />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/battle"
          element={
            <PrivateRoute>
              <Battle />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
