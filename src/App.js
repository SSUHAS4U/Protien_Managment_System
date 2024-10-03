import './App.css';
import { Routes, Route,} from 'react-router-dom';
import React, { Suspense, lazy } from 'react';


const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/signin'));
const SignUp = lazy(() => import('./pages/signup'));
const AdminSignIn = lazy(() => import('./pages/admin-signin'));
const DashboardLayoutBasic = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/admin-dashboard'));
const Add = lazy(() => import('./pages/admin-addfood'));
const AddFood = lazy(() => import('./pages/addfood'));
const AboutUs = lazy(() => import('./pages/about'));
function App() {
  return (
    <div className="App">
    <div className='App-body'>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-signin" element={<AdminSignIn/>} />
          <Route path="/Dashboard" element={<DashboardLayoutBasic/>} />
          <Route path="/admin-dashboard" element={<Admin/>} />
          <Route path="/admin-addfood" element={<Add/>} />
          <Route path="/addfood" element={<AddFood/>} />
          <Route path="/about" element={<AboutUs/>} />
        </Routes>
      </Suspense>
    </div>
  </div>
  );
}

export default App;
