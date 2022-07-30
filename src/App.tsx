import { SnackbarProvider } from 'notistack';
import { DashboardLayout } from './components/DashboardLayout/DashboardLayout';

function App() {
    return (
        <SnackbarProvider maxSnack={3}>
            <DashboardLayout></DashboardLayout>
        </SnackbarProvider>
    );
}

export default App;
