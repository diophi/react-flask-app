import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Hidden from '@material-ui/core/Hidden';
import clsx from 'clsx';

import { Link, useLocation } from "react-router-dom";

import PermanentDrawer from './MainMenu/PermanentDrawer';
import TemporaryDrawer from './MainMenu/TemporaryDrawer';
import SearchBar from './SearchBar';
import SearchButton from './SearchButton';
import UserMenu from './UserMenu';


const drawerWidth = 270;

export default function AppHeader(props) {
    const classes = useStyles();
    const location = useLocation();

    const [openPerm, setOpenPerm] = React.useState(true);
    const [openTemp, setOpenTemp] = React.useState(false);

    const handlePermanentDrawerOpen = () => {
        openPerm ? setOpenPerm(false) : setOpenPerm(true);
    };

    const handleTemporaryDrawerOpen = () => {
        openTemp ? setOpenTemp(false) : setOpenTemp(true);
    };


    return (
        <div className={classes.root}>
            <AppBar 
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: openPerm,
                })}
            >
                <Toolbar>
                    <Grid container spacing={1} className={classes.gridContainer}>
                        <Grid item sm={3} className={classes.gridLeft}>
                            <Box display="flex" justifyContent="flex-start" alignItems="center" style={{height:'100%'}}>
                                <IconButton 
                                    edge="start" 
                                    className={classes.menuButton} 
                                    color="inherit" 
                                    aria-label="menu"
                                    onClick={()=>{
                                        handlePermanentDrawerOpen(); 
                                        handleTemporaryDrawerOpen()
                                    }}
                                >
                                    <MenuIcon/>
                                </IconButton>
                                <Typography
                                    className={classes.title}
                                    variant="h6" 
                                    component={Link}
                                    to="/"
                                    replace={location.pathname === "/"}
                                >
                                    <MenuBookIcon style={{marginTop:'-5px'}}/>
                                    Books
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item sm={6} className={classes.gridCenter}>
                            <Box display="flex" justifyContent="center" alignItems="center" style={{height:'100%'}}>
                                <SearchBar/>
                            </Box>
                        </Grid>
                        <Grid item sm={3} className={classes.gridRight}>
                            <Box display="flex" justifyContent="flex-end" alignItems="center" style={{height:'100%'}}>
                                <Hidden smUp>
                                    <SearchButton/>
                                </Hidden>
                                {props.isLogged?
                                    <UserMenu 
                                        userData={props.userData} 
                                        logOut={props.logOut} 
                                        rmh={props.rmh}
                                    />:
                                    <div>
                                        <Button
                                            className={classes.loginButton}
                                            variant="outlined"
                                            component={Link}
                                            to="/login"
                                            replace={location.pathname === "/login"}
                                        >
                                            Log in 
                                        </Button>
                                        <Button
                                            className={classes.button}
                                            variant="outlined"
                                            component={Link}
                                            to="/signup"
                                            replace={location.pathname === "/signup"}
                                        >
                                            Sign up 
                                        </Button>
                                    </div>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Hidden mdDown>
                <PermanentDrawer open={openPerm}/>
            </Hidden>
            <Hidden lgUp>
                <TemporaryDrawer open={openTemp} toggleDrawer={handleTemporaryDrawerOpen}/>
            </Hidden>

        </div>
    );

}

const useStyles = makeStyles((theme) => ({
    root: {
      //flexGrow: 0.5,
    },
    title: {
      textDecoration: 'none',
      color: 'white',
      fontWeight:'bold',
      display:'flex',
      alignItems:'center',
      marginLeft:10,
    },
    button:{
      color:'white',
      borderColor:'white',
      fontWeight:'bold',
    },
    loginButton:{
        color:'white',
        borderColor:'white',
        fontWeight:'bold',
        marginRight: theme.spacing(2),
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: 0,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    gridContainer:{
        [theme.breakpoints.up('sm')]: {
            display:'flex',
        },
    },
    gridLeft:{
        //flex:0,
        [theme.breakpoints.down('sm')]: {
            flex:1,
        },
    },
    gridCenter:{
        display:'block',
        [theme.breakpoints.down('sm')]: {
            display:'none',
        },
        [theme.breakpoints.up('sm')]: {
            display:'block',
        },
    },
    gridRight:{

    }
    
}));