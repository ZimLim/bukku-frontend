'use client'
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
    Box, 
    Button,
    Paper,
 } from '@mui/material';

 const purchaseColumns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'date',
      headerName: 'Transaction Date',
      width: 150
    },
    {
      field: 'quantity',
      headerName: 'Item Quantity',
      width: 150
    },
    {
      field: 'price',
      headerName: 'Price Per Unit (RM)',
      type: 'number',
      width: 110
    },
    {
      field: 'totalValue',
      headerName: 'Total Value (RM)',
      width: 160
    },
  ];

  const saleColumns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'date',
      headerName: 'Transaction Date',
      width: 150
    },
    {
      field: 'quantity',
      headerName: 'Item Quantity',
      width: 150
    },
    {
      field: 'price',
      headerName: 'Sales Price Per Unit (RM)',
      type: 'number',
      width: 110
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount (RM)',
      width: 160
    },
    {
      field: 'totalCost',
      headerName: 'Total Cost (RM)',
      width: 160
    }

  ];

const TransactionTable: React.FC = () => {
    const [purchaseData, setPurchaseData] = useState([])
    const [saleData, setSaleData] = useState([])
    const [showPurchaseTable, setShowPurchaseTable] = useState(false)
    const [showSaleTable, setShowSaleTable] = useState(false)
    
    useEffect(() => {
        const getPurchaseData = async () => {
            const res = await fetch('/api/addPurchase', {
                method: "GET"
            })
            const data = await res.json()
            setPurchaseData(data.data)
        }
        const getSaleData = async () => {
            const res = await fetch('/api/addSale', {
                method: "GET"
            })
            const data = await res.json()
            setSaleData(data.data)
        }
        getPurchaseData()
        getSaleData()
        return () => {
            // Returning blank when component unmounts
        }    
    }, [showPurchaseTable, showSaleTable])
    
    const handleClick = async (transaction: string) => {
        
        if(transaction == 'purchase'){
            if(showPurchaseTable){
                setShowPurchaseTable(!showPurchaseTable)
            }else{
                setShowPurchaseTable(true)
                setShowSaleTable(false)
            }
        }else{
            if(showSaleTable){
                setShowSaleTable(!showSaleTable)
            }else{
                setShowSaleTable(true)
                setShowPurchaseTable(false)
            }
        }
    }
    return (
       <Box
        flexDirection={'row'}
       >
        {showPurchaseTable &&
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                rows={purchaseData}
                columns={purchaseColumns}
                initialState={{ pagination: { paginationModel : {pageSize: 5} } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
                getRowId={(row) => {return row._id}}
                />
          </Paper>
        }
        {showSaleTable &&
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                rows={saleData}
                columns={saleColumns}
                initialState={{ pagination: { paginationModel : {pageSize: 5} } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
                getRowId={(row) => {return row._id}}
                />
          </Paper>
        }
            <Button
                className='table-list-button'
                onClick={() => handleClick('purchase')}
            >
                GET PURCHASE INFO
            </Button>
            <Button
                className='table-list-button'
                onClick={() => handleClick('sales')}
            >
                GET SALE INFO
            </Button>
       </Box>
    );
};

export default TransactionTable;