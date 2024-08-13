import { useState, createContext } from 'react'
import './App.css'

import Tree from './components/Tree/Tree'

const DEFAULT_API_TREE = 'C9232B85-AD10-459C-A44F-70CA30C60E5F';
const MY_TREE = '680CD83E-E2E6-4951-9750-55BDB8C76A81'

const CONSTANTS = {
  GET_URL: 'https://test.vmarmysh.com/api.user.tree.get',
  ADD_URL: 'https://test.vmarmysh.com/api.user.tree.node.create',
  EDIT_URL: 'https://test.vmarmysh.com/api.user.tree.node.rename',
  DELETE_URL: 'https://test.vmarmysh.com/api.user.tree.node.delete',
  TREE_NAME: MY_TREE
};

export const ApiContext = createContext(CONSTANTS)

function App() {
  

  return (
    <ApiContext.Provider value={CONSTANTS}>
      <h1>My Tree</h1>
      
      <Tree/>
      
    </ApiContext.Provider>
  )
}

export default App
