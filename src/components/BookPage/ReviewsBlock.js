import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/Group';
import Collapse from '@material-ui/core/Collapse';

import Review from './Review';
import WriteReviewButton from './WriteReviewButton';

const useStyles = makeStyles((theme) => ({
    root:{
        paddingBottom:30,
    },
    reviewTitleBox:{
        margin:'2rem',
        marginLeft: '3rem',
        marginRight: '3rem',
        alignItems:'baseline',
        marginBottom:'3rem',
    },
    reviewTitle:{
        flex:1,
    },
    reviewsCount:{
        color:'#aaa',
        fontSize:14,
        display:'flex',
        alignItems:'center',
    },
    reviewsBox:{
        margin:'calc(2rem - 20px)',
        marginLeft: '3rem',
        marginRight: '3rem',
    }

}));

const getReviews = async (bookID) => {
    let reviews = await fetch('/api/review/'+bookID)
    .then(response => response.json())
    .then(data => data);

   return reviews;
}

export default function ReviewsBlock(props){

    const classes = useStyles();

    const bookData = props.bookData;

    const [reviews, setReviews] = React.useState([]);
    const [remount, setRemount] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [holdReviews, setHoldReviews] = React.useState(true);

    React.useEffect(() => {
        getReviews(bookData.bookID)
        .then(data => {
            setCount(data.length);
            holdReviews ? setReviews(data.splice(0,3)) : setReviews(data);
        });

       // return () =>{ setReviews([]); };
    },[bookData.bookID, remount, holdReviews])

    const updateReviews = () => { setRemount(!remount); }; 

    return(
        <div className={classes.root}>
            <Box component="div" overflow="visible" display="flex"  className={classes.reviewTitleBox}>
                <Box className={classes.reviewTitle}>
                    <Typography>
                        REVIEWS
                    </Typography>
                    <Typography className={classes.reviewsCount}>
                        <GroupIcon style={{color:'grey'}}/>
                        {count + " total"}
                    </Typography>
                </Box>
                <WriteReviewButton bookData={bookData} user={props.user} updateReviews={updateReviews}/>
            </Box>
            <Box component="div" overflow="visible" className={classes.reviewsBox}>
                <Collapse in={reviews.length > 0 ? true: false}>
                    {reviews.map((review, index)=>(
                        <Review key={index} data={review}/>
                    ))}
                </Collapse>
            </Box>
            <Box textAlign="center">
                <Button 
                    color="primary"
                    onClick={()=> setHoldReviews(!holdReviews)}
                >
                    { holdReviews ? 'Read all reviews' : 'Read less'}
                </Button>
            </Box>
        </div>
    );
}