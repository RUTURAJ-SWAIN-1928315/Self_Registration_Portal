import React from 'react'
import Navbar from '../../Navbar/Navbar'
import './Billing.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

function Billing() {


    const handlePrintBilling = () => {
        // Implement your logic for printing here
        console.log('Printing...');
      };

      
  return (
    <div className='BillingPage'>
      <Navbar pagename={"Billing"} />
      <div className='BillingTable'>

      <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'lightGrey' }}>
              <TableRow>
                <TableCell>Bill Date</TableCell>
                <TableCell>Bill Type</TableCell>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Bill Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Replace the dummy data with your actual data */}

              <TableRow>
                <TableCell>21-12-2023</TableCell>
                <TableCell>Pharmacy</TableCell>
                <TableCell>3425212</TableCell>
                <TableCell>10,000.00</TableCell>
                <TableCell>
                    <div className='ChipShape'
                     style={{background: 'var(--Jade-300, #81F4C3)'}}>
                      Final
                    </div>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => handlePrintBilling()}>
                    Print
                  </Button>
                </TableCell>
              </TableRow>
             
            </TableBody>
          </Table>
        </TableContainer>


      </div>


    </div>
  )
}

export default Billing