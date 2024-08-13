import React,{ useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import { useFetch } from "../../hooks/useFetch";
import { useStore } from "../Tree/Tree";


export const EditFetching = (props:any) => {
  const [open, setOpen] = useState(true);
  const refresh  = useStore((state:any) => state.refresh)
  const { data, isPending, error, completed } = useFetch(props.url, refresh);

  let message = (
    <>
      <CircularProgress />
    </>
  );
  if(completed && !isPending) {
    message = (
      <>
        Successfully edited the node!
      </>
      )
  } else if (!completed && !isPending && error) {
    message = (
      <>
        Error: {error} 
      </>
      )
  }

  return (
    <Dialog
      open={open}
      onClose={props.handleClose}
    >
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export const EditDialog = (props:any) => {
  const setEditFormShow = useStore((state:any) => state.setEditFormShow);
  const toggleRefresh = useStore((state:any) => state.toggleRefresh);

  const [open, setOpen] = useState(true);
  const [nodeName, setNodeName] = useState('');

  const [url, setUrl] = useState('');
  const [startedFetch, setStartedFetch] = useState(false);
  

  const handleClose = () => {
    setOpen(false);
    setEditFormShow(false);
    toggleRefresh();
  };

  const handleSubmit = () => {
    setUrl(props.url+nodeName);
    setStartedFetch(true);
  };

  const handleNameChange = (event:any) => {
    setNodeName(event.target.value);
  };

  const editDialog = (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <TextField
          autoComplete="false"
          autoFocus
          margin="dense"
          id="name"
          label="New node name"
          onChange={handleNameChange}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Edit</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <React.Fragment>
      {!startedFetch && editDialog}
      {startedFetch && <EditFetching url={url} handleClose={handleClose}/>}
    </React.Fragment>
  );
}