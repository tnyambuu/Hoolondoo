import './App.css';
import useApi from './hooks/useApi';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/login.jsx';
import HomePage from './components/HomePage/homepage.jsx';
import Register from './components/Register/Register.jsx';


function App() {

  const rootApi = useApi().root;

  return (
    <div className="App">
      <Routes>
        <Route
          path='/login'
          element={<Login/>}
        />
        <Route
          path='/'
          element={<HomePage/>}
        />
        <Route
          path='/register'
          element={<Register/>}
        />
      </Routes>
    </div>
  );
}

export default App;
