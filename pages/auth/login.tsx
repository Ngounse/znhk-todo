import Head from 'next/head';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {alpha, styled} from '@mui/material/styles';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import {OutlinedInputProps} from '@mui/material/OutlinedInput';
import {useState} from 'react';
import {useAuth} from 'src/context/AuthContext';
import {useRouter} from 'next/router';

const RedditTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{disableUnderline: true} as Partial<OutlinedInputProps>}
    {...props}
  />
))(({theme}) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: '#c4c4c4',
      borderColor: theme.palette.primary.main,
      //   backgroundColor: "transparent",
    },
    '&.Mui-focused': {
      //   backgroundColor: "transparent",
      backgroundColor: '#c4c4c4',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const {login, signup} = useAuth();
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
    if (isLoggingIn) {
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
    }
    if (!isLoggingIn) {
      try {
        return await signup(email, password);
      } catch (error) {
        const errMessage = error?.message;

        if (errMessage.includes('email-already-in-use')) {
          setErrorMessage('Email already in use');
        }
        if (errMessage.includes('weak-password')) {
          setErrorMessage('Password is too weak (minimum 6 characters)');
        }
        if (errMessage.includes('invalid-email')) {
          setErrorMessage('Invalid email address');
        }
        setError(true);
      }
    }
  };

  const handleRegister = () => {
    setIsLoggingIn(!isLoggingIn);
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
            <Typography variant="h4">
              {isLoggingIn ? 'Login' : 'Register'}
            </Typography>
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
              {isLoggingIn ? 'Login' : 'Register'}
            </Button>

            <Stack flexDirection={'row'} justifyContent={'flex-end'}>
              <Typography variant="subtitle2">
                {isLoggingIn
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </Typography>
              <Typography
                onClick={handleRegister}
                variant="subtitle2"
                color={'#0ff'}
                pl={1}
                sx={{
                  cursor: 'pointer',
                }}>
                {isLoggingIn ? 'Register' : 'Login'}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
