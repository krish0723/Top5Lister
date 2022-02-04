import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom'

export default function SplashScreen() {
    const handleLogin = () => {

    }
    const handleRegister = () => {

    }
    const handleGuest = () => {

    }
    return (
        <div id="splash-screen">
            Top5Lister<br/>
            <div id="splash-menu">
                <Grid container direction="column">
                <Box sx={{p:.1}}>
                    <Button variant="contained"><Link underline="none" to='/login/'>Login</Link></Button>
                </Box>
                <Box sx={{p:.1}}>
                    <Button variant="contained" onPress={handleRegister}><Link underline="none" to='/register/'>Register</Link></Button>
                </Box>
                </Grid>
            </div>
        </div>
    )
}
