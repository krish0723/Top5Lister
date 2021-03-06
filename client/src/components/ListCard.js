import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it.

    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    // function to load a list
    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + _id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            console.log(store.currentList);
        }
        store.incrementViews(id);
        console.log(store.currentList);
    }
    // handler: toggle function to see if editing is active
    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }
    // toggle function to see if editing is active
    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleUserClick() {

    }
    // function to show modal on delete list
    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }
    // like a list function
    async function handleLikeList(event, id) {
        event.stopPropagation();
        store.likeList(id);
    }
    // dislike a list funciton
    async function handleDislikeList(event, id) {
        event.stopPropagation();
        store.dislikeList(id);
    }
    // handle enter on edit state and updating text
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, event.target.value);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    // card status functions
    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '0px', display: 'flex', p: 1 }}
            style={{ width: '100%'}}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }
            }
            style={{
                 fontSize: '48pt'
            }}
        >
                <Grid container direction={'column'}>
                    <Box sx={{ fontFamily: '-apple-system', p: 1, fontWeight: 'bold', fontSize: 20, flexGrow: 1 }}>{idNamePair.name}</Box>
                    <Grid container direction={'row'}>
                        <Box sx={{ fontFamily: '-apple-system', fontWeight: 'bold', fontSize: 12, p: 1, flexGrow: .5 }}>By:</Box>
                        <Box sx={{ fontFamily: '-apple-system', textDecoration: 'underline', color : 'blue', fontWeight: 'bold', fontSize: 12, p: 1, flexGrow: 100 }}>{idNamePair.ownerEmail}</Box>
                    </Grid>
                    {idNamePair.ownerEmail == auth.user.email ?
                        <Box onClick={handleToggleEdit} sx={{ fontFamily: '-apple-system', textDecoration: 'underline', color : 'red', fontWeight: 'bold', fontSize: 12, p: 1, flexGrow: 1 }}>Edit:</Box> :
                        <Box sx={{ fontFamily: '-apple-system', color : 'black', fontWeight: 'bold', fontSize: 12, p: 1, flexGrow: 1 }}>Published: {idNamePair.createdAt.slice(0,9)}</Box>
                    }
                    <Grid container direction={'row'}>
                        <Box sx={{ fontFamily: '-apple-system', fontWeight: 'bold', fontSize: 12, p: 1, flexGrow: 0 }}>Views:</Box>
                        <Box sx={{ fontFamily: '-apple-system', fontWeight: 'bold', fontSize: 12, p:1, flexGrow: 100 }}>{idNamePair.views}</Box>
                    </Grid>
                </Grid>


                <Box sx={{ p: 0 }}>
                    <IconButton onClick={(event) => {
                        handleLikeList(event, idNamePair._id)
                    }} aria-label='like'>
                        <ThumbUpIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ fontFamily: '-apple-system', p: 1, fontWeight: 'bold', fontSize: 15, flexGrow: 1 }}>{idNamePair.likes}</Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleDislikeList(event, idNamePair._id)
                    }} aria-label='dislike'>
                        <ThumbDownIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ fontFamily: '-apple-system', p: 1, fontWeight: 'bold', fontSize: 15, flexGrow: 1 }}>{idNamePair.dislikes}</Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </Box>
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;
