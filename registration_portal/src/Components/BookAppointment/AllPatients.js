import React,{useState} from 'react'
import './AllPatient.css'
import Navbar from '../Navbar/Navbar'
import malesign from '../../Assests/Images/malesign.svg'
import femalesign from '../../Assests/Images/femalesign.svg'
import defultPatient from '../../Assests/Images/defaultPatient.svg'

function AllPatients() {



    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardSelect = (index) => {
      setSelectedCard(index === selectedCard ? null : index);
    };

  return (
    <div className='AllPatientPage'>
      <Navbar pagename={"Already Registration"}/>
      <div className='detailBox'>
        <div className='detailboxContainer'>
            <div className='cardHeader'>
                <div className='cardHeaderBoldText'>
                Select Patient Profile
                </div>
                <div className='cardHeadersubText'>
                We found multiple patients registered with this mobile number
                </div>
                
            </div>

            <div className='Patientcard'>
                    <div
                    className={`innerPatientCard ${selectedCard === 1 ? 'selected' : ''}`}
                    onClick={() => handleCardSelect(1)}
                    >
                    <div style={{display:'flex', width:'100%',gap:'20px'}}>
                        <div style={{width:'80px'}}>
                           <img src={defultPatient} alt="" />
                        </div>
                        <div className='innerPatientCardBox'>
                           <div className='innerPatientCardBoxNameRow'>
                            <div className='innerPatientCardBoxName'>Mr Rajat Pradhan</div>
                            <div className='genderbox'>
                                <span><img src={malesign} alt="" /></span>
                                 <span className='genderRound'>Male</span>
                            </div>  
                           </div>
                           <div>
                            <span>Age : </span>
                            <span>20 Years 4 Months (01 Feb 2003)</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>



          {/* Remove this Part Later */}

          
          <div className='Patientcard'>
                    <div
                        className={`innerPatientCard ${selectedCard === 2 ? 'selected' : ''}`}
                        onClick={() => handleCardSelect(2)}
                        >
                    <div style={{display:'flex', width:'100%',gap:'20px'}}>
                        <div style={{width:'80px'}}>
                           <img src={defultPatient} alt="" />
                        </div>
                        <div className='innerPatientCardBox'>
                           <div className='innerPatientCardBoxNameRow'>
                            <div className='innerPatientCardBoxName'>Mrs. Roshni Dash</div>
                            <div className='genderbox'>
                                <span><img src={femalesign} alt="" /></span>
                                 <span className='genderRound'>Female</span>
                            </div>  
                           </div>
                           <div>
                            <span>Age : </span>
                            <span>24 Years 4 Months (01 Feb 2003)</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

          




        </div>
      </div>

    </div>
  )
}

export default AllPatients