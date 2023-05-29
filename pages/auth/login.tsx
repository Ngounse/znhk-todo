import Head from 'next/head';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {useState} from 'react';
import {useAuth} from 'src/context/AuthContext';
import {useRouter} from 'next/router';
import {RedditTextField} from 'src/components/ZNHKField';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {login} = useAuth();
  const {currentUser} = useAuth();
  const router = useRouter();

  if (!!currentUser) {
    router.push('/dashboard');
    return null;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      setErrorMessage('Please enter email and password');
      return;
    }
    try {
      await login(email, password);
      setErrorMessage('Successfully logged in');
      setError(false);
      router.push('/dashboard');
    } catch (error) {
      const errMessage = error?.message;

      if (errMessage.includes('user-not-found')) {
        setErrorMessage('User does not exist');
      }
      if (errMessage.includes('wrong-password')) {
        setErrorMessage('Invalid password');
      }
      setError(true);
    }
    return;
  };

  const handleRegister = () => {
    router.push('/auth/register');
    setErrorMessage('');
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Box gap={2} display={'flex'} flexDirection={'column'}>
            <Typography variant="h4">Login</Typography>
            <Typography color={error ? '#f00' : '#0ff'} variant="subtitle2">
              {errorMessage}
            </Typography>
            <RedditTextField
              label="Email"
              variant="filled"
              value={email}
              onChange={handleEmailChange}
            />
            <RedditTextField
              type="password"
              label="Password"
              variant="filled"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button variant="outlined" onClick={handleLogin}>
              Login
            </Button>

            <Stack flexDirection={'row'} justifyContent={'flex-end'}>
              <Typography variant="subtitle2">
                Don't have an account?
              </Typography>
              <Typography
                onClick={handleRegister}
                variant="subtitle2"
                color={'#0ff'}
                pl={1}
                sx={{
                  cursor: 'pointer',
                }}>
                Register
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
