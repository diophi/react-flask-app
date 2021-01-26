import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import {Link, useLocation} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
   
    button:{
      color:'white',
      borderColor:'white',
      fontWeight:'bold',
    },
}));

const getFavoriteCount = async (userID) => {
    let count = await fetch('https://mostare1.pythonanywhere.com/api/favorite/user/count/' + userID)
    .then(response => response.json())
    .then(data => data[0].count);

   return count;
}



export default function UserMenu(props){
    const classes = useStyles();
    const location = useLocation();

    const user = props.userData;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [favoriteCount, setFavoriteCount] = React.useState(0);

    React.useEffect(()=>{
        getFavoriteCount(user.userID).then(data => setFavoriteCount(data));
    },[user.userID, props.rmh]);

    const handleClick = (event) => {
      if(anchorEl==null) setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return(
        <div>
            <IconButton 
                className={classes.button}  
                component={Link} 
                to="/favorites"
                replace={ location.pathname === "/favorites"}
                disableFocusRipple
            >
                <Badge badgeContent={favoriteCount} color="error" showZero>
                    <FavoriteBorderIcon fontSize='large'/>
                </Badge>
            </IconButton>

            <IconButton className={classes.button} onClick={handleClick}>
                <AccountCircleOutlinedIcon fontSize='large'/>
            </IconButton>
        
            <Menu
                elevation={6}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            > 
                <MenuItem button={false} style={{outline:'none'}}>
                    <ListItemIcon>
                    <Avatar>{user.firstName.charAt(0) + user.lastName.charAt(0)} </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                        primary={user.firstName + " " + user.lastName} 
                        secondary={user.email}
                    />
                </MenuItem>
                <MenuItem button={false} style={{outline:'none',paddingLeft: 65, marginTop: -10}}>
                    <Button color="primary">About account</Button>
                </MenuItem>
                <Divider/>
                {user.isAdmin?
                <MenuItem 
                    button
                    component={Link} 
                    to="/admin"
                    replace={ location.pathname === "/admin"}
                    onClick={handleClose}
                >
                    <ListItemIcon>
                        <AssignmentIndIcon/>    
                    </ListItemIcon>
                    <ListItemText primary="Admin Panel"/>
                </MenuItem>
                :null
                }           
                <MenuItem >
                    <ListItemIcon>
                        <SettingsIcon/>    
                    </ListItemIcon>
                    <ListItemText primary="Settings"/>
                </MenuItem>
                <MenuItem >
                    <ListItemIcon>
                        <HelpIcon/>    
                    </ListItemIcon>
                    <ListItemText primary="Help"/>
                </MenuItem>
                <MenuItem
                    onClick={()=>{handleClose(); props.logOut();}}
                >
                    <ListItemIcon>
                        <ExitToAppIcon/>    
                    </ListItemIcon>
                    <ListItemText primary="Log out"/>
                </MenuItem>
            </Menu>
        </div>
    );
}