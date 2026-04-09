import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ArrayField,
    NumberField,
    Show,
    SimpleShowLayout,
    DeleteButton
} from 'react-admin';

export const CartList = (props) => (
    <List {...props} sort={{ field: 'date', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="id" label="Cart ID" />
            <TextField source="email" label="User Email" />
            <DateField source="date" showTime label="Last Updated" />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const CartShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="email" />
            <DateField source="date" showTime />
            <ArrayField source="items" label="Cart Items">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="name" />
                    <TextField source="size" />
                    <NumberField source="qty" />
                    <NumberField source="price" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);
