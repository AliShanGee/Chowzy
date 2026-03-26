import * as React from "react";
import { List, Datagrid, TextField, FunctionField, Filter, SearchInput, Create, SimpleForm, TextInput, DateInput, ArrayInput, SimpleFormIterator, ShowButton, DeleteButton, Show, SimpleShowLayout, Edit, AutocompleteInput, useRecordContext } from 'react-admin';
import { Box, Button, Chip, Typography } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const STATUS_COLORS = {
    pending: 'default',
    scheduled: 'info',
    preparing: 'warning',
    out_for_delivery: 'primary',
    delivered: 'success',
    cancelled: 'error'
};

const STATUS_LABELS = {
    pending: 'Pending',
    scheduled: 'Scheduled',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

const DeliveryScheduleForm = () => {
    const record = useRecordContext();
    const [deliveryDate, setDeliveryDate] = React.useState('');
    const [deliveryTime, setDeliveryTime] = React.useState('');
    const [status, setStatus] = React.useState(record?.delivery_status || 'pending');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (record) {
            setDeliveryDate(record.delivery_date ? record.delivery_date.split('T')[0] : '');
            setDeliveryTime(record.delivery_time || '');
            setStatus(record.delivery_status || 'pending');
        }
    }, [record]);

    const handleSchedule = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/orders/${record.id}/schedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    delivery_date: deliveryDate,
                    delivery_time: deliveryTime,
                    delivery_status: status
                })
            });
            if (response.ok) {
                alert('Delivery scheduled successfully!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error scheduling delivery:', error);
            alert('Failed to schedule delivery');
        }
        setLoading(false);
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let h = 8; h <= 22; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                slots.push(`${hour}:${minute}`);
            }
        }
        return slots;
    };

    if (!record) return null;

    return (
        <Box p={3}>
            <Typography variant="h6" gutterBottom>
                <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Schedule Delivery
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <TextInput
                    source="email"
                    disabled
                    fullWidth
                />
                
                <TextInput
                    label="Delivery Date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
                
                <Box>
                    <Typography variant="body2" color="textSecondary" mb={1}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        Select Delivery Time
                    </Typography>
                    <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '100%',
                            fontSize: '14px'
                        }}
                    >
                        <option value="">Select a time slot</option>
                        {generateTimeSlots().map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                </Box>

                <Box>
                    <Typography variant="body2" color="textSecondary" mb={1}>
                        <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        Delivery Status
                    </Typography>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '100%',
                            fontSize: '14px'
                        }}
                    >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSchedule}
                    disabled={loading || !deliveryDate || !deliveryTime}
                    startIcon={<ScheduleIcon />}
                    fullWidth
                >
                    {loading ? 'Scheduling...' : 'Schedule Delivery'}
                </Button>
            </Box>
        </Box>
    );
};

const OrderFilter = (props) => (
    <Filter {...props}>
        <SearchInput source="email" alwaysOn />
    </Filter>
);

export const OrderList = () => (
    <List filters={<OrderFilter />}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="email" />
            <FunctionField label="Order Date" render={record => {
                if (!record.order_data || !record.order_data[0] || !record.order_data[0][0]) return '';
                return record.order_data[0][0].Order_date || record.order_data[0][0].order_date || '';
            }} />
            <FunctionField label="Delivery Date" render={record => {
                if (!record.delivery_date) return 'Not Set';
                return new Date(record.delivery_date).toLocaleDateString();
            }} />
            <FunctionField label="Delivery Time" render={record => {
                return record.delivery_time || 'Not Set';
            }} />
            <FunctionField label="Status" render={record => (
                <Chip 
                    label={STATUS_LABELS[record.delivery_status] || 'Pending'} 
                    color={STATUS_COLORS[record.delivery_status] || 'default'} 
                    size="small" 
                />
            )} />
            <FunctionField label="Items" render={record => {
                if (!record.order_data) return '';
                const items = [];
                record.order_data.forEach(batch => {
                    if (Array.isArray(batch)) {
                        batch.forEach(item => { if (item.name) items.push(item.name); });
                    } else if (batch && batch.name) {
                        items.push(batch.name);
                    }
                });
                return items.join(', ');
            }} />
            <ShowButton />
            <DeleteButton />
        </Datagrid>
    </List>
);


export const OrderCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" />
            <DateInput source="order_date" />
            <ArrayInput source="order_data">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <TextInput source="qty" />
                    <TextInput source="size" />
                    <TextInput source="price" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
);

export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <DeliveryScheduleForm />
        </SimpleForm>
    </Edit>
);

export const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="email" />
            <FunctionField label="Order Date" render={record => {
                if (!record.order_data || !record.order_data[0] || !record.order_data[0][0]) return '';
                return record.order_data[0][0].Order_date || record.order_data[0][0].order_date || '';
            }} />
            <FunctionField label="Delivery Date" render={record => {
                if (!record.delivery_date) return 'Not Scheduled';
                return new Date(record.delivery_date).toLocaleDateString();
            }} />
            <FunctionField label="Delivery Time" render={record => {
                return record.delivery_time || 'Not Set';
            }} />
            <FunctionField label="Status" render={record => (
                <Chip 
                    label={STATUS_LABELS[record.delivery_status] || 'Pending'} 
                    color={STATUS_COLORS[record.delivery_status] || 'default'} 
                    size="small" 
                />
            )} />
            <FunctionField label="Order Items" render={record => {
                if (!record.order_data) return null;
                const items = [];
                record.order_data.forEach(batch => {
                    if (Array.isArray(batch)) {
                        batch.forEach(item => { if (item.name) items.push(`${item.name} (${item.qty} ${item.size}) - Rs. ${item.price}`); });
                    }
                });
                return (<ul>{items.map((item, idx) => <li key={idx}>{item}</li>)}</ul>);
            }} />
        </SimpleShowLayout>
    </Show>
);