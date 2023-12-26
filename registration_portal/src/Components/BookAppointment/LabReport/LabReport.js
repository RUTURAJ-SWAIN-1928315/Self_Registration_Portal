import React from 'react';
import './LabReport.css';
import Navbar from '../../Navbar/Navbar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

function LabReport() {

const handlePrint = () => {
    // Implement your logic for printing here
    console.log('Printing...');
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
              {/* Replace the dummy data with your actual data */}

              <TableRow>
                <TableCell>21-12-2023</TableCell>
                <TableCell>Sample Report</TableCell>
                <TableCell>
                    <div className='ChipShape'
                     style={{background: 'var(--Jade-300, #81F4C3)'}}>
                      Completed
                    </div>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => handlePrint()}>
                    Print
                  </Button>
                </TableCell>
              </TableRow>
             
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}


export default LabReport;
