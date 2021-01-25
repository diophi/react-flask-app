import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from '@material-ui/core/Fab';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
      },
}));


let getBooks = async () => {
    let books = await fetch('/api/admin/getbooks')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

let deleteBooks = async (id) => {
    let result = await fetch('/api/admin/deletebooks/'+id)
    .then(response => response)
    .then(data => data);
    
    return result;
}

export default function GenresPanel() {
    const classes = useStyles();

    const [books, setBooks] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);

    React.useEffect(()=>{
        getBooks().then(data => setBooks(data));
    },[refresh]);

    const handleOpenDialog = (event) => {
        setOpenDialog(true);
    }
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRefresh(refresh => !refresh)
    }

    const deleteRow = (event) => {
        const id = event.currentTarget.value;
        deleteBooks(id).then(() => setRefresh(refresh => !refresh));
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Authors</TableCell>
                    <TableCell>Genres</TableCell>
                    <TableCell>Publisher</TableCell>
                    <TableCell>Is Digital</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Pages</TableCell>
                    <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {books.map((row) => (
                    <TableRow key={row.bookID}>
                        <TableCell style={{minWidth:150}}>{row.title}</TableCell>
                        <TableCell size='small'>{row.description}</TableCell>
                        <TableCell style={{minWidth:120}}>{row.authors}</TableCell>
                        <TableCell style={{minWidth:120}}>{row.genres}</TableCell>
                        <TableCell >{row.publisherName}</TableCell>
                        <TableCell >{row.isDigital === 1? 'Yes' : 'No'}</TableCell>
                        <TableCell >{row.price}</TableCell>
                        <TableCell >{row.pages}</TableCell>
                        <TableCell >
                            <IconButton
                                value={row.bookID}
                                onClick={(event) => { deleteRow(event); }}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <FormDialog
                open={openDialog}
                handleClickOpen={handleOpenDialog}
                handleClose={handleCloseDialog}
            />
            <Fab 
                className={classes.fab} 
                variant="extended" 
                style={{
                    background:'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(4,125,197,1) 69%, rgba(0,212,255,1) 100%)',
                    color:'white'
                }}
                onClick={handleOpenDialog}
            >
                <EditIcon/>
                New Book
            </Fab>
        </div>
    );
}

let getAuthors = async () => {
    let books = await fetch('/api/admin/getauthors')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

let getPublishers = async () => {
    let books = await fetch('/api/admin/getpublishers')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

let getGenres = async () => {
    let books = await fetch('/api/admin/getgenres')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

let addBook = async (bookData, publisher, authors, genres) => {
    
    let bookID;

    console.log(publisher);
    console.log(authors);
    console.log(genres);
    bookData.isDigital = bookData.isDigital === true ? 1 : 0;
    bookData.publisherID = publisher.publisherID;

    console.log(bookData);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...bookData})
    };
        
    fetch('api/admin/addbooks', requestOptions)
    .then(response => response.json())
    .then(data => {
        bookID = data[0].bookID;
        console.log(bookID);
        authors.forEach((author)=>{
         fetch('api/admin/authorbond/'+ bookID +'/'+author.authorID);
        })

        genres.forEach((genre)=>{
            fetch('/api/admin/genrebond/'+ bookID +'/'+genre.genreID);
        })
    });

    
}

function FormDialog(props) {
    const classes = useStyles();
    const open = props.open;
    const handleClose = props.handleClose;

    const [data, setData] = React.useState({});
    const [authors, setAuthors] = React.useState([]);
    const [publishers, setPublishers] = React.useState([]);
    const [genres, setGenres] = React.useState([]);


    const [personName, setPersonName] = React.useState([]);
    const [publisherName, setPublisherName] = React.useState({});
    const [genreName, setGenreName] = React.useState([]);


    React.useEffect(()=>{
        getAuthors().then(data => setAuthors(data));
        getPublishers().then(data => {setPublishers(data); setPublisherName(data[0]);});
        getGenres().then(data => setGenres(data));

    },[open]);

    const handleChange = (event) => {
      setPersonName(event.target.value);
    };

    const handleChange2 = (event) => {
        setPublisherName(event.target.value);
    }

    const handleChange3 = (event) => {
        setGenreName(event.target.value);
    }

    const clearAll = () => {
        setData({});
        setPersonName([]);
        setGenreName([]);
        setPublisherName({});
    }

    return (
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              Insert Book
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    *To change the entry just modify the previous values and hit update
                </DialogContentText>
                <TextField
                    autoFocus margin="dense" label="Title" fullWidth
                    value={data.title || ''}
                    onChange={
                        (event) => {
                            data.title=event.target.value;
                            setData({...data})
                    }}
                />
                <TextField margin="dense" label="Description" fullWidth
                    multiline
                    rows={4}
                    value={data.description || ''}
                    onChange={
                        (event) => {
                            data.description=event.target.value;
                            setData({...data});
                    }}
                />
                <TextField
                    label="Date" type="date" style={{marginTop:10}} fullWidth
                    defaultValue="2020-05-24"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={(event) => {
                        data.date = event.target.value;
                        setData({...data});
                    }}
                    
                />
                <FormControlLabel style={{paddingTop:10, paddingBottom:10}}
                    control={
                        <Checkbox
                            checked={data.isDigital ||  false}
                            onChange={() => {
                                data.isDigital === undefined ? 
                                data.isDigital = true : data.isDigital = !data.isDigital;
                                setData({...data});
                            }}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    }
                    label="Is Digital"
                />
                <TextField margin="dense" label="Price" fullWidth
                    value={data.price || ''}
                    onChange={
                        (event) => {
                            data.price=event.target.value;
                            setData({...data});
                    }}
                />
                <TextField margin="dense" label="Pages" fullWidth
                    value={data.pages || ''}
                    onChange={
                        (event) => {
                            data.pages=event.target.value;
                            setData({...data});
                    }}
                />
                <FormControl className={classes.formControld} fullWidth>
                    <InputLabel>Publisher</InputLabel>
                    <Select
                        value={publisherName}
                        renderValue={(selected) => {
                            return selected.name === undefined ? '': selected.name;
                            
                        }}
                        onChange={handleChange2}
                    >
                        {publishers.map((publisher,index)=>(
                            <MenuItem key={index} value={publisher}>
                                {publisher.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControld} fullWidth>
                    <InputLabel>Authors</InputLabel>
                    <Select
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<Input />}
                        renderValue={(selected) => {
                            let str = '';
                            selected.forEach((val)=>{
                                str += ', ' + val.firstName + ' ' + val.lastName;
                            });
                            str = str.slice(1,str.length);
                            return str;
                        }}
                        MenuProps={MenuProps}
                    >
                        {authors.map((author, index) => (
                            <MenuItem key={index} value={author}>
                            <Checkbox checked={personName.indexOf(author) > -1} />
                            <ListItemText primary={author.firstName + ' ' + author.lastName} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControld} fullWidth>
                    <InputLabel>Genres</InputLabel>
                    <Select
                        multiple
                        value={genreName}
                        onChange={handleChange3}
                        input={<Input />}
                        renderValue={(selected) => {
                            let str = '';
                            selected.forEach((val)=>{
                                str += ', ' + val.name;
                            });
                            str = str.slice(1,str.length);
                            return str;
                        }}
                        MenuProps={MenuProps}
                    >
                        {genres.map((genre, index) => (
                            <MenuItem key={index} value={genre}>
                            <Checkbox checked={genreName.indexOf(genre) > -1} />
                            <ListItemText primary={genre.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={() => {clearAll(); handleClose();}} 
                    color="primary"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={() => {
                        addBook(data, publisherName, personName, genreName);
                        clearAll();
                        handleClose();
                    }} 
                    color="primary"
                >
                    Insert
                </Button>
            </DialogActions>
        </Dialog>
      </div>
    );
  }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};