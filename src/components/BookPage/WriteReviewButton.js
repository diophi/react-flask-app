import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateIcon from '@material-ui/icons/Create';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles((theme) => ({
    button:{
		color:'dimgrey',
		backgroundColor:'white',
		border:'1px solid #bbb'
    },
    image:{
        width:125,
        height:190,
        boxShadow: '0px 0px 10px 0px',
	},
	starIcon:{
		color:theme.palette.primary.main,
		marginTop:'-3px',
		//color: 'white',
	},
	slider:{
		maxWidth:300,
		marginRight:20,
	},
	ratingBox:{
		marginTop:30,
		marginBottom:20,
	}

}));

const uploadReview = async (reviewData) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    };
    
    await fetch('https://mostare1.pythonanywhere.com/api/add-review', requestOptions);
          
}

export default function WriteReviewDialog(props) {
	const classes = useStyles();
	const bookData = props.bookData;
	const user = props.user;

	const [open, setOpen] = React.useState(false);
	const [reviewData, setReviewData] = React.useState({});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = () => {
		reviewData.userID = user.userID;
		reviewData.bookID = bookData.bookID;
		reviewData.likes = 0;
		reviewData.date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
		uploadReview(reviewData).then(() => props.updateReviews());
		setOpen(false);
	}

	return (
		<div>
			<Button
				variant="contained"
				color="default"
				className={classes.button}
				startIcon={<CreateIcon/>}
				onClick={handleClickOpen}
			>
				Write a review
			</Button>
			{user.username !== ''?
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">
						Review by {user.firstName + " " + user.lastName}
					</DialogTitle>
					<Divider/>
					<DialogContent>
						<DialogContentText>
							Reviews are public and editable. 
							Past edits are visible to the developer and users unless you delete your review altogether.
						</DialogContentText>
						<Grid container>
							<Grid item xs={3}>
								<img src={"/resources/" + (bookData.coverPicture || "cover.jpg")} alt="" className={classes.image}/>
							</Grid>
							<Grid item xs={9}>
								<TextField
									id="outlined-multiline-static"
									placeholder="Tell others what you think about this book. Would you recommend it, and why?"
									fullWidth
									multiline
									rows={8}
									variant="outlined"
									onChange={ 
										(event) => {
											reviewData.textContent=event.target.value; 
											setReviewData({...reviewData})
										}
									}
								/>
							</Grid>
						</Grid>
						<Box display="flex" justifyContent="flex-end" className={classes.ratingBox}>
							<StarRating 
								setData={
									(rating) => {
										reviewData.rating=rating;
										setReviewData({...reviewData})
									}
								}
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} variant="outlined" color="primary">
							Cancel
						</Button>
						<Button onClick={handleSubmit} variant="contained" color="primary">
							Submit
						</Button>
					</DialogActions>
				</Dialog>:
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogContent>
						<DialogContentText>
							You must be logged to post a review.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} variant="outlined" color="primary">
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			}
		</div>
	);
}

function StarRating(props){
	const classes = useStyles();

	const [stars, setStars] = React.useState([0,0,0,0,0]);
	const [blocked, setBlocked] = React.useState(false);
	const [lastIndex, setLastIndex] = React.useState(-1);

	let updateStarsOnEnter = (event) =>{
		if(!blocked){
			let index = event.target.value;
			let new_stars = [0,0,0,0,0];
			for(let i=0;i<=index;i++){
				new_stars[i] = 1;
			}
			setStars(new_stars);
		}
	}

	let updateStarsOnLeave = (event) =>{
		if(!blocked){
			let index = event.target.value;
			let new_stars = [0,0,0,0,0];
			for(let i=0;i<index;i++){
				new_stars[i] = 1;
			}
			setStars(new_stars);
		}
	}

	let resetStars = () =>{
		if(!blocked)
			setStars([0,0,0,0,0]);
	}

	let clickStar = (event) =>{
		let index = event.currentTarget.value;
		if(lastIndex === -1){
			setLastIndex(index);
			setBlocked(true);
			props.setData(getValue(stars));
		}
		else if(index!==lastIndex){
			setBlocked(true);
			let new_stars = [0,0,0,0,0];
			for(let i=0;i<=index;i++){
				new_stars[i] = 1;
			}
			setLastIndex(index);
			setStars(new_stars);
			props.setData(getValue(stars));
		}
		else if(index===lastIndex){
			setBlocked(false);
			setLastIndex(-1);
			props.setData(0);
		}
		
	}

	let getValue = (starss) =>{
		let count = 0;
		starss.forEach(star => {if(star) count++;});
		return count;
	}

	return(
		<div onMouseLeave={resetStars}>
			{stars.map((star,index)=>(
				star === 0 ?
				<IconButton key={index} value={index} onMouseEnter={updateStarsOnEnter} onClick={clickStar}>
					<StarBorderIcon className={classes.starIcon} fontSize="large"/>
				</IconButton>:
				<IconButton key={index} value={index} onMouseLeave={updateStarsOnLeave} onClick={clickStar}>
					<StarIcon className={classes.starIcon} fontSize="large"/>
				</IconButton>
			
			))}
		</div>
	);
}