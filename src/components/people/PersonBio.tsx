import React, { ReactElement } from 'react';
import { Person, personName, personTitles } from '@app/models/people';
import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';

type PersonBioProps = {
    person: Person;
};

type PersonDetails = {
    label: string;
    value?: string | ReactElement;
    html?: string;
};

function personDetails(person: Person): PersonDetails[] {
    const result: PersonDetails[] = [
        {
            label: 'Name',
            value: personName(person)
        },
        {
            label: 'Gender',
            value: person.gender ?? 'Not available'
        },
        {
            label: 'Email',
            value:
                person.email && person.email !== '' ? (
                    <a href={`mailto:${person.email}`}>{person.email}</a>
                ) : (
                    'NotAvailable'
                )
        },
        {
            label: 'Website',
            value:
                person.website && person.website !== '' ? (
                    <a href={person.website} target="_blank">
                        {person.website}
                    </a>
                ) : (
                    'Not available'
                )
        },
        {
            label: 'Telephone',
            value:
                person.phone && person.phone !== '' ? (
                    <a href={`tel://${person.phone}`}>{person.phone}</a>
                ) : (
                    'Not available'
                )
        },
        {
            label: 'Brief CV',
            html: person.cvBrief && person.cvBrief !== '' ? person.cvBrief : 'Not available'
        },
        {
            label: 'CV',
            html: person.cvText && person.cvText !== '' ? person.cvText : 'Not available'
        }
    ];

    return result;
}

export function PersonBio({ person }: PersonBioProps) {
    if (!person.id) {
        throw new Error('person is invalid');
    }

    return (
        <Stack spacing={2}>
            <Paper
                sx={{
                    p: 3
                }}
            >
                <Stack spacing={2} direction="row">
                    <Avatar variant="rounded" src={person.photo} sx={{ width: 200, height: 200 }} />
                    <Stack spacing={2}>
                        <Typography component="h1" variant="h3">
                            {personName(person)}
                        </Typography>
                        <Typography component="h2" variant="h6">
                            {personTitles(person)}
                        </Typography>
                    </Stack>
                </Stack>

                <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    {personDetails(person).map((details) => (
                        <React.Fragment key={details.label}>
                            <Grid item md={3}>
                                <Typography component="h6" variant="subtitle2">
                                    {details.label}
                                </Typography>
                            </Grid>
                            {details.value && (
                                <Grid item md={9}>
                                    {details.value}
                                </Grid>
                            )}
                            {details.html && (
                                <Grid
                                    item
                                    md={9}
                                    dangerouslySetInnerHTML={{
                                        __html: details.html
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </Grid>
            </Paper>
            {/*{<pre>{JSON.stringify(person, null, 4)}</pre>}*/}
        </Stack>
    );
}
