import { ResearchAreaDetails } from '@app/components/ResearchAreas/ResearchAreaDetails';
import { ResearchAreaPage } from '@app/pages/research-areas/ResearchAreaPage';
import { ResearchAreasPage } from '@app/pages/research-areas/ResearchAreasPage';
import { Route, Routes } from 'react-router-dom';

export default function ResearchAreasRoutes() {
  return (
    <Routes>
      <Route index element={<ResearchAreasPage />} />

      {/*
      <Route path="add" element={<ResearchAreaAddPage />} />
        */}

      <Route path=":areaId" element={<ResearchAreaPage />}>
        <Route index element={<ResearchAreaDetails />} />
      </Route>
    </Routes>
  );
}
