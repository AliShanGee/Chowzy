import { AppBar } from 'react-admin';
import React from 'react';
import { Typography, Box } from '@mui/material';
import ThemeToggle from '../components/ThemeToggle.js';

const MyAppBar = (props) => (
    <AppBar {...props}>
        <Typography flex="1" variant="h6" id="react-admin-title"></Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
        </Box>
    </AppBar>
);

export default MyAppBar;
