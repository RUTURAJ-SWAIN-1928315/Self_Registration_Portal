import React, { useState,useEffect } from 'react';
import './LabReport.css';
import Navbar from '../../Navbar/Navbar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';

function LabReport() {
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const [tableData,setTableData] = useState([]);

  //For Testing purpose Demo MRNO
  const mrno = 'KIMS102302010458';


  //Fetch TableData for Lab Reports
 
useEffect(() => {
  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/kiosk/getLabReports?mrno=${mrno}`);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching Table Data:', error);
    }
  };

  fetchTableData();
}, []);

console.log("TableData",tableData);

const handlePrint = (reportUrl,mrn) => {
  //setting the new tab name as MRN
  const windowName = `MRN_${mrn}`;
  window.open(reportUrl, windowName);
  //window.open(reportUrl, '_blank');
    console.log('Printing...',mrn);
  };

  
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
  };


  return (
    <div className='LabReportPage'>
      <Navbar pagename={"Lab Report"} />
      <div className='ReportPageTable'>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'lightGrey' }}>
              <TableRow>
                <TableCell>Test Date</TableCell>
                <TableCell>Report Name</TableCell>
                <TableCell>Report Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDateTime(data.orderedDate)}</TableCell>
                  <TableCell>{data.serviceName}</TableCell>
                  <TableCell>
                    <div className='ChipShape' style={{ background: data.resultStatus === 'Result Certified' ? 'var(--Jade-300, #81F4C3)' : 'var(--Red-300, #F44336)' }}>
                      {data.resultStatus}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" onClick={() => handlePrint(data.reportUrl,data.mrn)}>
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
  );
}


export default LabReport;
