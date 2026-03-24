import React from 'react';
import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, Create, ImageField, ReferenceInput, SelectInput, useInput } from 'react-admin';
import { Box, Button, TextField as MuiTextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomOptionsInput = ({ source }) => {
    const { field } = useInput({ source });

    // Parse [{"half":"100","full":"200"}] into [{size: 'half', price: '100'}, ...]
    const getInitialRows = () => {
        if (field.value && Array.isArray(field.value) && field.value.length > 0 && typeof field.value[0] === 'object') {
            return Object.entries(field.value[0])
                .filter(([k]) => k !== '_id' && k !== 'id')
                .map(([k, v]) => ({ size: k, price: String(v) }));
        }
        return [{ size: 'half', price: '' }];
    };

    const [rows, setRows] = React.useState(getInitialRows());

    React.useEffect(() => {
        const newObj = {};
        rows.forEach(r => {
            if (r.size && r.price) newObj[r.size] = r.price;
        });
        if (Object.keys(newObj).length > 0) {
            field.onChange([newObj]);
        } else {
            field.onChange([]);
        }
    }, [rows, field]);

    return (
        <Box mb={2} p={2} border="1px solid #ccc" borderRadius={2} width="100%">
            <h4>Pricing Options</h4>
            {rows.map((row, index) => (
                <Box key={index} display="flex" gap={2} mb={2} alignItems="center">
                    <FormControl size="small" style={{ minWidth: 150 }}>
                        <InputLabel>Size</InputLabel>
                        <Select
                            label="Size"
                            value={row.size}
                            onChange={(e) => {
                                const newRows = [...rows];
                                newRows[index].size = e.target.value;
                                setRows(newRows);
                            }}
                        >
                            <MenuItem value="half">Half</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="full">Full</MenuItem>
                            <MenuItem value="regular">Regular</MenuItem>
                            <MenuItem value="large">Large</MenuItem>
                        </Select>
                    </FormControl>
                    <MuiTextField
                        label="Price"
                        size="small"
                        type="number"
                        value={row.price}
                        onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].price = e.target.value;
                            setRows(newRows);
                        }}
                    />
                    <IconButton color="error" onClick={() => setRows(rows.filter((_, i) => i !== index))}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button onClick={() => setRows([...rows, { size: '', price: '' }])} variant="outlined" size="small">
                Add Option
            </Button>
        </Box>
    );
};

export const FoodItemList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="CategoryName" />
            <TextField source="description" />
            <ImageField source="img" title="image" sx={{ '& img': { maxWidth: 50, maxHeight: 50, objectFit: 'contain' } }} />
        </Datagrid>
    </List>
);

export const FoodItemEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <ReferenceInput source="CategoryName" reference="foodCategories">
                <SelectInput optionText="CategoryName" optionValue="CategoryName" />
            </ReferenceInput>
            <TextInput source="img" />
            <ImageField source="img" title="image preview" sx={{ '& img': { maxWidth: 200, maxHeight: 200, objectFit: 'contain' } }} />
            <TextInput source="description" />
            <CustomOptionsInput source="options" />
        </SimpleForm>
    </Edit>
);

export const FoodItemCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceInput source="CategoryName" reference="foodCategories">
                <SelectInput optionText="CategoryName" optionValue="CategoryName" />
            </ReferenceInput>
            <TextInput source="img" helperText="Paste an image URL here" />
            <TextInput source="description" />
            <CustomOptionsInput source="options" />
        </SimpleForm>
    </Create>
);
