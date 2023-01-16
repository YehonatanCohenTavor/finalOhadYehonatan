import FilesList from './components/filesList'
import { createContext } from 'react';
import { Route, Routes } from "react-router-dom";
import Login from './components/login';

export const UserContext = createContext();

function App() {
  return (
    <>
    <FilesList/>
    </>
  );
}

export default App;
