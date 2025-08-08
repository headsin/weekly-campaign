import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

const NotFoundPage = lazy(() => import('./pages/not-found'));
const WeeklyLottery = lazy(() => import('./pages/weekly-lottery'));
const ThankYouPage = lazy(() => import('./pages/thank-you'));

const App = () => {
  return (
  
     <Routes>
      <Route path="/" element={<WeeklyLottery />} />

      <Route path="/thank-you" element={<ThankYouPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
