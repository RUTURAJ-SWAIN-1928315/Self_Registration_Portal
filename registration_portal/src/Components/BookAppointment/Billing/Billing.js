import React, { useState,useEffect } from 'react';
import Navbar from '../../Navbar/Navbar'
import './Billing.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';

function Billing() {
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const [tableData,setTableData] = useState([]);
  const selectedPatientMRNO = localStorage.getItem('selectedPatientMRNO');
  //For Testing purpose Demo MRNO
  const mrno = 'KIMS.0004205534';


   //Fetch TableData for Lab Reports
useEffect(() => {
  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/kiosk/getInvoiceDetails?mrno=${mrno}`);
      setTableData(response.data.invoiceDetails);
    } catch (error) {
      console.error('Error fetching Table Data:', error);
    }
  };

  fetchTableData();
}, []);

console.log("TableData",tableData);


    const handlePrintBilling = (invoiceId) => {
       const reportUrl = `${BACKEND_URL}/kiosk/getInvoice?printType=INVOICE&invoiceId=${invoiceId}`
       //setting the new tab name as invoiceID
      const windowName = `InvoiceID_${invoiceId}`;
      window.open(reportUrl, windowName);
      //window.open(reportUrl, '_blank');
        console.log('Printing...',invoiceId);
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
                {/* <TableCell>Bill Type</TableCell> */}
                <TableCell>Invoice Number</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Bill Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.createdDate}</TableCell>
                  <TableCell>{row.invoiceNo}</TableCell>
                  <TableCell>{row.totalAmount}</TableCell>
                  <TableCell>
                    <div className='ChipShape' style={{ background: row.invoiceStatus === 'Settled' ? 'var(--Jade-300, #81F4C3)' : 'var(--Red-300, #F44336)' }}>
                      {row.invoiceStatus}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="success" 
                      onClick={() => handlePrintBilling(row.invoiceId)}>
                      Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


      </div>


    </div>
  )
}

export default Billing