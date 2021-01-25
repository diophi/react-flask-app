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


let getPublishers = async () => {
    let publishers = await fetch('/api/admin/getpublishers')
    .then(response => response.json())
    .then(data => data);
    
    return publishers;
}

let deletePublishers = async (id) => {
    let result = await fetch('/api/admin/deletepublishers/'+id)
    .then(response => response)
    .then(data => data);
    
    return result;
}

let updatePublishers = async (data) => {
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data})
    };
      
    let results = fetch('api/admin/updatepublishers', requestOptions)
    .then(response => response)
    .then(data => data);
}

let addPublishers = async (data) => {
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data})
    };
      
    let results = fetch('api/admin/addpublishers', requestOptions)
    .then(response => response)
    .then(data => data);
}

export default function AuthorsPanel() {
    const classes = useStyles();

    const [publishers, setPublishers] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState({});

    React.useEffect(()=>{
        getPublishers().then(data => setPublishers(data));
    },[refresh]);

    const deleteRow = (event) => {
        const id = event.currentTarget.value;
        deletePublishers(id).then(() => setRefresh(refresh => !refresh));
    };

    const handleOpenDialog = (event) => {
        const index = event.currentTarget.value;
        setSelectedRow(publishers[index]);
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
    <div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell >Name</TableCell>
                <TableCell >Email</TableCell>
                <TableCell >Phone</TableCell>
                <TableCell >Address</TableCell>
                <TableCell >Description</TableCell>
                <TableCell >Edit</TableCell>
                <TableCell >Delete</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {publishers.map((row,index) => (
                <TableRow key={row.publisherID}>
                    <TableCell style={{minWidth:130}}>{row.name}</TableCell>
                    <TableCell >{row.email}</TableCell>
                    <TableCell >{row.phone}</TableCell>
                    <TableCell style={{minWidth:100}}>{row.address}</TableCell>
                    <TableCell >{row.description}</TableCell>
                    <TableCell>
                        <IconButton
                            value={index}
                            onClick={event => handleOpenDialog(event)}
                        >
                            <EditIcon/>
                        </IconButton>
                    </TableCell>
                    <TableCell >
                        <IconButton 
                            value={row.publisherID} 
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
            color="secondary"
            onClick={handleOpenDialogNewEntry}
        >
            <EditIcon/>
            New Publisher
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
      <div style={{paddingBottom:50}}>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              {data.newEntry === true ? 'Insert' : 'Update'} Publisher
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
                <TextField
                    margin="dense" label="Email" fullWidth
                    value={data.email || ''}
                    onChange={
                        (event) => {
                            data.email=event.target.value;
                            setData({...data})
                    }}
                />
                <TextField margin="dense" label="Phone" fullWidth
                    value={data.phone || ''}
                    onChange={
                        (event) => {
                            data.phone=event.target.value;
                            setData({...data})
                    }}
                />
                <TextField margin="dense" label="Address" fullWidth
                    value={data.address || ''}
                    onChange={
                        (event) => {
                            data.address=event.target.value;
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
                        addPublishers(data):
                        updatePublishers(data);

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