import React, { ReactElement } from 'react';
import { Person } from '@app/models/people';
import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';

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
            value: person.name()
        },
        {
            label: 'Gender',
            value: person.gender ?? 'Not available'
        },
        {
            label: 'Email',
            value:
                person.email && person.email !== '' ? (
                    <Link href={`mailto:${person.email}`}>{person.email}</Link>
                ) : (
                    'NotAvailable'
                )
        },
        {
            label: 'Website',
            value:
                person.website && person.website !== '' ? (
                    <Link href={person.website} target="_blank">
                        {person.website}
                    </Link>
                ) : (
                    'Not available'
                )
        },
        {
            label: 'Telephone',
            value: person.phone ?? 'Not available'
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

const PersonBio = ({ person }: PersonBioProps) => {
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
                            {person.name()}
                        </Typography>
                        <Typography component="h2" variant="h6">
                            {person.titles()}
                        </Typography>
                    </Stack>
                </Stack>

                <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    {personDetails(person).map((details, index) => (
                        <React.Fragment key={index}>
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
};

export default PersonBio;
