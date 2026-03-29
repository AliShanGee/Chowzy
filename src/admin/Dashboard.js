import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { motion } from 'framer-motion';


const defaultSummary = {
    totalUsers: 0,
    totalFoodItems: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalItemsSold: 0,
    totalRevenue: 0
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 2
    }).format(value || 0);

const SummaryCard = ({ title, value, subtitle }) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="subtitle2" color="text.secondary">
            {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
            {value}
        </Typography>
        {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
            </Typography>
        ) : null}
    </Paper>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(defaultSummary);
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let intervalId;

        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/stats`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
                }

                const data = await response.json();
                setSummary(data.summary || defaultSummary);
                setTopSellingItems(data.topSellingItems || []);
                setError('');
            } catch (fetchError) {
                console.error('Error fetching stats', fetchError);
                setError(fetchError.message || 'Unable to load dashboard stats');
            }
        };

        fetchStats();
        intervalId = setInterval(fetchStats, 10000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Card sx={{ mt: 3, p: 2 }}>
            <CardHeader
                title="Admin Dashboard"
                subheader="Live sales insights, order counts, and top-selling food items"
            />
            <CardContent>
                {error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : null}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SummaryCard title="Users" value={summary.totalUsers} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SummaryCard title="Food Items" value={summary.totalFoodItems} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SummaryCard title="Categories" value={summary.totalCategories} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SummaryCard title="Orders" value={summary.totalOrders} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SummaryCard title="Items Sold" value={summary.totalItemsSold} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SummaryCard title="Revenue" value={formatCurrency(summary.totalRevenue)} />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Visual Insights & Analytics
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                                    View detailed charts and sales distributions for your food items.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/admin/analytics')}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: '#764ba2',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Check Sales Charts
                                </Button>
                            </motion.div>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                         <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Stack spacing={1}>
                                <Typography variant="h6">Top Selling Items</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Updates automatically every 10 seconds when new orders are placed.
                                </Typography>
                            </Stack>

                            <List dense sx={{ mt: 2 }}>
                                {topSellingItems.length > 0 ? (
                                    topSellingItems.map((item, index) => (
                                        <ListItem key={item.name} divider={index !== topSellingItems.length - 1} disableGutters>
                                            <ListItemText
                                                primary={`${index + 1}. ${item.name}`}
                                                secondary={`Sold: ${item.value} | Revenue: ${formatCurrency(item.revenue)}`}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem disableGutters>
                                        <ListItemText primary="No sales recorded yet." />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Dashboard;
