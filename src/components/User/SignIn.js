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

import { Link, useLocation } from "react-router-dom";


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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
    <div style={{paddingBottom:10}}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <a href="#" style={{color:'#1976d2'}}>Books</a>
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      </div>
    );
}

export default function SignInSide(props) {
  const classes = useStyles();

  const [currUser, setCurrUser] = useState({username:'',password:''});
  const [error, setError] = useState(false);
  
  useEffect(() => {
    return () => {setCurrUser({username:'',password:''});}
  },[])
   
  let checkUser = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currUser.username, password: currUser.password})
    };
    
    fetch('/api/login', requestOptions)
          .then(response => response.json())
          .then(data =>{ 
            data.length > 0 ? props.setUser(data[0]): setError(true);
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
    <div>

    </div>
    
      <Paper elevation={3} style={{marginTop:'10vh',maxWidth:'700px', minWidth:'300px'}}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange = { (event) => {currUser.username=event.target.value; setCurrUser({...currUser})}}
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
              onChange = { (event) => {currUser.password=event.target.value; setCurrUser({...currUser})}}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              //type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick = { ()=>{checkUser(); }}
            >
              Sign In
            </Button>
            <Snackbar open={error}
                anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
                autoHideDuration={4000} 
                onClose={(event,reason) => {if(reason === 'clickaway') return; setError(false);}} 
            >
                <Alert
                onClose={(event,reason) => {if(reason === 'clickaway') return; setError(false);}}  
                severity="error">
                    User not found!
                </Alert>
            </Snackbar>
            <Grid container>
              <Grid item xs>
                <MaterialLink href="#" variant="body2">
                  Forgot password?
                </MaterialLink>
              </Grid>
              <Grid item>
                <MaterialLink
                    component={Link}
                    to={"/signup"}
                >
                    {"Don't have an account? Sign Up"}
                </MaterialLink>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
          </div>
        </Paper>
      
        <div style={{padding:40}}></div>
    </div>
  );

}