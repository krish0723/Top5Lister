import { useContext } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.

    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    let editItems = "";
    let commentsCard= "";
    if (store.currentList) {
        editItems =
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index}
                        />
                    ))
                }
            </List>;

        commentsCard =
            <List sx={{ width: '98%', left: '2%', bgcolor: '#fff5de'}}>
            {
                store.currentList.comments.map((item, index) => (
                    <Top5Item
                        text={item}
                        index={index}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="top5-workspace">
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
        </div>
    )
}

export default WorkspaceScreen;
