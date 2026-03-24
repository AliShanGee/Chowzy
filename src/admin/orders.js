import * as React from "react";
import { List, Datagrid, TextField, FunctionField, Filter, SearchInput, Create, SimpleForm, TextInput, DateInput, ArrayInput, SimpleFormIterator, ShowButton, DeleteButton, Show, SimpleShowLayout } from 'react-admin';

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

export const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="email" />
            <FunctionField label="Order Date" render={record => {
                if (!record.order_data || !record.order_data[0] || !record.order_data[0][0]) return '';
                return record.order_data[0][0].Order_date || record.order_data[0][0].order_date || '';
            }} />
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