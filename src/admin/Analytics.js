import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Paper,
    Typography,
    Button
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import API_BASE_URL from '../config';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff7300'];

const Analytics = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch analytics: ${response.status}`);
                }
                const data = await response.json();
                setStats(data.pieChartData || []);
                setError('');
            } catch (fetchError) {
                console.error('Error fetching analytics', fetchError);
                setError(fetchError.message || 'Unable to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const pieData = useMemo(() => stats.filter((item) => item.value > 0), [stats]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card sx={{ mt: 3, p: 2 }}>
                <CardHeader
                    title={
                        <Box display="flex" alignItems="center">
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/admin')}
                                sx={{ mr: 2 }}
                            >
                                Back to Dashboard
                            </Button>
                            Analytics & Sales Breakdown
                        </Box>
                    }
                    subheader="Detailed visualization of your sales performance"
                />
                <CardContent>
                    {error ? (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    ) : null}

                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
                            Item Sales Distribution
                        </Typography>

                        {loading ? (
                            <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : pieData.length > 0 ? (
                            <Box sx={{ width: '100%', height: 600 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={220}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} qty`, 'Sold']} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>No order data available yet.</Alert>
                        )}
                    </Paper>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Analytics;
