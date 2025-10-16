import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CharacterSelection } from './pages/CharacterSelection';
import { CharacterCreation } from './pages/CharacterCreation';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { BattleFarm } from './pages/BattleFarm';
import { Quests } from './pages/Quests';
import { Crafting } from './pages/Crafting';
import { Marketplace } from './pages/Marketplace';
import { Dungeons } from './pages/Dungeons';
import { Gathering } from './pages/Gathering';
import { PrivateRoute } from './components/PrivateRoute';
import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <ToastProvider>
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
              <BattleFarm />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/quests"
          element={
            <PrivateRoute>
              <Quests />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/crafting"
          element={
            <PrivateRoute>
              <Crafting />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <Marketplace />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dungeons"
          element={
            <PrivateRoute>
              <Dungeons />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/gathering"
          element={
            <PrivateRoute>
              <Gathering />
            </PrivateRoute>
          }
        />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
