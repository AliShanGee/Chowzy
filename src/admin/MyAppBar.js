import { AppBar } from 'react-admin';
import React from 'react';
import { Typography } from '@mui/material';

const MyAppBar = (props) => (
    <AppBar {...props}>
        <Typography flex="1" variant="h6" id="react-admin-title"></Typography>
    </AppBar>
);

export default MyAppBar;
