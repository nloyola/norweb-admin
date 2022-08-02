import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, CircularProgress, Grid, IconButton, Slide, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackbarKey, useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import DateSelectForm from '@app/components/DateSelectForm';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Project } from '@app/models/projects';

type FormInputs = {
    name: string;
    shorthand: string;
    startDate: Date | null;
    endDate: Date | null;
    description: string;
    goals: string;
    vision: string;
    keywords: { value: string }[];
    countryCode: string;
};

const schema = yup.object().shape({
    name: yup.string().required('Project name is required'),
    shorthand: yup.string(),
    description: yup.string(),
    goals: yup.string(),
    vision: yup.string(),
    keywords: yup.array().of(yup.string()),
    startDate: yup.date().nullable().typeError('invalid date').required('start date is required'),
    endDate: yup
        .date()
        .nullable()
        .typeError('invalid date')
        .test('oneOfRequired', 'must be later than start date', function (endDate) {
            if (!endDate) {
                return true;
            }
            return this.parent.startDate <= endDate;
        })
});

const ProjectAddForm = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isDirty, isValid, errors }
    } = useForm<FormInputs>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            shorthand: '',
            description: '',
            goals: '',
            vision: '',
            keywords: [],
            startDate: null,
            endDate: null,
            countryCode: ''
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'keywords'
    });

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        const saveData = async () => {
            try {
                setSaving(true);
                await ProjectsService.add({
                    ...data,
                    keywords: data.keywords.join(' ')
                } as Project);

                const action = (key: SnackbarKey) => (
                    <Button onClick={() => closeSnackbar(key)}>
                        <IconButton color="default" aria-label="close button" component="span" size="small">
                            <CloseIcon />
                        </IconButton>
                    </Button>
                );

                enqueueSnackbar('The project was saved', {
                    action,
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    TransitionComponent: Slide
                });

                navigate('..');
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setSaving(false);
            }
        };
        saveData();
    };

    const onCancel = () => navigate('..');

    const onKeywordAdd = () => append({ value: '' });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {!saving && error !== '' && <Alert severity="error">Error in backend adding a project: {error}</Alert>}
            {saving && <CircularProgress />}
            {!saving && error === '' && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Project Name"
                                        variant="standard"
                                        error={!!errors.name}
                                        helperText={errors.name ? errors.name?.message : ''}
                                        fullWidth
                                        margin="dense"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Controller
                                name="shorthand"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Project shorthand"
                                        variant="standard"
                                        error={!!errors.shorthand}
                                        helperText={errors.shorthand ? errors.shorthand?.message : ''}
                                        fullWidth
                                        margin="dense"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        variant="standard"
                                        multiline
                                        rows={6}
                                        error={!!errors.description}
                                        helperText={errors.description ? errors.description?.message : ''}
                                        fullWidth
                                        margin="dense"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Controller
                                name="goals"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Goals"
                                        variant="standard"
                                        multiline
                                        rows={4}
                                        error={!!errors.goals}
                                        helperText={errors.goals ? errors.goals?.message : ''}
                                        fullWidth
                                        margin="dense"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Controller
                                name="vision"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Vision"
                                        variant="standard"
                                        multiline
                                        rows={4}
                                        error={!!errors.vision}
                                        helperText={errors.vision ? errors.vision?.message : ''}
                                        fullWidth
                                        margin="dense"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {fields.map((item, index) => (
                                <Controller
                                    key={item.id}
                                    name={`keywords.${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <Stack spacing={2} direction="row" mt={1}>
                                            <TextField {...field} label="Keyword" variant="standard" fullWidth />
                                            <Button variant="outlined" size="small" onClick={() => remove(index)}>
                                                Remove
                                            </Button>
                                        </Stack>
                                    )}
                                />
                            ))}
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <Stack spacing={2} direction="row" mt={2}>
                                <Button type="button" variant="outlined" onClick={onKeywordAdd}>
                                    Add keyword
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <DateSelectForm
                                control={control}
                                names={['startDate', 'endDate']}
                                errors={errors}
                            ></DateSelectForm>
                        </Grid>
                    </Grid>
                    <Stack spacing={2} direction="row" mt={5}>
                        <Button type="submit" variant="contained" disabled={!isDirty || !isValid}>
                            Submit
                        </Button>
                        <Button variant="outlined" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Stack>
                </form>
            )}
        </LocalizationProvider>
    );
};

export default ProjectAddForm;
