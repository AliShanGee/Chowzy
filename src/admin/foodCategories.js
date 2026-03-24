import React from 'react';
import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, Create } from 'react-admin';

export const FoodCategoryList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="CategoryName" />
        </Datagrid>
    </List>
);

export const FoodCategoryEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="CategoryName" />
        </SimpleForm>
    </Edit>
);

export const FoodCategoryCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="CategoryName" />
        </SimpleForm>
    </Create>
);
