import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import MenuBar from './MenuBar.js';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AuthContext from '../auth';
/*
    This React component lists all the top5 lists in the UI.

    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    let userIdNamePairs = [];
    if (store) {
        console.log(store.idNamePairs)
        listCard =
            <List sx={{ width: '98%', left: '2%', bgcolor: '#fff5de'}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <Grid container direction={'row'}>
        <MenuBar />
        <div id="top5-list-selector">
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
            <div id="list-selector-heading">
            <Fab
                color="primary"
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h3">Your Lists</Typography>
            </div>
        </div>
    </Grid>)
}

export default HomeScreen;
