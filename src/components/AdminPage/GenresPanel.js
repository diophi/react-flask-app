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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));


let getGenres = async () => {
    let genres = await fetch('https://mostare1.pythonanywhere.com/api/admin/getgenres')
    .then(response => response.json())
    .then(data => data);
    
    return genres;
}

let deleteGenres = async (id) => {
    let result = await fetch('https://mostare1.pythonanywhere.com/api/admin/deletegenres/'+id)
    .then(response => response)
    .then(data => data);
    
    return result;
}

let updateGenres = async (data) => {
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data})
    };
      
    let results = fetch('https://mostare1.pythonanywhere.com/api/admin/updategenres', requestOptions)
    .then(response => response)
    .then(data => data);
}

let addGenres = async (data) => {
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data})
    };
      
    let results = fetch('https://mostare1.pythonanywhere.com/api/admin/addgenres', requestOptions)
    .then(response => response)
    .then(data => data);
}


export default function GenresPanel() {
    const classes = useStyles();

    const [genres, setGenres] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState({});

    React.useEffect(()=>{
        getGenres().then(data => setGenres(data));
    },[refresh]);

    const deleteRow = (event) => {
        const id = event.currentTarget.value;
        deleteGenres(id).then(() => setRefresh(refresh => !refresh));
    };

    const handleOpenDialog = (event) => {
        const index = event.currentTarget.value;
        setSelectedRow(genres[index]);
        setOpenDialog(true);
    }
    
    const handleOpenDialogNewEntry = () => {
        setSelectedRow({newEntry:true});
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRefresh(refresh => !refresh)
    }

    return (
    <div style={{paddingBottom:50}}>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Info</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {genres.map((row, index) => (
                <TableRow key={row.genreID}>
                    <TableCell >{row.name}</TableCell>
                    <TableCell >{row.info}</TableCell>
                    <TableCell align="right">
                        <IconButton
                            value={index}
                            onClick={event => handleOpenDialog(event)}
                        >
                            <EditIcon/>
                        </IconButton>
                    </TableCell>
                    <TableCell align="right">
                        <IconButton
                            value={row.genreID}
                            onClick={(event) => deleteRow(event)}
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
            data={selectedRow}
            handleClickOpen={handleOpenDialog}
            handleClose={handleCloseDialog}
        />
         <Fab 
            className={classes.fab} 
            variant="extended" 
            style={{backgroundColor:'coral', color:'white'}}
            onClick={handleOpenDialogNewEntry}
        >
            <EditIcon/>
            New Genre
        </Fab>
    </div>
    );
}

function FormDialog(props) {
    const open = props.open;
    const handleClose = props.handleClose;

    const [data, setData] = React.useState({});

    React.useEffect(()=>{
        setData(props.data);
    },[props.data])
  
    return (
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              {data.newEntry === true ? 'Insert' : 'Update'} Genre
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    *To change the entry just modify the previous values and hit update
                </DialogContentText>
                <TextField
                    autoFocus margin="dense" label="Name" fullWidth
                    value={data.name || ''}
                    onChange={
                        (event) => {
                            data.name=event.target.value;
                            setData({...data})
                    }}
                />
                <TextField margin="dense" label="Info" fullWidth
                    multiline
                    rows={4}
                    value={data.info || ''}
                    onChange={
                        (event) => {
                            data.info=event.target.value;
                            setData({...data})
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={() => {handleClose();}} 
                    color="primary"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={() => {
                        data.newEntry === true ?
                        addGenres(data):
                        updateGenres(data);

                        handleClose();
                    }} 
                    color="primary"
                >
                    {data.newEntry === true ? 'Insert' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
      </div>
    );
  }