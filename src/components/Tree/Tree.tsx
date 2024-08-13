import React, { useState, useContext, useMemo, memo }  from 'react';

import { create } from 'zustand'

import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView} from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, TreeItem2Props, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AlertDialog } from '../modals/Alert'
import { AddDialog } from '../modals/Add'
import { EditDialog } from '../modals/Edit'
import { DeleteDialog } from '../modals/Delete'

import { useFetch, getUrl } from "../../hooks/useFetch";
import { ApiContext } from '../../App';

export const useStore = create((set) => ({
  lastSelectedItem: null,
  lastSelectedName: null,
  addFormShow: false,
  deleteFormShow: false,
  editFormShow: false,
  refresh : false,

  setAddFormShow: (value:boolean) => set((state:any) => ({ addFormShow: value })),
  setDeleteFormShow: (value:boolean) => set((state:any) => ({ deleteFormShow: value })),
  setEditFormShow: (value:boolean) => set((state:any) => ({ editFormShow: value })),
  setLastSelectedItem: (id:string) => set((state:any) => ({ lastSelectedItem: id })),
  setLastSelectedName: (name:string) => set((state:any) => ({ lastSelectedName: name })),
  toggleRefresh: () => set((state:any) => ({ refresh: !state.refresh }))
  
}))

const TreeItemLabelExtended = memo(function TreeItemLabelExtended(props: {
  children: string;
  selected: boolean;
  isroot: boolean;
}) {
  const { children, selected, isroot } = props;

  const setAddFormShow = useStore((state:any) => state.setAddFormShow)
  const setEditFormShow = useStore((state:any) => state.setEditFormShow)
  const setDeleteFormShow = useStore((state:any) => state.setDeleteFormShow)

  const handleAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAddFormShow(true);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditFormShow(true);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteFormShow(true);
  };

  const icons = useMemo(() => {
    if (!isroot) {
      return (<>
        <IconButton aria-label="add" size="small" color="primary" onClick={handleAdd}>
          <AddIcon fontSize="inherit" />
        </IconButton>
        <IconButton aria-label="edit" size="small" color="primary" onClick={handleEdit}>
          <EditIcon fontSize="inherit" />
        </IconButton>
        <IconButton aria-label="delete" size="small" color="secondary" onClick={handleDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </>)
    } else {
      return (<>
        <IconButton aria-label="add" size="small" color="primary" onClick={handleAdd}>
          <AddIcon fontSize="inherit" />
        </IconButton>
      </>)
    }
  }, []);
      
  return (
    <TreeItem2Label>
      {children}
      {selected && icons }
    </TreeItem2Label>
  );
})

function TreeItemExtended(props: TreeItem2Props) {
  const lastSelectedItem = useStore((state:any) => state.lastSelectedItem)
  const { itemId } = props;
  const isSelected = lastSelectedItem === itemId;
  const isRoot = itemId === 18586;//:)

  return (
    <TreeItem2 {...props}
      slots={{
        label: TreeItemLabelExtended
      }}
      slotProps={{
        label: {
          'selected': isSelected,
          'isroot' : isRoot
        }
      }}
    />

  );
}


export default function Tree() {

  const lastSelectedItem = useStore((state:any) => state.lastSelectedItem)
  const lastSelectedName = useStore((state:any) => state.lastSelectedName)
  const setLastSelectedItem = useStore((state:any) => state.setLastSelectedItem)
  const setLastSelectedName = useStore((state:any) => state.setLastSelectedName)
  const addFormShow  = useStore((state:any) => state.addFormShow)
  const editFormShow  = useStore((state:any) => state.editFormShow)
  const deleteFormShow  = useStore((state:any) => state.deleteFormShow)
  const refresh  = useStore((state:any) => state.refresh)
  
  const CONSTANTS = useContext(ApiContext);

  const url = getUrl(CONSTANTS.GET_URL, CONSTANTS.TREE_NAME);

  const { data, isPending, error } = useFetch(url, refresh);
  let tree = [],
      loaded = false;
  if(!isPending && data) {
    tree.push({id: data.id, name: 'Root: ' + data.name, children: data.children});
    loaded = true;
  }

 // Add Form
  let add_url = null;
  if(addFormShow) {
    add_url = `${CONSTANTS.ADD_URL}?treeName=%7B${CONSTANTS.TREE_NAME}%7D&parentNodeId=${lastSelectedItem}&NodeName=`;
  }

  // Edit Form
  let edit_url = null;
  if(editFormShow) {
    edit_url = `${CONSTANTS.EDIT_URL}?treeName=%7B${CONSTANTS.TREE_NAME}%7D&nodeId=${lastSelectedItem}&newNodeName=`;
  }

  // Delete Form
  let delete_url = null;
  if(deleteFormShow) {
    delete_url = `${CONSTANTS.DELETE_URL}?treeName=%7B${CONSTANTS.TREE_NAME}%7D&nodeId=${lastSelectedItem}`;
  }

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setLastSelectedName(event.currentTarget.innerText);
      setLastSelectedItem(itemId);
    }
  };

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
  };

  const getItemLabel = (item: any) => item.name;

  return (
    <Box sx={{ minHeight: 352, minWidth: 600 }}>

      {(!isPending && error) && <AlertDialog message={error}/>}
      {addFormShow && <AddDialog url={add_url}/>}
      {deleteFormShow && <DeleteDialog url={delete_url} nodename={lastSelectedName}/>}
      {editFormShow && <EditDialog url={edit_url} nodename={lastSelectedName}/>}

      {loaded && <RichTreeView items={tree}
        getItemLabel={getItemLabel}
        slots={{ item: TreeItemExtended }}
        onItemSelectionToggle={handleItemSelectionToggle}
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
      />}
    </Box>
  );
}