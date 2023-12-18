//Author @Ruturaj Swain and @Bismit Pattnaik
import {React,useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import './RegisterPatientDetail.css'
import DefaultPatient from  "../../Assests/Images/defaultPatient.svg";

function RegisterPatientDetail() {
  const [patientTypeList,setPatientTypeList] = useState([]);
  const patientImage = null;
  const [selectedGender, setSelectedGender] = useState('female');  
  const [selectedArea,setSelectedArea] = useState('Rural');
  const [formData, setFormData] = useState({
    selectedGender: 'female',
    selectedArea: 'Rural',
    pinCode: '',
    district: '',
    state: '',
    country: '',
    village: '',
    locality: '',
    postOffice: '',
    policeStation: '',
  });

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      selectedArea: value
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  return (
    <>
      <Navbar pagename={'New Registration'}/>
      <div className='newRegistrationBody'>
        <div className='newRegistrationContent'>
        <div>
        <img className='patientImage' src={patientImage || DefaultPatient} alt="Patient" />
        </div>
        <div className='newRegistrationContentSection'>
        <div className='newRegistrationHeaderRow'>

        <div className="patientTypeDetailBox">
            <div className='patientTypeDetailLabel'>Patient Type<span className='mandatoryField'>*</span></div>
            <div style={{width: "80%"}}>
                <select className='patientTypeSelectDropdown' placeholder='Select'  
                  >
                    <option className='patientOptionDropdown'>Select Patient Type</option>
                     <option>OPD</option>
                     <option>IP</option>
                </select>
            </div>
        </div>

        <div className='genderSelectionBox'>
          <div className='patientTypeDetailLabel'>Gender<span className='mandatoryField'>*</span></div>
           <div className="gender-selection">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={selectedGender === 'male'}
              onChange={handleGenderChange}
              className="gender-radio"
            />
            <label htmlFor="male" className={`gender-label ${selectedGender === 'male' ? 'selected' : ''}`}>
              Male
            </label>

              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={selectedGender === 'female'}
                onChange={handleGenderChange}
                className="gender-radio"
              />
              <label htmlFor="female" className={`gender-label ${selectedGender === 'female' ? 'selected' : ''}`}>
                Female
              </label>

              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                checked={selectedGender === 'other'}
                onChange={handleGenderChange}
                className="gender-radio"
              />
              <label htmlFor="other" className={`gender-label ${selectedGender === 'other' ? 'selected' : ''}`}>
                Other
              </label>
            </div>
            </div>


        </div>

          <div className='newRegistrationHeaderRow1'>
                <div className="patientTypeDetailBox">
                <div className='patientTypeDetailLabel'>Patient Name<span className='mandatoryField'>*</span></div>
                <div style={{display:'flex'}}>
                <input className='patientNameInput' placeholder='First Name'></input>
                <input className='patientNameInput' placeholder='Middle Name'></input>
                <input className='patientNameInput' placeholder='Last Name'></input>
                </div>
                  
                </div>

                <div style={{display:'flex', gap:'10px'}}>
                <div className="patientTypeDetailBox">

                <div className='patientTypeDetailLabel'>Date of Birth</div>
                <div style={{display:'flex'}}>
                <input className='patientDatePicker' type='date' placeholder='dd-mm-yyyy'></input>
                </div>  
                </div>

                <div style={{display:'flex', flexDirection:'column',gap:'6px'}}>    
                <div className='patientTypeDetailLabel'>Age<span className='mandatoryField'>*</span></div>
                <div className='patientAgeContainer'> 
                <input className='patientNameInput'></input>
                <select style={{borderRadius:'6px'}}>
                        <option value="">Years</option>
                        <option value="">Months</option>
                      </select>
                </div>
                </div>

                <div style={{display:'flex', flexDirection:'column',gap:'6px'}}>
                <div className='patientTypeDetailLabel'>Mobile Number<span className='mandatoryField'>*</span></div>
                <input className='patientNumberInput' placeholder='0000000000'></input>
                </div>
                </div>

      </div>

      </div>
        </div>
        <div className='newRegistrationAadharHeaderRow'>
      <div className="patientTypeDetailBox">
           <div className='patientTypeDetailLabel'>Aadhar Number<span className='mandatoryField'>*</span></div>
           <div style={{display:'flex'}}>
           <input className='aadharNumberInput' placeholder='0000 0000 0000 0000'></input>
          </div>
            
           </div>

           <div className="patientTypeDetailBox">
           <div className='patientTypeDetailLabel'>Email</div>
           <div style={{display:'flex'}}>
           <input className='aadharNumberInput' placeholder='example@email.com'></input>
          </div>
            
           </div>
        </div>

        <div className='addressDetailsSection'>
        <div className='patientTypeDetailLabel'>ADDRESS DETAILS</div>
        <div className='genderSelectionBox'>
          <div className='patientTypeDetailLabel'>Area<span className='mandatoryField'>*</span></div>
           <div className="gender-selection">
            <input
              type="radio"
              id="Urban"
              name="Area"
              value="Urban"
              checked={formData.selectedArea === 'Urban'}
              onChange={handleAreaChange}
              className="gender-radio"
            />
            <label htmlFor="Urban" className={`gender-label ${formData.selectedArea === 'Urban' ? 'selected' : ''}`}>
              Urban
            </label>

              <input
                type="radio"
                id="Rural"
                name="Area"
                value="Rural"
                checked={formData.selectedArea === 'Rural'}
                onChange={handleAreaChange}
                className="gender-radio"
              />
              <label htmlFor="Rural" className={`gender-label ${formData.selectedArea === 'Rural' ? 'selected' : ''}`}>
                Rural
              </label>

            </div>
            </div>

            <div className='addressDetailsContent'>

            <div className='addressDetailsContentRow'>
            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Pin Code<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="pinCode"
               className='patientNameInput'
              placeholder='Pin Code'
               value={formData.pinCode}
              onChange={handleInputChange}
             />
            </div>

            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>District<span className='mandatoryField'>*</span></div>
            <select className='patientTypeSelectDropdown' placeholder='Select'  
                  >
                    <option className='patientOptionDropdown'>Select District</option>
                     <option>Khurdha</option>
                     <option>CUttack</option>
                </select>
            </div>

            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>State<span className='mandatoryField'>*</span></div>
            <select className='patientTypeSelectDropdown' placeholder='Select'  
                  >
                    <option className='patientOptionDropdown'>Select State</option>
                     <option>Odisha</option>
                     <option>Delhi</option>
                </select>
            </div>

            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Country<span className='mandatoryField'>*</span></div>
            <select className='patientTypeSelectDropdown' placeholder='Select'  
                  >
                    <option className='patientOptionDropdown'>Select Country</option>
                     <option>India</option>
                     <option>USA</option>
                </select>
            </div>
            </div>

            {formData.selectedArea === 'Rural' && (
            <div className='addressDetailsContentRow'>
            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Village<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="village"
               className='patientNameInput'
              placeholder='Village'
               value={formData.village}
              onChange={handleInputChange}
             />
            </div>

            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Locality</div>
            <input
               type="text"
               name="locality"
               className='patientNameInput'
              placeholder='Locality'
               value={formData.locality}
              onChange={handleInputChange}
             />
            </div>

            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Post Office<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="postOffice"
               className='patientNameInput'
              placeholder='Post Office'
               value={formData.postOffice}
              onChange={handleInputChange}
             />
            </div>
            
            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Police Station<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="policeStation"
               className='patientNameInput'
              placeholder='Police Station'
               value={formData.policeStation}
              onChange={handleInputChange}
             />
            </div>
            </div>
            )}
            </div>

            <div className='newRegistrationButtonGroupRow'>
                <button className='newRegistrationCancelButton' >Clear All</button>
                <button className='newRegistrationSaveButton' >Save & Next</button>
            </div>

        </div>

      </div>

    </>
  )
}

export default RegisterPatientDetail