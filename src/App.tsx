import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import theme from './utils/theme';
import { HomePage } from './pages/homepage';
import { Container } from '@mui/material';

function App() {
    return (
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
                <Container maxWidth="lg">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </Container>
            </ThemeProvider>
        </SnackbarProvider>
    );
}

export default App;
