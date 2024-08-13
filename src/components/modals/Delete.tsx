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


export const DeleteFetching = (props:any) => {
  const [open, setOpen] = useState(true);
  const refresh  = useStore((state:any) => state.refresh)
  const { data, isPending, error, completed } = useFetch(props.url, refresh);

  let message = (
    <>
      <CircularProgress />
    </>
  );
  if(completed && !isPending && !data) {
    message = (
      <>
        Successfully deleted the node!
      </>
      )
  } else if(completed && !isPending && data) {
    message = (
      <>
        Error: {data.data.message} 
      </>
      )
  } else if(!isPending && error) {
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
      <DialogTitle>Delete</DialogTitle>
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

export const DeleteDialog = (props:any) => {
  const setDeleteFormShow = useStore((state:any) => state.setDeleteFormShow);
  const toggleRefresh = useStore((state:any) => state.toggleRefresh);

  const [open, setOpen] = useState(true);

  const [url, setUrl] = useState('');
  const [startedFetch, setStartedFetch] = useState(false);
  

  const handleClose = () => {
    setOpen(false);
    setDeleteFormShow(false);
    toggleRefresh();
  };

  const handleSubmit = () => {
    setUrl(props.url);
    setStartedFetch(true);
  };

  const addDialog = (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {'Do you want to delete Node: ' + props.nodename}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Delete</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <React.Fragment>
      {!startedFetch && addDialog}
      {startedFetch && <DeleteFetching url={url} handleClose={handleClose}/>}
    </React.Fragment>
  );
}