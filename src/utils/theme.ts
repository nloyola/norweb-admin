import { createTheme } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
    components: {
        MuiTypography: {
            variants: [
                {
                    props: {
                        variant: 'subtitle2'
                    },
                    style: {
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        color: grey[500]
                    }
                },
                {
                    props: {
                        variant: 'body1'
                    },
                    style: {
                        fontSize: '1rem',
                        color: 'black'
                    }
                }
            ]
        }
    },
    palette: {
        primary: {
            main: '#556cd6'
        },
        secondary: {
            main: '#19857b'
        },
        error: {
            main: red.A400
        }
    }
});

export default theme;
