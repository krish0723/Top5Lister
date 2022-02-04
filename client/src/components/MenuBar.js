import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import { styled, alpha } from '@mui/material/styles';

import EditToolbar from './EditToolbar'

import InputBase from '@mui/material/InputBase';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/HighlightOff';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import HomeIcon from '@mui/icons-material/Home';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupIcon from '@mui/icons-material/Group';
import SvgIcon from '@mui/material/SvgIcon';
import SortIcon from '@mui/icons-material/Sort';
import FunctionsIcon from '@mui/icons-material/Functions';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function MenuBar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [homeAnchorEl, setHomeAnchorEl] = useState(null);
    const [allListsAnchorEl, setAllListsAnchorEl] = useState(null);
    const [userListsAnchorEl, setUserListsAnchorEl] = useState(null);
    const [comListsAnchorEl, setComListsAnchorEl] = useState(null);
    const [viewOpen, setViewOpen] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isHomeClicked = Boolean(homeAnchorEl);
    const isAllListsClicked = Boolean(allListsAnchorEl);
    const isUserListsClicked = Boolean(userListsAnchorEl);
    const isComListsClicked = Boolean(comListsAnchorEl);
    const [hover, setHover] = useState(false);
    const onHover = () => {
        setHover(true);
    };
    const onLeave = () => {
      setHover(false);
    };
    useEffect(() => {
        setViewOpen("yourListsView");
    },[]);

    // handleMenuClose
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    // open sort menu
    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);

    };

    // sort menu button handlers
    const handlePublishDateNewestSort = () => {
        let sortedData = store.idNamePairs.sort((a,b) => (b.createdAt > a.createdAt) ? 1 : -1);
        store.searchIdPairs(sortedData);
    }

    const handlePublishDateOldestSort = () => {
        let sortedData = store.idNamePairs.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : -1);
        store.searchIdPairs(sortedData);
    }

    const handleViewsSort = () => {
        let sortedData = store.idNamePairs.sort((a,b) => (b.views > a.views) ? 1 : -1);
        store.searchIdPairs(sortedData);
    }

    const handleLikesSort = () => {
        let sortedData = store.idNamePairs.sort((a,b) => (b.likes > a.likes) ? 1 : -1);
        store.searchIdPairs(sortedData);
    }

    const handleDislikesSort= () => {
        let sortedData = store.idNamePairs.sort((a,b) => (b.dislikes > a.dislikes) ? 1 : -1);
        store.searchIdPairs(sortedData);
    }

    const handleSearchClick= (event) => {
        if (event.key === 'Enter'){
            console.log(viewOpen);
            if (viewOpen == "yourListsView"){
                if (event.target.value == ""){
                    store.loadIdNamePairs();
                }else{
                    let filteredList = store.idNamePairs.filter(pair => pair.name.includes(event.target.value));
                    console.log(filteredList);
                    store.searchIdPairs(filteredList);
                }
            }
            if (viewOpen == "allListsView"){
                if (event.target.value == ""){
                    store.loadAllListsArray();
                }else{
                    let filteredList = store.idNamePairs.filter(pair => pair.name.includes(event.target.value));
                    console.log(filteredList);
                    store.searchIdPairs(filteredList);
                }
            }
            if (viewOpen == "usersListsView"){
                if (event.target.value == ""){
                    store.loadAllListsArray();
                }else{
                    store.loadUserListsArray(event.target.value);
                }
            }
        }
    }

    // button click handlers
    const handleHomeViewClick = () => {
        setViewOpen("yourListsView");
        store.loadIdNamePairs();
        setHomeAnchorEl("");
        setAllListsAnchorEl(null);
        setUserListsAnchorEl(null);
        setComListsAnchorEl(null);

    }

    const handleAllListsViewClick = () => {
        setViewOpen("allListsView");
        store.loadAllListsArray();
        setHomeAnchorEl(null);
        setAllListsAnchorEl("");
        setUserListsAnchorEl(null);
        setComListsAnchorEl(null);

    }

    const handleUserListViewClick = () => {
        setViewOpen("usersListsView");
        setHomeAnchorEl(null);
        setAllListsAnchorEl(null);
        setUserListsAnchorEl("");
        setComListsAnchorEl(null);
    }

    const handleComListsViewClick = () => {
        setViewOpen("comListsView");
        setHomeAnchorEl(null);
        setAllListsAnchorEl(null);
        setUserListsAnchorEl(null);
        setComListsAnchorEl("");
    }

    const menuId = 'primary-search-account-menu';

    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handlePublishDateNewestSort}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handlePublishDateOldestSort}>Publish Date (Oldest)</MenuItem>
            <MenuItem onClick={handleViewsSort}>Views</MenuItem>
            <MenuItem onClick={handleLikesSort}>Likes</MenuItem>
            <MenuItem onClick={handleDislikesSort}>Dislikes</MenuItem>

        </Menu>

    let editToolbar = "";
    let menu = loggedInMenu;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color='transparent'>
                <Toolbar>
                    <Tooltip title="Your lists, your home">
                    <Box sx={{ flexGrow: .02 }} >
                        <IconButton onClick={handleHomeViewClick} >
                            <HomeIcon fontSize='large' style={isHomeClicked ? {color:"#000000"} : {color:"default"}} />
                        </IconButton>
                    </Box>
                    </Tooltip>

                    <Tooltip title="See all lists around the world">
                    <Box sx={{ flexGrow: .02 }}>
                        <IconButton onClick={handleAllListsViewClick} >
                            <GroupIcon fontSize='large'/>
                        </IconButton>
                    </Box>
                    </Tooltip>

                    <Tooltip title="Search a user's email to see their lists">
                    <Box  sx={{ flexGrow: .02 }}>
                            <IconButton onClick={handleUserListViewClick}>
                                <PersonOutlineIcon fontSize='large'/>
                            </IconButton>
                    </Box>
                    </Tooltip>

                    <Tooltip title="Search a list name to see a ranking of everyone's list items">
                    <Box sx={{ flexGrow: .02 }}>
                        <IconButton onClick={handleComListsViewClick}>
                            <FunctionsIcon fontSize='large'/>
                        </IconButton>
                    </Box>
                    </Tooltip>
                    <Search onKeyDown={handleSearchClick}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }} onClick={handleSortMenuOpen}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <Box sx={{ fontWeight: 'bold', fontSize: 15, p: 1, flexGrow: .5 }}>SORT BY</Box>
                            <SortIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}
