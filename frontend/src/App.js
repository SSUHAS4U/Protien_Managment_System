import './App.css';
import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/signin'));
const SignUp = lazy(() => import('./pages/signup'));
const AdminSignIn = lazy(() => import('./pages/admin-signin'));
const DashboardLayoutBasic = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/admin-dashboard'));
const AddFood = lazy(() => import('./pages/addfood'));
const AboutUs = lazy(() => import('./pages/about'));
const Viewusers = lazy(() => import('./pages/admin-viewusers'));
const FoodStatistics = lazy(() => import('./pages/foodstats'));
const ExerciseStatistics = lazy(() => import('./pages/exercisestats'));
const Exercise = lazy(() => import('./pages/addexercise'));
const Account = lazy(() => import('./pages/account'));
const Recommendations = lazy(() => import('./pages/Recommendations'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="App-body">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin-signin" element={<AdminSignIn />} />
              <Route path="/Dashboard" element={<DashboardLayoutBasic />} />
              <Route path="/admin-dashboard" element={<Admin />} />
              <Route path="/addfood" element={<AddFood />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/admin-viewusers" element={<Viewusers />} />
              <Route path="/foodstats" element={<FoodStatistics />} />
              <Route path="/exercisestats" element={<ExerciseStatistics />} />
              <Route path="/addexercise" element={<Exercise />} />
              <Route path="/account" element={<Account />} />
              <Route path="/Recommendations" element={<Recommendations />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
