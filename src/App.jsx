import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/not-found';
import WeeklyLottery from './pages/weekly-lottery';
import ThankYouPage from './pages/thank-you';

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
