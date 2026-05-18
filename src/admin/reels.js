import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    UrlField,
    required,
    FileField,
    FileInput
} from 'react-admin';

export const ReelList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="title" />
            <UrlField source="videoUrl" />
            <DateField source="date" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

const validateReelCreation = (values) => {
    const errors = {};
    if (!values.title) {
        errors.title = 'Title is required';
    }
    if (!values.video && !values.videoUrl) {
        errors.video = 'Either a video file or a video URL is required';
        errors.videoUrl = 'Either a video file or a video URL is required';
    }
    return errors;
};

export const ReelEdit = (props) => (
    <Edit {...props}>
        <SimpleForm validate={validateReelCreation}>
            <TextInput source="title" fullWidth />
            <FileInput source="video" label="Video File" accept="video/*">
                <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="videoUrl" fullWidth helperText="Or provide a direct video URL (e.g. .mp4)" />
            <TextInput source="description" multiline fullWidth />
        </SimpleForm>
    </Edit>
);

export const ReelCreate = (props) => (
    <Create {...props}>
        <SimpleForm validate={validateReelCreation}>
            <TextInput source="title" fullWidth />
            <FileInput source="video" label="Video File" accept="video/*">
                <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="videoUrl" fullWidth helperText="Or provide a direct video URL (e.g. .mp4)" />
            <TextInput source="description" multiline fullWidth />
        </SimpleForm>
    </Create>
);
