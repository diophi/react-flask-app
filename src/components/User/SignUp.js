import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MaterialLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Link, useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
   // height: '93.5vh',
  },
  image: {
    backgroundImage: 'url(resources/cover.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display:'flex',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  coverLogo: {
    display: 'flex',
    '& > *': {
      fontSize:30,
      fontWeight:'bold',
      color:'#3f51b5',
      margin: theme.spacing(1),
      width: theme.spacing(15),
      height: theme.spacing(5),
      textAlign: 'center',
    },
  },
}));

let checkUser = async (currUser) => {
    let user = await fetch('https://mostare1.pythonanywhere.com/api/checkuser/'+ (currUser.username || ''))
    .then(response => response.json())
    .then(data => data);

    return user;
}

let registerUser = async (currUser) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: currUser.username, 
            password: currUser.password,
            email: currUser.email || ' ',
            firstName: currUser.firstName || ' ',
            lastName: currUser.lastName || ' '
        })
      };
      
    fetch('https://mostare1.pythonanywhere.com/api/signup', requestOptions)
    .then(response => response);
}

export default function SignUp(props) {
    const classes = useStyles();
    const history = useHistory();

    const [currUser, setCurrUser] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        return () => {setCurrUser({});}
    },[])
   
    const handleSubmit = () => {
        checkUser(currUser).then(data => {
            if(data.length > 0) setError(true);
            else{
                registerUser(currUser).then(() => {history.push('/');});
            } 
        });
    }

 
    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        //backgroundImage: 'url(resources/cover.jpg)',
        alignItems: 'center',
        height:'calc(100vh - 120px)',
    }}>
        <div></div>
    
        <Paper elevation={3} style={{marginTop:'1.9vh',maxWidth:'700px', minWidth:'300px'}}>
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Create a new account
            </Typography>
            <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
                    autoFocus
                    value={currUser.firstName || ''}
                    onChange = { (event) => {currUser.firstName=event.target.value; setCurrUser({...currUser})}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    value={currUser.lastName || ''}
                    onChange = { (event) => {currUser.lastName=event.target.value; setCurrUser({...currUser})}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={currUser.username || ''}
                    onChange = { (event) => {currUser.username=event.target.value; setCurrUser({...currUser})}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    id="email"
                    value={currUser.email || ''}
                    onChange = { (event) => {currUser.email=event.target.value; setCurrUser({...currUser})}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={currUser.password || ''}
                    onChange = { (event) => {currUser.password=event.target.value; setCurrUser({...currUser})}}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={ currUser.username === '' || currUser.username === undefined
                                || currUser.password === '' || currUser.password === undefined
                    }
                    className={classes.submit}
                    onClick={handleSubmit}
                >
                    Sign Up
                </Button>
                <Snackbar open={error}
                    anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
                    autoHideDuration={4000} 
                    onClose={(event,reason) => {if(reason === 'clickaway') return; setError(false);}} 
                >
                    <Alert
                    onClose={(event,reason) => {if(reason === 'clickaway') return; setError(false);}}  
                    severity="error">
                        User already exists!
                    </Alert>
                </Snackbar>
                <Grid container>
                    <Grid item xs>
                    
                    </Grid>
                    <Grid item>
                    <MaterialLink
                        component={Link}
                        to={"/login"}
                    >
                        {"Already have an account? Log in here"}
                    </MaterialLink>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </form>
        </div>
        </Paper>
      
    <div style={{padding:30}}></div>
    </div>
  );

}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  
function Copyright() {
    return (
    <div style={{paddingBottom:10}}>
    <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <a href="#copyright" style={{color:'#1976d2'}}>Books</a>
        {' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
    </div>
    );
}