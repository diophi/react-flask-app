import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';

import {Link, useLocation} from 'react-router-dom';

import MainMenu from './MainMenu';

const drawerWidth = 240;


export default function TemporaryDrawer(props) {
    const classes = useStyles();
    const location = useLocation();

    const open = props.open;
    const toggleDrawer = props.toggleDrawer;

    return (
        <Drawer anchor={'left'} open={open} onClose={toggleDrawer}>
            <List style={{paddingTop:0, paddingBottom:0}}>
                <ListItem>
                    <ListItemIcon> 
                        <IconButton 
                            edge="start" 
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
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
                    </ListItemText>
                </ListItem>
            </List>
            <Divider/>
            <MainMenu toggleDrawer={toggleDrawer}/>
        
        </Drawer>
    );

}

const useStyles = makeStyles((theme) => ({
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
    title: {
        textDecoration: 'none',
        color: '#000000DE',
        fontWeight:'bold',
        display:'flex',
        alignItems:'center',
    },
}));