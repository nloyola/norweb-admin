import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Status } from '@app/models';
import { Button, Grid, IconButton, Slide, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/router';
import { Project } from '@app/models/projects';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import ProjectsService from '@app/services/projects';
import DateSelectForm from '@app/components/DateSelectForm';

type FormInputs = {
    name: string;
    shorthand: string;
    startDate: Date;
    endDate: Date;
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

const saveProject = async (values: FormInputs): Promise<boolean> => {
    try {
        const project = new Project().deserialize({
            ...values,
            keywords: values.keywords.join(' '),
            status: Status.INACTIVE,
            version: 0,
            createdAt: new Date(),
            updatedAt: null
        });
        return new ProjectsService().add(project);
    } catch (e) {
        console.error(e);
        return false;
    }
};

const ProjectAddForm = () => {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
        saveProject(data).then((result) => {
            if (!result) {
                router.push('/500');
                return;
            }

            router.back();

            const action = (key) => (
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
        });
    };

    const onCancel = () => router.back();

    const onKeywordAdd = () => append({ value: '' });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
        </LocalizationProvider>
    );
};

export default ProjectAddForm;
