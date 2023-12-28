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
 
 const aadharData = JSON.parse(localStorage.getItem('aadharData'));
 const [addressMaster,setAddressMaster] = useState([]);

 
  const [disableInputFieldAadhar,setDisableInputFieldAadhar] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  //const siteId = localStorage.getItem('SiteId');


 
  const [prefixMaster,setPrefixMaster] = useState([]);
  const [genderList,setGenderList] = useState([]);
  const [localityList,setLocalityList] = useState([]);
  const [postOfficeList,setPostOfficeList] = useState([]);
  const [policeStationList,setPoliceStationList] = useState([]);
  const [maskedAadharNumber, setMaskedAadharNumber] = useState('');


  const [patientImage,SetPatientImage] = useState('');
  const [formData, setFormData] = useState({
    firstName:'',
    middleName:'',
    lastName:'',
    selectedGender: '',
    selectedGenderId:'',
    selectedGenderCode:'',
    selectedArea: 'Urban',
    selectedPrefix:'',
    selectedPrefixId:'',
    aadharNumber:'',
    mobileNumber:'',
    dob:'',
    age:'',
    ageUnit:'Years',
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
    const capturedPhoto = localStorage.getItem('capturedPhoto');
    if(aadharData && aadharData.has_image){
      SetPatientImage(`data:image/jpeg;base64,${aadharData.profile_image}`);
    }
    else{
      SetPatientImage(capturedPhoto)
    }

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
  const { age: calculatedAge, unit } = calculateAge(aadharData.dob);

      let gender;
      if (aadharData.gender === 'M') {
          gender = 'MALE';
      } else if (aadharData.gender === 'F') {
          gender = 'FEMALE';
      } else {
          gender = 'OTHERS';
      }
      //Calling handleAddresChange here to load AddressMaster to be while saving
      handleAddressChange({ target: { name: 'pinCode', value: aadharData.zip } });
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
        age:calculatedAge,
        ageUnit: unit,
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
 
    // Function to handle changes in the age input
    const handleAgeChange = (event) => {
      const ageValue = event.target.value;
    
      // Allow only numbers in the age field
      if (/^\d*$/.test(ageValue)) {
        setFormData(prevState => ({
          ...prevState,
          age: ageValue
        }));
      }
    };
    // Function to handle changes in the age unit selection
    const handleAgeUnitChange = (e) => {
      setFormData({ ...formData, ageUnit: e.target.value });
    };
 

  // Function to calculate age

const calculateAge = (dob) => {
  if (!dob) {
    // If DOB is empty, return an empty string for age and unit
    return { age: '', unit: '' };
  }
  const birthday = new Date(dob);
  const today = new Date();
  if (today < birthday) {
    // If the entered DOB is a future date, show an error and clear the DOB
    toast.error("Date of Birth cannot be in the future", {
      position: "top-right",
      autoClose: 2000,
    });
    return { age: '', unit: '' };
  }

  let ageInYears = today.getFullYear() - birthday.getFullYear();
  let ageInMonths = today.getMonth() - birthday.getMonth();
  let ageInDays = today.getDate() - birthday.getDate();

  if (ageInMonths < 0 || (ageInMonths === 0 && ageInDays < 0)) {
    ageInYears--;
  }

  if (ageInYears > 0) {
    return { age: ageInYears, unit: 'Years' };
  } else if (ageInMonths > 0) {
    return { age: ageInMonths, unit: 'Months' };
  } else {
    return { age: Math.abs(ageInDays), unit: 'Days' };
  }
};



  //For getting gender Master
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/kiosk/getGenderMaster?categoryName=SEX`)
      .then((response) => {
        if (response.data && response.data.status === "success") {
          const genders = response.data.data.map(item => ({
            gender: item.lookupValue,
            genderId: item.lookupId,
            genderCode:item.lookupCode
          }));
          setGenderList(genders);
          
          if(aadharData){
            //Now only comparing male and female gender
            const selectedGender = aadharData.gender === 'M' ? 'MALE': aadharData.gender === 'F' ? 'FEMALE':'';
            const selectedGenderId = response.data.data.find(item => item.lookupValue === selectedGender)?.lookupId;
            const selectedGenderCode = response.data.data.find(item => item.lookupValue === selectedGender)?.lookupCode;
            setFormData(prevState => ({
              ...prevState,
              selectedGenderId: selectedGenderId,
              selectedGenderCode: selectedGenderCode
            }));
           }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, [BACKEND_URL]);


       //For getting Prefix master
   useEffect(() => {
    axios
      .get(`${BACKEND_URL}/kiosk/getPrefixMaster`)
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
    }, [BACKEND_URL]);



  const handleAddressChange = (event) => {
      const { name, value } = event.target;

  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

     // Check if the name of the field is pinCode and its value is empty
  if (name === "pinCode" && value.trim() === "") {
    setFormData(prevState => ({
      ...prevState,
      district: '',
      districtId:'',
      state: '',
      stateId:'',
      country: '',
      countryId:''
    }));


  }else if (name === "pinCode" && value.length === 6){

      if (value.length === 6) {
        axios.get(`${BACKEND_URL}/kiosk/getAddressMaster?pinCode=${value}`, {
        })
        .then((response) => {
          if (response.data.status === "success" && response.data.data.length > 0) {
            const data = response.data.data;
            setAddressMaster(response.data.data);

            //Since city village Country state District info. Coming from Aadhar so not setting them while aadhar data is available
            if(!aadharData){
            const uniqueLocality = [...new Set(data.map(item => item.locality))];

            setLocalityList(uniqueLocality)
            setFormData(prevState => ({
              ...prevState,
              city:response.data.data[0].cityName,
              village:response.data.data[0].villageName,
              country: response.data.data[0].countryName,
              state: response.data.data[0].stateName,
              district: response.data.data[0].districtName
 
          }));
        }
          
          }
        })
        .catch((error) => {
          console.error('Error fetching address data:', error);
        });
      }
    }
    };
 
 

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Allow only numeric values or an empty string for mobileNumber
    if (name === 'mobileNumber' && value !== '' && !/^\d+$/.test(value)) {
        return; // Ignore non-numeric input, except for empty string
    }

    // Handle mobile number input with length restriction
    if (name === 'mobileNumber') {
        setFormData(prevState => ({
            ...prevState,
            [name]: value.slice(0, 10) // Restrict to max 10 digits
        }));
    } else if (name === 'dob') {
        // Handle DOB change and calculate age
        const { age, unit } = calculateAge(value);
        setFormData(prevState => ({
            ...prevState,
            dob: value,
            age: age,
            ageUnit: unit
        }));
    } else {
        // Handle other input changes
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
};

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

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    const selectedGenderId = genderList.find(item => item.gender === selectedGender)?.genderId;
    const selectedGenderCode = genderList.find(item => item.gender === selectedGender)?.genderCode;
    setFormData(prevState => ({
      ...prevState,
      selectedGender: selectedGender,
      selectedGenderId: selectedGenderId,
      selectedGenderCode: selectedGenderCode
    }));
  }

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      selectedArea: value
    }));
  };

  const handleAadharChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Removes non-digit characters
    if (value.length <= 12) {
      setFormData(prevState => ({
        ...prevState,
        aadharNumber: value.replace(/(.{4})/g, '$1 ').trim()
      }));
    }
};

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function formatDate(inputDate) {
    const dateParts = inputDate.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    return formattedDate;
  }

  const isEmailValid = (email) => {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateAadhar = () => {
    return new Promise((resolve, reject) => {
        const formattedAadharNumber = formData.aadharNumber.replace(/\s/g, '');
        axios.get(`${BACKEND_URL}/kiosk/validateAadhaar?aadhaarNo=${formattedAadharNumber}`)
            .then((response) => {
                if (response.data.status === 'success') {
                    
                    resolve(true);
                } else {
                     
                    resolve(false);
                }
            })
            .catch((error) => {
                 
                toast.error("Aadhar validation failed.", {/* Toast options */});
                resolve(false);
            });
    });
};
  
console.log("aadharData",aadharData)

  const handleSaveNewRegistration = async () =>{
    setIsLoading(true);

    if(formData.aadharNumber !== ''){
    const isValidAadhar = await validateAadhar();
    if (!isValidAadhar) {
        setIsLoading(false);
        return;
    }
  }

    if(formData.aadharNumber !== ''){
    if (formData.aadharNumber.replace(/\s/g, '').length !== 12) {
      toast.error("Invalid Aadhar number.", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsLoading(false);
      return;
  }
}
    setIsLoading(true);

    //Since No information regarding post office and police station available so for now not including 
    //post office and police station as mandatory field

     // Validate mandatory fields
  let mandatoryFields = [
    'selectedPrefix',
    'firstName',
    'selectedGender',
    'pinCode',
    'mobileNumber',
    'age',
    'district',
    'state',
    'country',
    'dob'
  ];

   // Add 'village' or 'city' to mandatory fields based on selected area
   if (formData.selectedArea === 'Rural') {
    mandatoryFields.push('village');
} else if (formData.selectedArea === 'Urban') {
    mandatoryFields.push('city');
}

if(aadharData){
  mandatoryFields.push('aadharNumber');
}

  const missingFields = mandatoryFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    // Display toast error if any mandatory field is missing
    toast.error(`Please fill all mandatory fields: ${missingFields.join(', ')}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setIsLoading(false);
    return;
  }

  // Validate email
  if (formData.emailId && !isEmailValid(formData.emailId)) {
    toast.error('Invalid email address', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }
    let formattedDOB;
    if(aadharData === null){
    if(formData.dob === ''){
      formattedDOB='';
    }else{
      formattedDOB = formatDate(formData.dob);
    }
    }else{
    formattedDOB = formatDate(aadharData.dob);
    }

   // Find the matching address details from addressMaster.
   //Used OR condition since for the same district, state and country will be same
   //For aadharData case Replacing district State Country coming from aadhar with the one
   //Present in addressMaster since we will be need the Ids for it
  const matchingAddress = addressMaster.find(address => 
    address.districtName.toLowerCase() === formData.district.toLowerCase() ||
    address.stateName.toLowerCase() === formData.state.toLowerCase() ||
    address.countryName.toLowerCase() === formData.country.toLowerCase()
  );
  console.log("matchingAddress",matchingAddress,"addressMaster",addressMaster,"formData.district",formData.district)

    const formattedAadharNumber = formData.aadharNumber.replace(/\s/g, ''); // Remove spaces
    setIsLoading(true);
    const newRegistrationRequestBody = {
      genderId:formData.selectedGenderId,
      gender:formData.selectedGender,
      genderCode:formData.selectedGenderCode,
      siteId:Number(profileData?.siteId),
      prefixId:Number(formData.selectedPrefixId),
      prefix:formData.selectedPrefix,
      firstName:formData.firstName,
      middleName:formData.middleName === '' ? 'NA': formData.middleName,
      lastName:formData.lastName,
      dobStr:formattedDOB,
      age:Number(formData.age),
      // ageUnit:formData.ageUnit,
      contactNo:formData.mobileNumber,
      email:formData.emailId,
      userId:Number(profileData.userId),
      aadhaarNumber:formattedAadharNumber,
      photo:patientImage === null || patientImage === '' ? 'NA' :patientImage,
      addressList:[
        {
          active:true,
          isRural:formData.selectedArea === 'Rural'?true:false,
          isUrban:formData.selectedArea === 'Urban'?true:false,
          pin:Number(formData.pinCode),
          districtId:matchingAddress ? matchingAddress.districtId : null,
          districtName:formData.district,
          stateId:matchingAddress ? matchingAddress.stateId : null,
          stateName:formData.state,
          countryId: matchingAddress ? matchingAddress.countryId : null,
          countryName:formData.country,
          village:formData.village,
          locality:formData.locality,
          postOffice:formData.postOffice,
          policeStation:formData.policeStation,
          cityName:formData.city
        }
      ]
    }
    
    axios
    .post(`${BACKEND_URL}/kiosk/registerPatient`,newRegistrationRequestBody)
     .then(async (response) => {
      setIsLoading(false);
          if(response.data.status === true){
          localStorage.setItem("newRegistrationHIMSResponse",JSON.stringify(response.data.HimsResponse))
          getNewRegisterPatientDetail(response.data.HimsResponse.preRegisterId)
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
      await delay(3000);

      navigate('/NewRegisterBookConsultation');
     }
     })
    .catch((error) => {
      setIsLoading(false);
      toast.error("Something Went Wrong!!!!", {
        position: "top-right",
       autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
     });
      console.error('Error saving data:', error);
    });
    
  }

  const handleClearAllInputs = () =>{
    setFormData({
      ...formData,
      firstName:'',
      middleName:'',
      lastName:'',
      selectedGender: '',
      selectedGenderId:'',
      selectedGenderCode:'',
      selectedArea: 'Urban',
      selectedPrefix:'',
      selectedPrefixId:'',
      aadharNumber:'',
      maskedAadharNumber:'',
      mobileNumber:'',
      dob:'',
      age:'',
      ageUnit:'Years',
      emailId:'',
      pinCode: '',
      district: '',
      state: '',
      country: '',
      village: '',
      city:'',
      locality: '',
      postOffice: '',
      policeStation: ''
    });
  }

  

  function getNewRegisterPatientDetail(preRegisterId){
    axios
    .get(`${BACKEND_URL}/kiosk/getNewRegisteredPatient?preRegisterId=${preRegisterId}`)
     .then(async (response) => {
      setIsLoading(false);
          if(response.data.status === true){
          localStorage.setItem("NewRegisteredPatientDetails",JSON.stringify(response.data.data))
     }
     })
    .catch((error) => {
      setIsLoading(false);
      toast.error("Something Went Wrong!!!!", {
        position: "top-right",
       autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
     });
      console.error('Error saving data:', error);
    });
  }


return (
  <div className='RegisterPatientDetailPage'>
    <Navbar pagename={'New Registration'} registerPatientDetailIsCalled={true}/>
     
     <div className='newRegisterPatientBody'>
      <div className='newRegisterPatientContent' style={{display:'flex', flexDirection:'row'}}>

         <div style={{border:'groove', borderColor:'#f0ffff34', width:'11%', height:'170px', display:'flex', alignItems:'center', justifyContent:'center',borderRadius:'20px',padding:'10px'}}>
           <img className='patientImage' src={patientImage || DefaultPatient} alt="Patient" />
         </div>

         <div className='detailContainer1' style={{ borderColor:'#f0ffff34', width:'100%' }}>

          <div> 
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
                      <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedGender} disabled={disableInputFieldAadhar} onChange={(e) => handleGenderChange(e)}>
                            <option className='patientOptionDropdown' value="" disabled>Select Gender</option>
                            {genderList.map((gender) => (
                            <option key={gender.genderId} value={gender.gender}>
                              {gender.gender}
                            </option>
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
                  <input style={{borderRadius: '6px 0px 0px 6px'}} className='patientNameInput' placeholder='First Name' value={formData.firstName} disabled={disableInputFieldAadhar} onChange={handleInputChange} name="firstName"></input>
                  <input style={{borderRadius: '0px'}} className='patientNameInput' placeholder='Middle Name' value={formData.middleName} disabled={disableInputFieldAadhar} onChange={handleInputChange} name="middleName"></input>
                  <input style={{borderRadius: '0px 6px 6px 0px'}} className='patientNameInput' placeholder='Last Name' value={formData.lastName} disabled={disableInputFieldAadhar} onChange={handleInputChange} name="lastName"></input>
                </div>
              </div>
              <div style={{display:'flex', gap:'20px'}}>

                 <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Date of Birth<span className='mandatoryField'>*</span></div>
                    <div style={{display:'flex'}}>
                    <input className='patientDatePicker' type='date' placeholder='dd-mm-yyyy' value={formData.dob} disabled={disableInputFieldAadhar} onChange={handleInputChange} name='dob'></input>
                    </div>  
                 </div>

                 <div style={{display:'flex', flexDirection:'column',gap:'6px'}}>    
                  <div className='patientTypeDetailLabel'>Age<span className='mandatoryField'>*</span></div>
                  <div className='patientAgeContainer'> 
                  <input style={{ borderRadius: '6px 0px 0px 6px'}} className='patientAgeInput' value = {formData.age} disabled={disableInputFieldAadhar} onChange={handleAgeChange}></input>
                  <select style={{
                    borderRadius: '0px 6px 6px 0px',
                    backgroundColor: disableInputFieldAadhar ? '#D9D9DE' : 'inherit',
                    }}
                    onChange={handleAgeUnitChange}
                    value={formData.ageUnit}
                    disabled={formData.dob === '' ? false:true}
                    >
                          <option value="Days">Days</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
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
                    {aadharData ? (
                    <div className='patientTypeDetailLabel'>Aadhar Number<span className='mandatoryField'>*</span></div>
                    ):(
                      <div className='patientTypeDetailLabel'>Aadhar Number</div>
                    )}
                    <div style={{display:'flex'}}>
                    <input className='aadharNumberInput' placeholder='0000 0000 0000' 
                     value={aadharData ? maskedAadharNumber : formData.aadharNumber}  disabled={disableInputFieldAadhar} onChange={handleAadharChange}></input>
                     
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
                      <input style={{borderRadius: '6px',width:'320px'}} className='patientNameInput' placeholder='' value={formData.locality || ''} disabled={aadharData.address.loc === '' ? false:true} onChange={handleInputChange} name='locality'></input>
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
                {localityList.map((locality, index) => (
                <option key={index} value={locality}>
                  {locality}
                </option>
              ))}
              </select>
              </div>
            )}
              
            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office<span className='mandatoryField'>*</span></div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Post Office' value={formData.postOffice || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(

              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Post Office' value={formData.postOffice || ' '} disabled={disableInputFieldAadhar}  onChange={handleAddressChange} name='postOffice'></input>
                      </div>

            )}

            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Police Station<span className='mandatoryField'>*</span></div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Police Station' value={formData.policeStation || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(

              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Police Station</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Police Station' value={formData.policeStation || ' '} disabled={disableInputFieldAadhar}   onChange={handleAddressChange} name='policeStation'></input>
                      </div>
          
            )}

            </div>
         </div> 

      </div>

      <div className='newRegistrationButtonGroupRow'>
      {!disableInputFieldAadhar && (
        
      <button className='newRegistrationCancelButton' onClick={handleClearAllInputs} disabled={disableInputFieldAadhar}>Clear All</button>
      
      )}
      <button className='newRegistrationSaveButton' onClick={handleSaveNewRegistration} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save & Next'}</button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
     </div>
    
  </div>
)
}

export default RegisterPatientDetail