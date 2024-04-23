// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogActions from '@mui/material/DialogActions';
// import Button from '@mui/material/Button';

// function AxiosInterceptor() {
//   const navigate = useNavigate();
//   const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       response => response,
//       async error => {
//         if (error.response && error.response.status === 401) {
//           // Perform the logout
//           try {
//             await axios.get(`${BACKEND_URL}/kiosk/logout`);
//           } catch (logoutError) {
//             console.error('Logout failed:', logoutError);
//           }
//           // Show session expired dialog
//           setOpen(true);
//           setTimeout(() => {
//             setOpen(false);
//             navigate('/');
//           }, 3000); // Display the message for 3 seconds before redirecting
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, [navigate, BACKEND_URL]);

//   const handleClose = () => {
//     setOpen(false);
//     navigate('/');
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description"
//     >
//       <DialogTitle id="alert-dialog-title">{"Session Expired"}</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="alert-dialog-description">
//           Your session has expired. You will be redirected to the Admin login page.
//         </DialogContentText>
//       </DialogContent>
//       {/* <DialogActions>
//         <Button onClick={handleClose} autoFocus>
//           Okay
//         </Button>
//       </DialogActions> */}
//     </Dialog>
//   );
// }

// export default AxiosInterceptor;
