'use client'
import React, { useState, useEffect } from 'react';
import { TextField, Box, Select, MenuItem, SelectChangeEvent, Button, FormControl } from '@mui/material';


interface FormData {
    date: string | "";
    quantity: number | "";
    price: number | "";
    totalAmount: number | "";
    totalCost: number | "";
}

interface Inventory {
    totalGoods: number;
    totalValue: number;
}

const AddSale: React.FC = () => {
    const [averageCost, setAverageCost] = useState(0.0)
    const [totalGoods, setTotalGoods] = useState(0.0)
    const [formData, setFormData] = useState<FormData>({
        date: new Date(Date.now()).toISOString().split('T')[0],
        quantity: 0,
        price: 0.0,
        totalAmount: 0.0,
        totalCost: 0.0
    })

    // useEffect() to get current Weighted Average Cost from DB
    useEffect(() => {
        const getInventory = async () => {
            const res = await fetch('/api/inventory', {
                method: 'GET',
            })
            const inventory:Inventory = await res.json()
            setAverageCost(Number((inventory.totalValue/inventory.totalGoods).toFixed(2)))
            setTotalGoods(inventory.totalGoods)
          };
        
          getInventory(); 
          
          return () => {
            // Returning blank when component unmounts
          }    
      }), [formData]

    // Handlers  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setFormData(prevState => ({
            ...prevState,
            [name]: name == 'date' ? value : Number(value)
          }))
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>  {
        event.preventDefault()

        if(Number(formData.quantity) > totalGoods){
            alert("You're selling more than amount you have in inventory")
        }else{
            const body = {
                ...formData,
                totalAmount: Number(formData.price) * Number(formData.quantity),
                totalCost: averageCost * Number(formData.quantity)
            }
            const data = fetch('/api/addSale', {
                method:"POST",
                body: JSON.stringify(body)
            })
        }
    }
    
    return (
        <div>
        <h1>Add Sale</h1>
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
                    margin: 4
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
                    title='Total Amount'
                    label='Total Amount (RM)'
                    name='totalAmount'
                    disabled
                    type="number"
                    aria-readonly
                    value={Number(formData.price) * Number(formData.quantity)}                    
                    
                />
                <TextField
                    title='Total Cost'
                    label='Total Cost (RM)'
                    name='totalCost'
                    disabled
                    type="number"
                    aria-readonly
                    value={averageCost * Number(formData.quantity)}                    
                    
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

export default AddSale;