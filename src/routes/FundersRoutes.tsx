import { FunderAddPage } from '@app/pages/funders/FunderAddPage';
import { FundersPage } from '@app/pages/funders/FundersPage';
import { Route, Routes } from 'react-router-dom';

export default function FundersRoutes() {
  return (
    <Routes>
      <Route index element={<FundersPage />} />
      <Route path="add" element={<FunderAddPage />} />
    </Routes>
  );
}
