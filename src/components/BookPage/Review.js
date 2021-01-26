import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom:20,
        paddingLeft:'2%',
    },
    avatar:{
        marginTop:5,
        backgroundColor: 'orange',
    },
    dateRating:{
        color:'#aaa',
        fontSize:15,
    },
    starIcon:{
        fontSize:'1rem',
        marginBottom: '-1.5px',
        marginRight:'10px',
    },
    textBody:{
        fontFamily: 'system-ui',
        fontWeight: 300,
        color:"333333"
    }

}));


export default function Review(props){
    const classes = useStyles();

    const data = props.data;

    let getShortDate =  () => {
        return data.date.substring(0, data.date.length - 12);
    }

    return(
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Avatar className={classes.avatar}>                       
                        {data.firstName.charAt(0) + data.lastName.charAt(0)}
                    </Avatar>
                </Grid>
                <Grid item xs={10}>
                    <Typography>
                        {data.firstName + " " + data.lastName}
                    </Typography>
                    <Typography  variant="body2" className={classes.dateRating}>
                        {data.rating + '/5'} <StarIcon className={classes.starIcon}/>
                        { 
                           getShortDate()
                        }
                    </Typography>
                    <Typography  variant="body2" className={classes.textBody}>
                        {data.textContent}
                    </Typography>
                </Grid>
                <Grid item xs={1} style={{textAlign:'center'}}>
                    <IconButton>
                        <ThumbUpIcon/>
                    </IconButton>
                    <Typography variant="caption" display="block">
                        {data.likes}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}