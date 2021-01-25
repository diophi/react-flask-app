import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import MoodIcon from '@material-ui/icons/Mood';

import AuthorsPanel from './AuthorsPanel';
import PublishersPanel from './PublishersPanel';
import GenresPanel from './GenresPanel';
import BooksPanel from './BooksPanel';

export default function AdminPage() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const tabComponents = [
        {content: <Dashboard/>},
        {content: <AuthorsPanel/>},
        {content: <PublishersPanel/>},
        {content: <GenresPanel/>},
        {content: <BooksPanel/>},
    ]

    const handleChange = (event, newValue) => {
    setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Paper elevation={1}>
                <Tabs 
                    value={value} 
                    onChange={handleChange}
                    //centered
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Dashboard" {...a11yProps(0)} />
                    <Tab label="Authors" {...a11yProps(1)} />
                    <Tab label="Publishers" {...a11yProps(2)} />
                    <Tab label="Genres" {...a11yProps(3)} />
                    <Tab label="Books" {...a11yProps(4)} />
                </Tabs>
            </Paper>
            {tabComponents.map((comp,index) => (
                <TabPanel key={index} value={value} index={index}>
                    {comp.content}
                </TabPanel>
            ))}
        </div>
    );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
        backgroundColor: "#f5f5f5",
    marginLeft:20,
    marginRight:20,
    marginTop:15,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function Dashboard(){

    return(
        <Paper>
            <div style={{padding:30, paddingBottom:100}}>
                <Typography variant="h3"> Dashboard </Typography>
                <Typography variant="h5" style={{paddingTop:40}}>Here you can view the database.</Typography>
                <Typography variant="h6">You can also insert, update and delete entries.</Typography>
                <MoodIcon style={{fontSize:50}}/>
            </div>
        </Paper>
    );

}