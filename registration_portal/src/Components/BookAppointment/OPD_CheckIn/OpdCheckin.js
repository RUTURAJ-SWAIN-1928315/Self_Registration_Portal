import React, { useState,useEffect } from 'react';
import './OpdCheckin.css';
import Navbar from '../../Navbar/Navbar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';


function OpdCheckin() {
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const selectedPatientMRNO = localStorage.getItem('selectedPatientMRNO');
  const [tableData,setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/kiosk/opdCheckIn?mrno=${selectedPatientMRNO}`);
        setTableData(response.data.mapList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log("TableData",tableData)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const formatDateTime = (dateTimeString) => {
    const timeString = dateTimeString.split(' ')[1]; // Assuming 'YYYY-DD-MM HH:mm:ss' format
    const [hours, minutes] = timeString.split(':');
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = parsedHours > 12 ? parsedHours - 12 : parsedHours;
    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    return formattedTime;
  };
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
              {tableData.map((dataItem) => (
                <TableRow key={dataItem.mrno}>
                  <TableCell>{formatDate(dataItem.appointmentDate)}</TableCell>
                  <TableCell>{`${formatDateTime(dataItem.fromTime)} - ${formatDateTime(dataItem.toTime)}`}</TableCell>
                  <TableCell>{dataItem.doctorName}</TableCell>
                  <TableCell>{dataItem.departmentName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  )
}

export default OpdCheckin