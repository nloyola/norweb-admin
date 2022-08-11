import { Route, Routes } from 'react-router-dom';
import { PeoplePage } from '@app/pages/people/PeoplePage';
import { PersonPage } from '@app/pages/people/PersonPage';
import { PersonBio } from '@app/components/people/PersonBio';

export default function PeopleRoutes() {
  return (
    <Routes>
      <Route index element={<PeoplePage />} />
      <Route path=":personId" element={<PersonPage />}>
        <Route index element={<PersonBio />} />
      </Route>
    </Routes>
  );
}
