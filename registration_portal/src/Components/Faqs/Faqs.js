import React, { useState, useEffect } from 'react';
import './Faqs.css';
import Navbar from '../Navbar/Navbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

function Faqs() {
const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
const adminToken = localStorage.getItem('adminToken');
  //Commonly Setting the Bearer Token here so dont need to set header token in each API call.
  axios.defaults.headers.common['Authorization'] = `Bearer hospital ${adminToken}`;
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await axios.get(`${BACKEND_URL}/kiosk/getFAQs`);
        if (response.status === 200) {
          const data = response.data;
          if (data && data.status === 'success') {
            setFaqs(data.data);
          }
        } else {
          // Handle error response
          console.error('Failed to fetch FAQs');
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    }

    fetchFAQs();
  }, []); // Empty dependency array ensures this effect runs once on component mount

  return (
    <div className='FaqPage'>
      <Navbar pagename={"Frequently Asked Questions"} faqIsCalled={true}/>
      <div className='faqBody'>
        {faqs.map((faq) => (
          <Accordion key={faq.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${faq.id}-content`}
              id={`panel${faq.id}-header`}
            >
              <Typography style={{ fontWeight: 'bold' }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default Faqs;
