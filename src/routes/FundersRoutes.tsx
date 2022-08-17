import { FunderDetails } from '@app/components/Funders/FunderDetails';
import { FunderAddPage } from '@app/pages/funders/FunderAddPage';
import { FunderPage } from '@app/pages/funders/FunderPage';
import { FundersPage } from '@app/pages/funders/FundersPage';
import { Route, Routes } from 'react-router-dom';

export default function FundersRoutes() {
  return (
    <Routes>
      <Route index element={<FundersPage />} />
      <Route path="add" element={<FunderAddPage />} />
      <Route path=":funderId" element={<FunderPage />}>
        <Route index element={<FunderDetails />} />
      </Route>
    </Routes>
  );
}
