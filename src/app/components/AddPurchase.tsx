'use client'
import React, { useState } from 'react';
import { TextField, Box, Select, MenuItem, SelectChangeEvent, Button, FormControl } from '@mui/material';


interface FormData {
    date: string | "";
    quantity: number | "";
    price: number | "";
    totalValue: number | "";
}

const AddPurchase: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        date: new Date(Date.now()).toISOString().split('T')[0],
        quantity: 0,
        price: 0,
        totalValue: 0.0
    })
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        setFormData(prevState => ({
            ...prevState,
            [name]: name == 'date' ? value : Number(value)
          }));
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>  {
        event.preventDefault()
        const res = await fetch('/api/addPurchase', {
            method:"POST",
            body: JSON.stringify(formData)
        })
        const data = await res.json()


        if( data.status === 400){
            alert(data.message)
        }
    }
    
    return (
        <div>
        <h1>Add Purchase</h1>
            <Box 
                component="form"
                onSubmit={handleSubmit}
                flexDirection={"row"}
                sx={{
                    // Apply a margin to all direct children
                    '& > *': {
                    m: 1,  // m is shorthand for margin
                    },
                    background:"white",
                    margin: 3
                }}
            >
                <TextField
                    title='Date'
                    label="Date"
                    name='date'
                    type="date"
                    defaultValue={formData.date}
                    onChange={handleChange}
                />
                <TextField
                    title='Item Quantity'
                    label='Item Quantity'
                    name='quantity'
                    type="number"
                    defaultValue={formData.quantity.toString()}
                    onChange={handleChange}

                />
                <TextField
                    title='Price per unit'
                    label='Price per unit'
                    name='price'
                    type="number"
                    defaultValue={formData.price.toString()}
                    onChange={handleChange}
                />
                <TextField
                    label='Total Value (RM)'
                    name='totalValue'
                    disabled
                    type="number"
                    aria-readonly
                    value={Number(formData.price) * Number(formData.quantity)}                    
                    
                />
                <Button
                    size="large"
                    type='submit'
                    variant='contained'                   
                >
                    SUBMIT
                </Button>
            </Box>
        
        </div>
    );
};

export default AddPurchase;