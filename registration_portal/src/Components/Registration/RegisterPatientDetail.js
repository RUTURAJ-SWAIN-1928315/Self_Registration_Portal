//Author @Ruturaj Swain and @Bismit Pattnaik
import {React,useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import './RegisterPatientDetail.css'
import DefaultPatient from  "../../Assests/Images/defaultPatient.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPatientDetail() {
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const profileData = JSON.parse(localStorage.getItem('profileData'));
 
 // const aadharData = JSON.parse(localStorage.getItem('aadharData'));

 //HardCoded aadharData for testing
const aadharData = {
  full_name: "Ruturaj Swain",
  aadhaar_number: "537903394779",
  dob: "2001-06-04",
  gender: "M",
  address: {
      country: "India",
      dist: "Khordha",
      state: "Orissa",
      po: "",
      loc: "Nuasahi,Nayapalli",
      vtc: "Bhubaneswar",
      subdist: "",
      street: "Keshari Enclave",
      house: "Flat No-B-305",
      landmark: ""
  },
  face_status: false,
  face_score: -1.0,
  zip: "751012",
  has_image: true,
  care_of: "S/O Kruti Uchhwas Swain",
  share_code: "3542",
  mobile_verified: false,
  referenceId: null,
  status: "success_aadhaar",
  uniqueness_id: "ede5d9acf30b8c308df44d040c54d7e02027df268a2cf8391d0bc5ef18e7b376"
}
 
  const [disableInputFieldAadhar,setDisableInputFieldAadhar] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  //const siteId = localStorage.getItem('SiteId');



  // const [patientTypeList,setPatientTypeList] = useState([]);
  const [prefixMaster,setPrefixMaster] = useState([]);
    const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [genderList,setGenderList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [maskedAadharNumber, setMaskedAadharNumber] = useState('');


  const patientImage = null;
  // const [selectedGender, setSelectedGender] = useState('female');  
  const [formData, setFormData] = useState({
    firstName:'',
    middleName:'',
    lastName:'',
    selectedGender: '',
    selectedGenderId:'',
    selectedArea: 'Urban',
    selectedPrefix:'',
    selectedPrefixId:'',
    aadharNumber:'',
    mobileNumber:'',
    dob:'',
    age:'',
    emailId:'',
    pinCode: '',
    district: '',
    state: '',
    country: '',
    village: '',
    city:'',
    locality: '',
    postOffice: '',
    policeStation: '',
  });
 

   // Function to mask Aadhar number
   const maskAadharNumber = (number) => {
    return 'XXXX XXXX ' + number.slice(-4);
  };

  useEffect(() => {

    if(aadharData !== null){
      setDisableInputFieldAadhar(true);
      // Call maskAadharNumber function and update the masked Aadhar number state
      if (aadharData && aadharData.aadhaar_number) {
        setMaskedAadharNumber(maskAadharNumber(aadharData.aadhaar_number));
      }
      const fullNameParts = aadharData.full_name.split(' ');
      const firstName = fullNameParts[0];
      const lastName = fullNameParts.length > 1 ? fullNameParts[fullNameParts.length - 1] : '';
      const middleName = fullNameParts.slice(1, -1).join(' ');
      // Call calculateAge function and update the formData state
      const age = calculateAge(aadharData.dob);

      let gender;
      if (aadharData.gender === 'M') {
          gender = 'MALE';
      } else if (aadharData.gender === 'F') {
          gender = 'FEMALE';
      } else {
          gender = 'OTHERS';
      }
      // Set initial form data based on Aadhar data
      setFormData({
        ...formData,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        selectedGender: gender,
        aadharNumber: aadharData.aadhaar_number,
        pinCode:aadharData.zip,
        dob: aadharData.dob,
        age:age,
        district: aadharData.address.dist,
        state: aadharData.address.state,
        country: aadharData.address.country,
        city: aadharData.address.vtc,
        village:aadharData.address.vtc,
        locality: aadharData.address.loc,
        postOffice: aadharData.address.po,
      });
    }
  }, []);
 

   // Function to calculate age
   const calculateAge = (dob) => {
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  //  //For getting Patient Type master
  //  useEffect(() => {
    
  //   axios
  //     .get(`${BACKEND_URL}/kiosk/patientTypeMaster?siteId=${profileData.siteId}`)
  //     .then((response) => {
  //       if (response.data && response.data.status === "sucess") {
  //         const types = response.data.data.map(item => item.registrationType);
  //         setPatientTypeList(types);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  //   }, [BACKEND_URL,profileData.siteId]);

       //For getting Prefix master
   useEffect(() => {
    axios
      .get(`${BACKEND_URL}/kiosk/getPrefixMaster?`)
      .then((response) => {
        if (response.data && response.data.status === "success") {
          const prefixes = response.data.data.map(item => ({
            prefix: item.prefix,
            prefixId: item.prefixId,
          }));
          setPrefixMaster(prefixes);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, [BACKEND_URL,profileData?.siteId]);



    const handleAddressChange = (event) => {
      // const pinCode = event.target.value;
      // setFormData({ ...formData, pinCode: pinCode });
      // const state = event.target.value;
      // setFormData({ ...formData, state: state });
      // const country = event.target.value;
      // const district = event.target.value;
      // setFormData({ ...formData, district: district });
      // //cityName and village will be suggestions
      // const village = event.target.value;
      // setFormData({ ...formData, village: village });

      // Update only the field that triggered the event
      const { name, value } = event.target;
      console.log("value",value);
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

     // Check if the name of the field is pinCode and its value is empty
  if (name === "pinCode" && value.trim() === "") {
    // Reset all lists
    setCountryList([]);
    setStateList([]);
    setDistrictList([]);
    setVillageList([]);
  }else if (name === "pinCode" && value.length === 6){

      if (value.length === 6) { // Assuming pin code length is 6
        axios.get(`${BACKEND_URL}/kiosk/getAddressMaster?pinCode=${value}`, {
        })
        .then((response) => {
          if (response.data.status === "success" && response.data.data.length > 0) {
            const data = response.data.data;
            const uniqueCountries = [...new Set(data.map(item => item.countryName))];
            const uniqueStates = [...new Set(data.map(item => item.stateName))];
            const uniqueDistricts = [...new Set(data.map(item => item.districtName))];
            // const uniqueCities = [...new Set(data.map(item => item.cityName).filter(name => name))];
            const uniqueVillages = [...new Set(data.map(item => item.villageName).filter(name => name))];
    
            setCountryList(uniqueCountries);
            setStateList(uniqueStates);
            setDistrictList(uniqueDistricts);
            // setCityList(uniqueCities);
            setVillageList(uniqueVillages);
          }
        })
        .catch((error) => {
          console.error('Error fetching address data:', error);
        });
      }
    }
    };
 
 
  // const handleGenderChange = (event) => {
  //   setSelectedGender(event.target.value);
  // };

  const handleInputChange = (event) =>{
    const { name, value } = event.target;
     // Ensure only numeric values are entered for mobileNumber
  if (name === 'mobileNumber' && !/^\d+$/.test(value)) {
    return; // Ignore non-numeric input
  }
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'mobileNumber' ? value.slice(0, 10) : value
    }));
  }

  const handlePrefixChange = (event) => {
    const selectedPrefix = event.target.value;
  
    // Find the corresponding prefixId based on the selected prefix
    const selectedPrefixId = prefixMaster.find(item => item.prefix === selectedPrefix)?.prefixId;
  
    // Update the formData state with the selectedPrefix and selectedPrefixId
    setFormData(prevState => ({
      ...prevState,
      selectedPrefix: selectedPrefix,
      selectedPrefixId: selectedPrefixId,
    }));
  };

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      selectedArea: value
    }));
  };

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function formatDate(inputDate) {
    const dateParts = inputDate.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    return formattedDate;
  }

  

  const handleSaveNewRegistration = () =>{
    console.log("formData.selectedPrefix",formData.selectedPrefix,"formData.selectedPrefixId",formData.selectedPrefixId)
     // Validate mandatory fields
  const mandatoryFields = [
    'firstName',
    'selectedGender',
    'aadharNumber',
    'pinCode',
    'mobileNumber',
    'dob',
    'age',
    'district',
    'state',
    'country',
    'village',
  ];

  const missingFields = mandatoryFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    // Display toast error if any mandatory field is missing
    toast.error(`Please fill all mandatory fields: ${missingFields.join(', ')}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }


    const formattedDOB = formatDate(aadharData.dob);
    
    const newRegistrationRequestBody = {
      genderId:formData.selectedGenderId,
      siteId:Number(profileData?.siteId),
      prefixId:Number(formData.selectedPrefixId),
      prefix:formData.selectedPrefix,
      firstName:formData.firstName,
      middleName:formData.middleName,
      lastName:formData.lastName,
      gender:formData.selectedGender,
      dobStr:formattedDOB,
      age:Number(formData.age),
      contactNo:Number(formData.mobileNumber),
      email:formData.emailId,
      userId:Number(profileData.userId),
      aadhaarNumber:formData.aadharNumber,
      addressList:[
        {
          active:true,
          isRural:formData.selectedArea === 'Rural'?true:false,
          isUrban:formData.selectedArea === 'Urban'?true:false,
          pin:Number(formData.pinCode),
          district:formData.district,
          state:formData.state,
          country:formData.country,
          village:formData.village,
          locality:formData.locality,
          postOffice:formData.postOffice,
          policeStation:formData.policeStation
        }
      ]
    }
    
    axios
    .post(`${BACKEND_URL}/kiosk/registerPatient`,newRegistrationRequestBody)
     .then(async (response) => {
      setIsLoading(false);
          if(response.data.status === true){
          toast.success("Registration Successfull", {
         position: "top-right",
        autoClose: 1000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
      });
      handleClearAllInputs();

      // Wait for 2 seconds
      await delay(2000);

      navigate('/NewRegisterBookConsultation');
     }
     })
    .catch((error) => {
      console.error('Error saving data:', error);
    });
    
  }

  
  const handleClearAllInputs = () =>{
    setFormData({
      ...formData,
      firstName:  '',
      middleName: '',
      lastName: '',
      selectedGender: '',
      aadharNumber:'',
      pinCode: '',
      mobileNumber:'',
      dob: '',
      emailId:'',
      age:'',
      district:'',
      state: '',
      country:'',
      city: '',
      village:'',
      locality:'',
      postOffice:'',
    });
  }

return (
  <>
    <Navbar pagename={'New Registration'}/>
     
     <div className='newRegisterPatientBody'>
      <div className='newRegisterPatientContent' style={{display:'flex', flexDirection:'row'}}>

         <div style={{border:'groove', borderColor:'#f0ffff34', width:'11%', height:'170px', display:'flex', alignItems:'center', justifyContent:'center' }}>
           <img className='patientImage' src={patientImage || DefaultPatient} alt="Patient" />
         </div>

         <div className='detailContainer1' style={{ borderColor:'#f0ffff34', width:'100%' }}>

          <div> 

                  {/* <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Patient Type<span className='mandatoryField'>*</span></div>
                    <div style={{width: "80%"}}>
                        <select className='patientTypeSelectDropdown' placeholder='Select' 
                          >
                            <option className='patientOptionDropdown' disabled>Select Patient Type</option>
                            {patientTypeList.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                    </div>
                  </div> */}

                  <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Prefix<span className='mandatoryField'>*</span></div>
                    <div style={{width: "80%"}}>
                    <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedPrefix} onChange={(e) => handlePrefixChange(e)}>
                      <option className='patientOptionDropdown' value="" disabled>Select Prefix</option>
                      {prefixMaster.map((type, index) => (
                        <option key={index} value={type.prefix}>{type.prefix}</option>
                      ))}
                    </select>
                    </div>
                  </div>

                 <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Gender<span className='mandatoryField'>*</span></div>
                    {disableInputFieldAadhar ? (
                      <div style={{width: "80%"}}>
                      <input style={{borderRadius: '6px',width:'237px'}} className='patientNameInput' placeholder='Gender' value={formData.selectedGender} disabled={disableInputFieldAadhar}></input>
                      </div>
                    ):(

                      <div style={{width: "80%"}}>
                      <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedGender} disabled={disableInputFieldAadhar}>
                            <option className='patientOptionDropdown' disabled>Select Gender</option>
                            {genderList.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                        </div>
                    )}
                       
                    
                 </div>
             </div>

             <div style={{paddingLeft:'30px',paddingRight:'30px', width:'100%'}}>

             <div className="patientTypeDetailBox">
                <div className='patientTypeDetailLabel'>Patient Name<span className='mandatoryField'>*</span></div>
                  <div style={{display:'flex'}}>
                  <input style={{borderRadius: '6px 0px 0px 6px'}} className='patientNameInput' placeholder='First Name' value={formData.firstName} disabled={disableInputFieldAadhar}></input>
                  <input style={{borderRadius: '0px'}} className='patientNameInput' placeholder='Middle Name' value={formData.middleName} disabled={disableInputFieldAadhar}></input>
                  <input style={{borderRadius: '0px 6px 6px 0px'}} className='patientNameInput' placeholder='Last Name' value={formData.lastName} disabled={disableInputFieldAadhar}></input>
                </div>
              </div>
              <div style={{display:'flex', gap:'20px'}}>

                 <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Date of Birth</div>
                    <div style={{display:'flex'}}>
                    <input className='patientDatePicker' type='date' placeholder='dd-mm-yyyy' value={formData.dob} disabled={disableInputFieldAadhar}></input>
                    </div>  
                 </div>

                 <div style={{display:'flex', flexDirection:'column',gap:'6px'}}>    
                  <div className='patientTypeDetailLabel'>Age<span className='mandatoryField'>*</span></div>
                  <div className='patientAgeContainer'> 
                  <input style={{ borderRadius: '6px 0px 0px 6px'}} className='patientAgeInput' value = {formData.age} disabled={disableInputFieldAadhar}></input>
                  <select style={{
                    borderRadius: '0px 6px 6px 0px',
                    backgroundColor: disableInputFieldAadhar ? '#D9D9DE' : 'inherit',
                    }}
                    disabled={disableInputFieldAadhar}
                    >
                          <option value="">Years</option>
                          <option value="">Months</option>
                        </select>
                  </div>
                </div>

                <div style={{display:'flex', flexDirection:'column',gap:'6px',width:'100%'}}>
                  <div className='patientTypeDetailLabel'>Mobile Number<span className='mandatoryField'>*</span></div>
                  <input name = 'mobileNumber' className='patientNumberInput' placeholder='0000000000' value={formData.mobileNumber} onChange={handleInputChange}></input>
                </div> 

              </div>

                                 
              </div>
         </div>
         
      </div>
      <div className='newRegisterPatientAdharContent' style={{display:'flex', gap:'20px', paddingTop:'0px', paddingBottom:'0px'}}>
                <div style={{ width:'50%'}}>
                  <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Aadhar Number<span className='mandatoryField'>*</span></div>
                    <div style={{display:'flex'}}>
                    <input className='aadharNumberInput' placeholder='0000 0000 0000 0000' value={maskedAadharNumber} disabled={disableInputFieldAadhar}></input>
                    </div>
                  </div>
  
                </div>
                <div style={{ width:'50%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Email</div>
                  <div style={{display:'flex'}}>
                  <input className='aadharNumberInput' placeholder='example@email.com' name='emailId' value={formData.emailId} onChange={handleInputChange}></input>
                  </div>
                    
                  </div>
                </div>

      </div>

      <div className='AddressContainer'>

      <div className='patientTypeDetailLabel'>ADDRESS DETAILS</div>
        <div className='areaSelectionBox'>
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

     <div style={{ width:'100%', height:'133px'}}>
          <div className='addressDetailsContentRow'>
                <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>Pin Code<span className='mandatoryField'>*</span></div>
                <input
                  type="text"
                  name="pinCode"
                  className='addressInput'
                  placeholder='Pin Code'
                  value={formData.pinCode}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
                </div>

                <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>District<span className='mandatoryField'>*</span></div>
                <input
                  type='text'
                  name='district'
                  className='addressInput'
                  placeholder='District'
                  value={formData.district}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
              </div>

              <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>State<span className='mandatoryField'>*</span></div>
                <input
                  type='text'
                  name='state'
                  className='addressInput'
                  placeholder='State'
                  value={formData.state}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
              </div>

              <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>Country<span className='mandatoryField'>*</span></div>
                <input
                  type='text'
                  name='country'
                  className='addressInput'
                  placeholder='Country'
                  value={formData.country}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
              </div>
                </div>
            
           
            <div className='addressDetailsContentRow1'>
            {formData.selectedArea === 'Rural' ? (
            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Village<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="village"
               className='addressInput'
              placeholder='Village'
               value={formData.village}
              onChange={handleAddressChange}
             />
            </div>
            ) : (
              <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>City<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="city"
               className='addressInput'
              placeholder='City'
               value={formData.city}
              onChange={handleAddressChange}
             />
            </div>
            )}

            
            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Locality</div>
                      <input style={{borderRadius: '6px',width:'320px'}} className='patientNameInput' placeholder='locality' value={formData.locality} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Locality</div>
              <select
                name='locality'
                className='patientTypeSelectDropdownAddress'
                value={formData.locality}
                disabled={disableInputFieldAadhar}
                onChange={handleAddressChange}
              >
                <option value=''>Select Locality</option>
                {/* Add options dynamically here */}
              </select>
              </div>
            )}
              
            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Post Office' value={formData.postOffice || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office<span className='mandatoryField'>*</span></div>
              <select
                name='postOffice'
                className='patientTypeSelectDropdownAddress'
                value={formData.postOffice}
                disabled={disableInputFieldAadhar}
                onChange={handleAddressChange}
              >
                <option value=''>Select Post Office</option>
                {/* Add options dynamically here */}
              </select>
            </div>

            )}

            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Police Station</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Police Station' value={formData.policeStation || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(
              <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Police Station<span className='mandatoryField'>*</span></div>
            <select
              name='policeStation'
              className='patientTypeSelectDropdownAddress'
              value={formData.policeStation}
              onChange={handleAddressChange}
            >
              <option value=''>Select Police Station</option>
              {/* Add options dynamically here */}
            </select>
          </div>
            )}

            </div>
         </div> 

      </div>

      <div className='newRegistrationButtonGroupRow'>
      {!disableInputFieldAadhar && (
        
      <button className='newRegistrationCancelButton' onClick={handleClearAllInputs} disabled={disableInputFieldAadhar}>Clear All</button>
      
      )}
      <button className='newRegistrationSaveButton' onClick={handleSaveNewRegistration} >{isLoading ? 'Saving...' : 'Save & Next'}</button>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
     </div>
    
  </>
)
}

export default RegisterPatientDetail