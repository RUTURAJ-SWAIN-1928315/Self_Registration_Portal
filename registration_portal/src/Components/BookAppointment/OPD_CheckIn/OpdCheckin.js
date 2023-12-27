import React, { useState,useEffect } from 'react';
import './OpdCheckin.css';
import Navbar from '../../Navbar/Navbar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';


function OpdCheckin() {




  return (
    <div className='OpdCheckinPage'>
      <Navbar pagename={"OPD Check-in"}/>
      <div className='opdcheckintable'>
      <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'lightGrey' }}>
              <TableRow>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Consultation Slot</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                  <TableCell>21-10-2023</TableCell>
                  <TableCell>10:00AM - 10:30AM</TableCell>
                  <TableCell>Dr. HariKumar</TableCell>
                  <TableCell>Cardiology</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  )
}

export default OpdCheckin