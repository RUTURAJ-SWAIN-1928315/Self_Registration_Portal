import React, { useState,useEffect } from 'react';
import Navbar from '../../Navbar/Navbar'
import './Billing.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import NoData from "../../../Assests/Images/noData.svg";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Billing() {
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const [tableData,setTableData] = useState([]);
  const selectedPatientMRNO = localStorage.getItem('selectedPatientMRNO');
  const patientToken = localStorage.getItem('patientToken');


   //Fetch TableData for Lab Reports
useEffect(() => {
  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/kiosk/getInvoiceDetails?mrno=${selectedPatientMRNO}`,{
        headers:{
          'Authorization': `Bearer ${patientToken}`
        }
      });
      setTableData(response.data.invoiceDetails);
    } catch (error) {
      toast.error("Something went wrong!!!!", {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error fetching Table Data:', error);
      return;
    }
  };

  fetchTableData();
}, []);

console.log("TableData",tableData);


    // const handlePrintBilling = (invoiceId) => {
    //    const reportUrl = `${BACKEND_URL}/kiosk/getInvoice?printType=INVOICE&invoiceId=${invoiceId}`
    //    //setting the new tab name as invoiceID
    //   const windowName = `InvoiceID_${invoiceId}`;
    //   window.open(reportUrl, windowName);
    //   //window.open(reportUrl, '_blank');
    //     console.log('Printing...',invoiceId);
    //   };

    const handlePrintBilling = (invoiceId) => {
      const reportUrl = `${BACKEND_URL}/kiosk/getInvoice?printType=INVOICE&invoiceId=${invoiceId}`;
  
      axios.get(reportUrl, {
          headers: {
              'Authorization': `Bearer ${patientToken}`
          },
          responseType: 'blob' // important if the response is a PDF or other binary format
      })
      .then(response => {
          // Create a Blob from the PDF Stream
          const file = new Blob([response.data], { type: 'application/pdf' });
          // Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          // Open the URL on new Window
          window.open(fileURL, `InvoiceID_${invoiceId}`);
      })
      .catch(error => {
          console.error('Error fetching invoice:', error);
      });
  };

      
  return (
    <div className='BillingPage'>
      <Navbar pagename={"Billing"} billingIsCalled={true} />
      <div className='BillingTable'>
      {tableData.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <img src={NoData} alt="No Data" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
    ) : (
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
        )}

      </div>
      <ToastContainer position="top-right" autoClose={2000} />

    </div>
  )
}

export default Billing