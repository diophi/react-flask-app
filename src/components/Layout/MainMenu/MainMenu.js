import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import WorkIcon from '@material-ui/icons/Work';
import FaceIcon from '@material-ui/icons/Face';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Collapse from '@material-ui/core/Collapse';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ExploreIcon from '@material-ui/icons/Explore';

import { Link, useLocation } from "react-router-dom";
import { Box } from '@material-ui/core';

let getAllGenres = async () => {
    let genres = await fetch('/api/allgenres')
    .then(response => response.json())
    .then(data => data);
    
    return genres;
}


const menuList = [
    {
        name: 'Home',
        icon: <HomeIcon/>,
        path: '/',
    },
    {
        name: 'Books',
        icon: <LibraryBooksIcon/>,
        path: '/books',

    },
    {
        name: 'Authors',
        icon: <FaceIcon/>,
        path: '/authors',
    },
    {
        name: 'Publishers',
        icon: <WorkIcon/>,
        path: '/publishers',
    }
]


export default function MainMenu(props) {
    const location = useLocation();
    const toggleDrawer = props.toggleDrawer;

    const [open, setOpen] = React.useState(true);
    const [genres, setGenres] = React.useState([]);

    React.useEffect(()=>{
        getAllGenres().then(data => setGenres(data));
    },[])

    const handleClick = () => {
      setOpen(!open);
    };


    return(
        <Box display="flex" flexDirection="column" style={{height:'100%'}}>
            <List style={{width:240, flex:1}}>
            {menuList.map((item, index) => (
                <ListItem 
                    button
                    onClick={toggleDrawer}
                    key={index} 
                    component={Link}
                    to={item.path}
                    replace={location.pathname === item.path}
                >
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItem>
            ))}
                <Divider />
                <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <ExploreIcon/>
                </ListItemIcon>
                <ListItemText primary={"Genres"} />
                {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open && (genres.length > 0)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {genres.map((genre,index) => (
                            <ListItem 
                                button 
                                key={index} 
                                style={{paddingLeft:'2rem'}}
                                component={Link}
                                to={"/genre/" + genre.name}
                                replace={location.pathname === ("/genre/" + genre.name)}
                            >
                                <ListItemIcon>
                                    <SubdirectoryArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary={genre.name} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </List>
            <Copyright/>
        </Box>
    );
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