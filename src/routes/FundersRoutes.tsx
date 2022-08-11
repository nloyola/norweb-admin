import { FundersPage } from '@app/pages/funders/FundersPage';
import { Route, Routes } from 'react-router-dom';

export default function FundersRoutes() {
  return (
    <Routes>
      <Route index element={<FundersPage />} />
    </Routes>
  );
}
