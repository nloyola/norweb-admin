import { Person } from '@app/models/people';
import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Fab, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PersonBio } from '@app/components/people/PersonBio/PersonBio';
import { PeopleService } from '@app/services/people/PeopleService';

export function PersonPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            if (params.personId === undefined) {
                return;
            }

            try {
                const raw = await PeopleService.get(params.personId);
                const p = new Person().deserialize(raw);
                setPerson(p);
            } catch (err) {
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const backClicked = () => {
        navigate('../', { state: location.state });
    };

    return (
        <>
            {loading && <CircularProgress />}
            {!loading && error === '' && (
                <Stack spacing={2}>
                    {person === null && <Alert severity="error">Person does not exist</Alert>}
                    {person !== null && <PersonBio person={person} />}
                    <Stack spacing={2} direction="row" mt={2}>
                        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                            <ArrowBack sx={{ mr: 1 }} />
                            Back
                        </Fab>
                    </Stack>
                </Stack>
            )}
            {!loading && error !== '' && <Alert severity="error">{error}</Alert>}
        </>
    );
}
