import { Person } from '@app/models/people';
import { PeopleService } from '@app/services/people/PeopleService';
import { useCallback, useState } from 'react';

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function usePerson(id: number) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPerson = useCallback(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // use this when testing
        // await new Promise((r) => setTimeout(r, 2000));
        const person = await PeopleService.get(id);
        setPerson(person);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('Not found')) {
            setPerson(null);
          } else {
            setError(JSON.stringify(err));
          }
        } else {
          setError(JSON.stringify(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { error, loading, person, loadPerson };
}
