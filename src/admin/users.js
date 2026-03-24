import * as React from "react";
import { List, Datagrid, TextField, EmailField, SearchInput, Filter, Edit, Create, SimpleForm, TextInput, EditButton, ShowButton, DeleteButton, Show, SimpleShowLayout } from 'react-admin';

const UserFilter = (props) => (
    <Filter {...props}>
        <SearchInput source="name" alwaysOn />
    </Filter>
);

export const UserList = () => (
    <List filters={<UserFilter />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="location" />
            <ShowButton />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="phone" />
            <TextInput source="location" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="phone" />
            <TextInput source="location" />
        </SimpleForm>
    </Create>
);

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="location" />
            <TextField source="date" label="Date Created" />
        </SimpleShowLayout>
    </Show>
);