import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff7300'];

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
    const [summary, setSummary] = useState(defaultSummary);
    const [stats, setStats] = useState([]);
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let intervalId;

        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/stats');

                if (!response.ok) {
                    throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
                }

                const data = await response.json();
                setSummary(data.summary || defaultSummary);
                setStats(data.pieChartData || []);
                setTopSellingItems(data.topSellingItems || []);
                setError('');
            } catch (fetchError) {
                console.error('Error fetching stats', fetchError);
                setError(fetchError.message || 'Unable to load dashboard stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        intervalId = setInterval(fetchStats, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const pieData = useMemo(() => stats.filter((item) => item.value > 0), [stats]);

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
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Most Sold Items
                            </Typography>

                            {loading ? (
                                <Box sx={{ minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : pieData.length > 0 ? (
                                <Box sx={{ width: '100%', height: 500 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={200}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} qty`, 'Sold']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            ) : (
                                <Alert severity="info">No order data available to render the pie chart yet.</Alert>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
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
