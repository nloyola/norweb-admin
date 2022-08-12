import { DomainEntity } from '@app/models';
import { useCallback, useState } from 'react';

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function useEntity<T extends DomainEntity>(entityFetcher: () => Promise<T>) {
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntity = useCallback(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // use this when testing
        // await new Promise((r) => setTimeout(r, 2000));
        const entity = await entityFetcher();
        setEntity(entity);
      } catch (err) {
        console.log(err);
        if (err instanceof Error) {
          if (err.message.includes('Not found')) {
            setEntity(null);
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
  }, []);

  const updateEntity = useCallback((modifiedEentity: T) => {
    setEntity(modifiedEentity);
  }, []);

  return { error, loading, entity, loadEntity, updateEntity };
}
1;
