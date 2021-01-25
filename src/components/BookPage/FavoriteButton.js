import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';

const addToFavorite = async (bookID, userID) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookID: bookID, userID: userID})
    };
    
    await fetch('/api/favorite/add', requestOptions);
          
}

const deleteFromFavorite = async (bookID, userID) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookID: bookID, userID: userID})
    };
    
    await fetch('/api/favorite/delete', requestOptions);
          
}

const checkFavorite = async (bookID, userID) => {
    let isFavorite = await fetch('/api/favorite/check/' + bookID + "-" + userID)
    .then(response => response.json())
    .then(data => data.length > 0 ? true : false);
    
    return isFavorite;
}


export default function FavoriteButton(props){
    const bookData = props.bookData;
    const user = props.user;

    const [isFavorite, setIsFavorite] = React.useState(null);

    React.useEffect(()=>{
        checkFavorite(bookData.bookID, user.userID).then(data => setIsFavorite(data));
    },[bookData.bookID, user.userID])


    const handleAddFavorite = () => {
        addToFavorite(bookData.bookID, user.userID);
        setIsFavorite(true);
        props.remountHeader();
    }

    const handleRemoveFavorite = () => {
        deleteFromFavorite(bookData.bookID, user.userID);
        setIsFavorite(false);
        props.remountHeader();
    }

    return(
        <>
        {!isFavorite ?
            <Tooltip title="Add to favorites" placement="top">
                <IconButton
                    onClick={handleAddFavorite}
                >
                    <FavoriteIcon/>
                </IconButton>
            </Tooltip>:
            <Tooltip title="Remove from favorites" placement="top">
                <IconButton
                    onClick={handleRemoveFavorite}
                >
                    <FavoriteIcon style={{color:'red'}}/>
                </IconButton>
            </Tooltip>
        }
        </>
    );
}