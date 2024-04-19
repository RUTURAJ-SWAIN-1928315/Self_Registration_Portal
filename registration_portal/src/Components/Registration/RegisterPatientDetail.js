//Author @Ruturaj Swain and @Bismit Pattnaik
import {React,useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import './RegisterPatientDetail.css'
import DefaultPatient from  "../../Assests/Images/defaultPatient.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import searchIcon from '../../Assests/Images/searchIcon.svg';
 

function RegisterPatientDetail() {
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const profileData = JSON.parse(localStorage.getItem('profileData'));
  const adminToken = localStorage.getItem('adminToken');
  //Commonly Setting the Bearer Token here so dont need to set header token in each API call.
  axios.defaults.headers.common['Authorization'] = `Bearer hospital ${adminToken}`;
 
 const aadharData = JSON.parse(localStorage.getItem('aadharData'));
 const [addressMaster,setAddressMaster] = useState([]);
 const [localitySuggestions, setLocalitySuggestions] = useState([]);
 const [pinCodeSuggestions,setPinCodeSuggestions] = useState([]);
 const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
 const [isWhatsAppSameAsMobile, setIsWhatsAppSameAsMobile] = useState(false);

 
  const [disableInputFieldAadhar,setDisableInputFieldAadhar] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  //const siteId = localStorage.getItem('SiteId');
 
  const [prefixMaster,setPrefixMaster] = useState([]);
  const [genderList,setGenderList] = useState([]);
  const [localityList,setLocalityList] = useState([]);
  // const [postOfficeList,setPostOfficeList] = useState([]);
  // const [policeStationList,setPoliceStationList] = useState([]);
  const [maskedAadharNumber, setMaskedAadharNumber] = useState('');
  const [relationMaster, setRelationMaster] = useState([]);
  const [referralTypeMaster, setReferralTypeMaster] = useState([]);
  const [referralInstituteMaster,setReferralInstituteMaster] = useState([]);
  const [countryMasterSuggestionList,setCountryMasterSuggestionList] = useState([]);
  const [referredBySuggestionList,setReferredBySuggestionList] = useState([]);
  const [referredToSuggestionList,setReferredToSuggestionList] = useState([]);

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
    whatsAppNumber:'',
    dob:'',
    age:'',
    ageUnit:'Years',
    emailId:'',
    selectedNationalityName:'',
    selectedNationalityId:'',
    address:'',
    pinCode: '',
    district: '',
    state: '',
    country: '',
    village: '',
    city:'',
    locality: '',
    localityId:'',
    postOffice: '',
    policeStation: '',
    contactPerson:'',
    selectedRelationName:'',
    selectedRelationId:'',
    emergencyNumber:'',
    selectedReferralTypeName:'',
    selectedReferralTypeId:'',
    selectedReferralInstituteName:'',
    selectedReferralInstituteId:'',
    selectedReferredByName:'',
    selectedReferredById:'',
    selectedReferredToName:'',
    selectedReferredToId:'',
    refHospitalPatientNo:''
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

      //Adding the below condition for gender, so as the display the gender value in UI.
      //If we receive M in aadhar gender, we will be displaying MALE in UI. 
      let gender;
      if ((aadharData.gender).toLowerCase() === 'M'.toLowerCase()) {
          gender = 'MALE';
      } else if ((aadharData.gender).toLowerCase() === 'F'.toLowerCase()) {
          gender = 'FEMALE';
      } else if((aadharData.gender).toLowerCase() ===  'T'.toLowerCase() ){
          gender = 'Transgender';
      }else{
        gender = 'Unknown';
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

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
  
    // Pad month and day with leading zeros if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
  
    return `${year}-${month}-${day}`;
  };
  

  const calculateDateFromAge = (age, ageUnit) => {
    const today = new Date();
    let calculatedDate;
  
    if (ageUnit === 'Days') {
      calculatedDate = new Date(today.getTime() - age * 24 * 60 * 60 * 1000);
    } else if (ageUnit === 'Months') {
      calculatedDate = new Date(today.getFullYear(), today.getMonth() - age, today.getDate());
    } else if (ageUnit === 'Years') {
      calculatedDate = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
    }
  
    const year = calculatedDate.getFullYear();
    const month = String(calculatedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-indexed
    const day = String(calculatedDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
 
// Function to handle changes in the age input
const handleAgeChange = (event) => {
  const ageValue = event.target.value;

  if (/^\d*$/.test(ageValue)) {
    const calculatedDob = calculateDateFromAge(ageValue, formData.ageUnit);

    setFormData((prevState) => ({
      ...prevState,
      age: ageValue,
      dob: calculatedDob,
    }));
  } else {
    // If the age input is not a valid number or empty, handle this case
    setFormData((prevState) => ({
      ...prevState,
      age: '', // Reset age to empty
      dob: '', // Clear dob as age input is invalid
    }));
  }
};


const handleAgeUnitChange = (e) => {
  const { value } = e.target;

  setFormData((prevState) => ({
    ...prevState,
    ageUnit: value,
  }));
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
        if (response.data && response.status === 200) {
          const genders = response.data.data.map(item => ({
            gender: item.lookupValue,
            genderId: item.lookupId,
            genderCode:item.lookupCode
          }));
          setGenderList(genders);


          //Added this gender comparison for aadharCase.
          if(aadharData){
            let selectedGenderId;
            //Since lookUpId In genderMaster will remain constant as confirmed by HIMS Team, so hardcoding genderId based on gender received from aadhar
           //Setting genderId = 580(genderId for gender=Both) for aadharData.gender = Transgender as confirmed by HIMS Team
            if(aadharData.gender.toLowerCase() === 'M'.toLowerCase()){
              selectedGenderId = 1;
            }else if(aadharData.gender.toLowerCase() === 'F'.toLowerCase()){
              selectedGenderId = 2;
            }else if(aadharData.gender.toLowerCase() === 'T'.toLowerCase()){
              selectedGenderId = 580;
            }else{
              selectedGenderId = 1063;
            }
            
           
            // const selectedGender = (aadharData.gender).toLowerCase() === 'M'.toLowerCase() ? 'MALE': (aadharData.gender).toLowerCase() === 'F'.toLowerCase() ? 'FEMALE':(aadharData.gender).toLowerCase() === 'T'.toLowerCase() ? 'Both':'Unknown';
            // const selectedGenderId = response.data.data.find(item => item.lookupValue === selectedGender)?.lookupId;
            // const selectedGenderCode = response.data.data.find(item => item.lookupValue === selectedGender)?.lookupCode;

            //Finding selectedGender and selectedGenderCode based on the the selectedGenderId
            const selectedGender = response.data.data.find(item => item.lookupId === selectedGenderId)?.lookupValue;
            const selectedGenderCode = response.data.data.find(item =>item.lookupId === selectedGenderId)?.lookupCode;
            setFormData(prevState => ({
              ...prevState,
              selectedGender:selectedGender,
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
        if (response.data && response.status === 200) {
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

    //For getting Relationship master
    useEffect(() => {
      axios
          .get(`${BACKEND_URL}/kiosk/getRelationMaster?categoryName=RELATION`)
          .then((response) => {
              if (response.data && response.status === 200) {
                  setRelationMaster(response.data.data);
              }
          })
          .catch((error) => {
              console.error('Error fetching data:', error);
          });
  }, [BACKEND_URL]);

  const handleRelationChange = (event) => {
    const selectedRelation = event.target.value;
  
    // Find the corresponding relationId based on the selected Relation
    const selectedRelationId = relationMaster.find(item => item.lookupValue === selectedRelation)?.lookupId;
  
    // Update the formData state with the selectedRelation and selectedRelationId
    setFormData(prevState => ({
      ...prevState,
      selectedRelationName: selectedRelation,
      selectedRelationId: selectedRelationId,
    }));
  };



  //For getting Referral type master
  useEffect(() => {
    axios
        .get(`${BACKEND_URL}/kiosk/getSimpleProfileMaster?categoryName=REFERRALTYPE`)
        .then((response) => {
            if (response.data && response.status === 200) {
                setReferralTypeMaster(response.data.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, [BACKEND_URL]);

const handleReferralChange = (event) => {
  const selectedReferral = event.target.value;

  // Find the corresponding referralId based on the selected referral
  const selectedReferralId = referralTypeMaster.find(item => item.profileValue === selectedReferral)?.profileId;

  // Update the formData state with the selectedReferral and selectedReferralId
  setFormData(prevState => ({
    ...prevState,
    selectedReferralTypeName: selectedReferral,
    selectedReferralTypeId: selectedReferralId,
  }));
};

//For Referral Institute Master
useEffect(() => {
  axios
      .get(`${BACKEND_URL}/kiosk/getReferralInstitutesMaster?siteId=${profileData.siteId}`)
      .then((response) => {
          if (response.data && response.status === 200) {
              setReferralInstituteMaster(response.data.data);
          }
      })
      .catch((error) => {
          console.error('Error fetching data:', error);
      });
}, [BACKEND_URL]);

const handleReferralInstituteChange = (event) => {
  const selectedReferralInstitute = event.target.value;

  const selectedReferralInstituteId = referralInstituteMaster.find(item => item.refHospitalName === selectedReferralInstitute)?.refHospitalId;

  setFormData(prevState => ({
    ...prevState,
    selectedReferralInstituteName: selectedReferralInstitute,
    selectedReferralInstituteId: selectedReferralInstituteId,
  }));
};

//For Referred By suggestions
function fetchReferredBySuggestions(input){
  if(!formData.selectedReferralInstituteId){
    toast.error("Please Select the institute.", {
      position: "top-right",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }
  axios
  .get(`${BACKEND_URL}/kiosk/getReferredByMaster?instituteId=${formData.selectedReferralInstituteId}&name=${input}`)
  .then((response) => {
      if (response.data && response.status === 200) {
          setReferredBySuggestionList(response.data.data);
      }
  })
  .catch((error) => {
      console.error('Error fetching data:', error);
  });
}

//For Referred To consultant Suggestions
function fetchReferredToSuggestions(input){
  axios
  .get(`${BACKEND_URL}/kiosk/getReferredToConsultant?name=${input}&siteId=${profileData.siteId}`)
  .then((response) => {
      if (response.data && response.status === 200) {
          setReferredToSuggestionList(response.data.data);
      }
  })
  .catch((error) => {
      console.error('Error fetching data:', error);
  });
}

 //For getting Country/Nationality Master
function fetchCountryMaster(input){
  axios
      .get(`${BACKEND_URL}/kiosk/getCountryMaster?name=${input}`)
      .then((response) => {
          if (response.data && response.status === 200) {
            setCountryMasterSuggestionList(response.data.data);
          }
      })
      .catch((error) => {
          console.error('Error fetching data:', error);
      });
}

  const handleAddressChange = (event) => {
      const { name, value } = event.target;

  // Check if the field being changed is the pinCode
  if (name === "pinCode") {
    // Allow only numbers in the pin code field
    if (!/^\d*$/.test(value)) {
        return; // If the input is not a number, return without updating the state
    }
  }

  //Setting formData for fields other than pincode
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

     // Check if the name of the field is pinCode and its value is empty
  if (name === "pinCode" && (value.trim() === "" || value.length !==6 )) {
    setFormData(prevState => ({
      ...prevState,
             district: '',
            districtId: '',
            state: '',
            stateId: '',
            city:'',
            country: '',
            countryId: '',
            locality: '', 
            localityId: '',
            postOffice:'',
            policeStation:'',
    }));

    setLocalitySuggestions([]); // Clear suggestions if pinCode is empty
    setLocalityList([]);
    setPinCodeSuggestions([]); // Clear pin code suggestions
  }else if (name === "pinCode" && value.length === 6){
      if (value.length === 6) {
        axios.get(`${BACKEND_URL}/kiosk/getAddressMaster?pinCode=${value}`)
        .then((response) => {
          if (response.data.status === "success" && response.data.data.length > 0) {
            const data = response.data.data;
            setAddressMaster(response.data.data);

            //Since city village Country state District info. Coming from Aadhar so not setting them while aadhar data is available
            if(!aadharData){
            const uniqueLocality = [...new Set(data.map(item => item.locality))];

            setLocalityList(uniqueLocality);

            // Automatically select the locality if there's only one
            // For Temporary Purpose Setting selected Locality in Post Office as suggested by HIMS Team.
            //For Post Office as suggested by HIMS Team, selected Locality will be set in post Office,until otherwise
            //Changed by user.
              if (uniqueLocality.length === 1) {
                setFormData(prevFormData => ({
                  ...prevFormData,
                  locality: uniqueLocality[0],
                  postOffice:uniqueLocality[0]
                }));
              }
            // Create suggestions for pinCode - locality
            const pinCodeSuggestions = data.map(item => `${value} - ${item.locality}`);
            setPinCodeSuggestions(pinCodeSuggestions);
            
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

    //This Function Filters out the locality not matching the keyword entered by user from the localityList received from API
    const handleLocalityInputChange = (event) => {
      const { value } = event.target;
  
      if (localitySuggestions.length > 0 && value !== '') {
        setSelectedSuggestionIndex(0); // Highlight the first suggestion
      } else {
        setSelectedSuggestionIndex(-1); // No suggestion is selected
      }

       // Update the locality in the formData state
       // For Temporary Purpose Setting selected Locality in Post Office as suggested by HIMS Team.
       //For Post Office as suggested by HIMS Team, selected Locality will be set in post Office,until otherwise
       //Changed by user.
       setFormData(prevFormData => ({
        ...prevFormData,
        locality: value,
    }));
 
      if (value.trim() === '') {
          // Clear suggestions if the locality input is empty
          setLocalitySuggestions([]);
      } else if (value === '%%') {
          // If user types '%%', show all localities in the suggestions
          setLocalitySuggestions(localityList);
      } else {
          // Filter and set suggestions based on the updated value
          const filteredSuggestions = localityList.filter(locality => 
              locality.toLowerCase().includes(value.toLowerCase())
          );
  
          setLocalitySuggestions(filteredSuggestions);
      }
  };


  //Function for handling PinCode suggestions
  const handlePinCodeSuggestionSelect = (suggestion) => {
    const locality = suggestion.split(' - ')[1];
    setFormData(prevFormData => ({
      ...prevFormData,
      locality: locality,
      postOffice: locality
    }));
    setPinCodeSuggestions([]); // Clear suggestions after selection
  };

//Not Including keyDown since KIOSK will be a touch screen and no need of keydown
    // const handleKeyDown = (e) => {
    //   if (e.key === 'ArrowUp') {
    //     e.preventDefault();
    //     console.log("selectedSuggestionIndex",selectedSuggestionIndex)
    //     setSelectedSuggestionIndex((prevIndex) => {
    //       const newIndex = prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1;
    //       scrollSuggestionIntoView(newIndex);
    //       return newIndex;
    //     });
    //   } else if (e.key === 'ArrowDown') {
    //     e.preventDefault();
    //     setSelectedSuggestionIndex((prevIndex) => {
    //       const newIndex = prevIndex >= suggestions.length - 1 ? 0 : prevIndex + 1;
    //       scrollSuggestionIntoView(newIndex);
    //       return newIndex;
    //     });
    //   } else if (e.key === 'Enter') {
    //     e.preventDefault();
    //     console.log("selectedSuggestionIndex",selectedSuggestionIndex)
    //     if (selectedSuggestionIndex !== -1) {
    //       setFormData((prevData) => ({
    //         ...prevData,
    //         locality: localityList[selectedSuggestionIndex],
    //       }));
    //       setSuggestions([]); // Clear suggestions after selection
    //       setSelectedSuggestionIndex(-1); // Reset suggestion index
    //     }
    //   }
    // };
    
  
    // const scrollSuggestionIntoView = (index) => {
    //   const selectedSuggestionElement = document.querySelector('.suggestions-container li:nth-child(' + (index + 1) + ')');
    //   if (selectedSuggestionElement) {
    //     selectedSuggestionElement.scrollIntoView({
    //       behavior: 'smooth',
    //       block: 'nearest',
    //     });
    //   }
    // };
 

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Allow only numeric values or an empty string for mobileNumber or whatsAppNumber
    if ((name === 'mobileNumber' || name === 'whatsAppNumber' || name === 'emergencyNumber') && value !== '' && !/^\d+$/.test(value)) {
        return; // Ignore non-numeric input, except for empty string
    }

    // Handle mobile number/WhatsApp Number input with length restriction
    if (name === 'mobileNumber') {
        setFormData(prevState => ({
            ...prevState,
            [name]: value.slice(0, 10) // Restrict to max 10 digits
        }));
        //Added this condition so that if "same as mobile number" is checked so that when user types mobile number whatsapp number will be automatically filled
        if(isWhatsAppSameAsMobile){
          setFormData(prevState => ({
            ...prevState,
           whatsAppNumber: value.slice(0, 10) // Restrict to max 10 digits
        }));
        }
    }else if (name === 'emergencyNumber') {
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
                if (response.status === 200) {
                    
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
  
// console.log("aadharData",aadharData)

  const handleSaveNewRegistration = async () =>{
    setIsLoading(true);

    if(formData.aadharNumber !== ''){
    const isValidAadhar = await validateAadhar();
    if (!isValidAadhar) {
        setIsLoading(false);
        return;
    }
  }

    //Added this condition for manual registration case. Checking if the aadhaar number entered by user is empty or not equal to 12 
    //characters then showing invalid aadhaar Number message
    if(formData.aadharNumber !== ''){
    if (formData.aadharNumber.replace(/\s/g, '').length !== 12) {
      toast.error("Invalid Aadhaar number.", {
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
    //On suggestion of HIMS Team Setting locality selected by user in post office
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

//If aadharData is present make aadharNumber a mandatory Fields
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
    setIsLoading(false)
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
    address.countryName.toLowerCase() === formData.country.toLowerCase() ||
    address.locality.toLowerCase() === formData.locality ||
    address.cityName.toLowerCase() === formData.city
  );

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
      middleName:formData.middleName,
      lastName:formData.lastName,
      dobStr:formattedDOB,
      age:Number(formData.age),
      // ageUnit:formData.ageUnit,
      contactNo:formData.mobileNumber,
      whatsAppNumber:formData.whatsAppNumber,
      email:formData.emailId,
      nationalityId:Number(formData.selectedNationalityId),
      instituteId:Number(formData.selectedReferralInstituteId),
      referredById:Number(formData.selectedReferredById),
      referredToDrId:Number(formData.selectedReferredToId),
      refHospitalPatientNo:formData.refHospitalPatientNo,
      referralTypeId:formData.selectedReferralTypeId,
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
          address:formData.address,
          districtName:formData.district,
          stateId:matchingAddress ? matchingAddress.stateId : null,
          stateName:formData.state,
          countryId: matchingAddress ? matchingAddress.countryId : null,
          countryName:formData.country,
          village:formData.village,
          locality:formData.locality,
          localityId:matchingAddress ? matchingAddress.localityId : null,
          postOffice:formData.postOffice,
          policeStation:formData.policeStation,
          cityName:formData.city,
          cityId:matchingAddress ? matchingAddress.cityId : null,
          contactPerson:formData.contactPerson,
          relationId:formData.selectedRelationId,
          phone1:formData.emergencyNumber,
        }
      ]
    }
    
    axios
    .post(`${BACKEND_URL}/kiosk/registerPatient`,newRegistrationRequestBody)
     .then(async (response) => {
      setIsLoading(false);
          if(response.status === 200){
          localStorage.setItem("newRegistrationHIMSResponse",JSON.stringify(response.data.HimsResponse))
          getNewRegisterPatientDetail(response.data.HimsResponse.preRegisterId)
          toast.success("Self Registration Successfull", {
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

      navigate('/SelfConfirmation');
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
      whatsAppNumber:'',
      dob:'',
      age:'',
      ageUnit:'Years',
      emailId:'',
      selectedNationalityName:'',
      selectedNationalityId:'',
      address:'',
      pinCode: '',
      district: '',
      state: '',
      country: '',
      village: '',
      city:'',
      locality: '',
      localityId:'',
      postOffice: '',
      policeStation: '',
      contactPerson:'',
      selectedRelationName:'',
      selectedRelationId:'',
      emergencyNumber:'',
      selectedReferralTypeName:'',
      selectedReferralTypeId:'',
      selectedReferralInstituteName:'',
      selectedReferralInstituteId:'',
      selectedReferredByName:'',
      selectedReferredById:'',
      selectedReferredToName:'',
      selectedReferredToId:'',
      refHospitalPatientNo:''
    });
  }

  

  function getNewRegisterPatientDetail(preRegisterId){
    axios
    .get(`${BACKEND_URL}/kiosk/getNewRegisteredPatient?preRegisterId=${preRegisterId}`)
     .then(async (response) => {
      setIsLoading(false);
          if(response.status === 200){
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

         <div style={{border:'groove', borderColor:'#f0ffff34', width:'11%', height:'150px', display:'flex', alignItems:'center', justifyContent:'center',borderRadius:'20px',padding:'10px'}}>
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
              <div style={{display:'flex', gap:'20px',alignItems:'baseline'}}>

                 <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Date of Birth<span className='mandatoryField'>*</span></div>
                    <div style={{display:'flex'}}>
                    <input className='patientDatePicker' type='date' placeholder='dd-mm-yyyy' value={formData.dob} max={getCurrentDate()} disabled={disableInputFieldAadhar} onChange={handleInputChange} name='dob'></input>
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
                    // disabled={formData.dob === '' ? false:true}
                    >
                          <option value="Days">Days</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
                  </select>
                  </div>
                </div>

                <div style={{display:'flex', flexDirection:'column',gap:'6px',width:'100%'}}>
                  <div className='patientTypeDetailLabel'>Mobile Number<span className='mandatoryField'>*</span></div>
                  <input name = 'mobileNumber' className='patientNumberInput' placeholder='Enter Mobile Number' value={formData.mobileNumber} onChange={handleInputChange}></input>
                </div> 

                <div style={{display:'flex', flexDirection:'column', gap:'6px', width:'100%'}}>
                <div className='patientTypeDetailLabel'>WhatsApp Number</div>
                <input name='whatsAppNumber' className='patientNumberInput' placeholder='Enter WhatsApp Number' value={formData.whatsAppNumber} onChange={handleInputChange} disabled={isWhatsAppSameAsMobile}></input>
                <div style={{display:'flex',alignItems:'center'}}>
                  <input type="checkbox" checked={isWhatsAppSameAsMobile} onChange={(e) => {
                    setIsWhatsAppSameAsMobile(e.target.checked);
                    if (e.target.checked) {
                      setFormData({ ...formData, whatsAppNumber: formData.mobileNumber });
                    }
                  }} />
                  <label className='sameAsMNLabel'>Same as Mobile Number</label>
                </div>
                </div>

              </div>

                                 
              </div>
         </div>
         
      </div>
      <div className='newRegisterPatientAdharContent' style={{display:'flex', gap:'20px', paddingTop:'0px', paddingBottom:'0px'}}>
                <div style={{ width:'50%'}}>
                  <div className="patientTypeDetailBox">
                    {aadharData ? (
                    <div className='patientTypeDetailLabel'>Aadhaar Number<span className='mandatoryField'>*</span></div>
                    ):(
                      <div className='patientTypeDetailLabel'>Aadhaar Number</div>
                    )}
                    <div style={{display:'flex'}}>
                    <input className='aadharNumberInput' placeholder='Enter Aadhaar Number' 
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

                <div style={{ width:'50%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Nationality</div>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      className='addressInput'
                      placeholder='Type to search...'
                      value={formData.selectedNationalityName}
                      onChange={(e) => {
                        setFormData(prevFormData => ({
                          ...prevFormData,
                          selectedNationalityName: e.target.value,
                          selectedNationalityId: e.target.value.trim() === '' ? '' : prevFormData.selectedNationalityId
                        }));
                        if (e.target.value.trim() !== '') {
                          fetchCountryMaster(e.target.value);
                        } else {
                          setCountryMasterSuggestionList([]); // Clears suggestions if input is cleared
                        }
                      }}
                      style={{ paddingRight: '50px' }}
                    />
                    <img 
                      style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                      src={searchIcon}
                      alt="search Icon"
                      onClick={() => formData.selectedNationalityName.trim() !== '' && fetchCountryMaster(formData.selectedNationalityName)}
                    />
                    {formData.selectedNationalityName.trim() !== '' && countryMasterSuggestionList.length > 0 && (
                      <div className="suggestions-container">
                        <ul className="suggestions">
                          {countryMasterSuggestionList.map((suggestion, index) => (
                            <li key={index} onClick={() => {
                              setFormData(prevFormData => ({
                                ...prevFormData,
                                selectedNationalityName: suggestion.nationality,
                                selectedNationalityId: suggestion.countryId
                              }));
                              setCountryMasterSuggestionList([]);
                            }}>
                              {suggestion.nationality}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                </div>

              </div>


                <div className='EmergencyContactBox'>
                <div className='patientTypeDetailLabelHead'>EMERGENCY CONTACT</div>
                <div style={{ width:'16%'}}>
                  <div className="patientTypeDetailBox">
                      <div className='patientTypeDetailLabel'>Contact Person</div>
                    <div style={{display:'flex'}}>
                    <input className='aadharNumberInput' placeholder='Enter Name' name="contactPerson"
                     value={formData.contactPerson}  onChange={handleInputChange}></input>
                    </div>
                  </div>
  
                </div>
                <div style={{ width:'16%'}}>
                  <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Relationship</div>
                   <div style={{width: "80%"}}>
                    <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedRelationName} onChange={(e) => handleRelationChange(e)}>
                      <option className='patientOptionDropdown' value="" disabled>Select Relation</option>
                      {relationMaster.map((type, index) => (
                        <option key={index} value={type.lookupValue}>{type.lookupValue}</option>
                      ))}
                    </select>
                    </div>
                </div>

                </div>

                <div style={{ width:'16%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Emergency Contact Number</div>
                  <div style={{display:'flex'}}>
                  <input className='aadharNumberInput' placeholder='Enter Phone Number' name='emergencyNumber' value={formData.emergencyNumber} onChange={handleInputChange}></input>
                  </div>
                    
                  </div>
                </div>

              </div>

              <div className='ReferralBox'>
              <div className='patientTypeDetailLabelHead'>REFERRAL DETAILS</div>
                <div style={{ width:'16%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Referral Type</div>
                  <div style={{width: "80%"}}>
                    <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedReferralTypeName} onChange={(e) => handleReferralChange(e)}>
                      <option className='patientOptionDropdown' value="" disabled>Select Referral Type</option>
                      {referralTypeMaster.map((type, index) => (
                        <option key={index} value={type.profileValue}>{type.profileValue}</option>
                      ))}
                    </select>
                    </div>
                  </div>

  
                </div>
                <div style={{ width:'16%'}}>
                <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Institute</div>
                    <div style={{width: "80%"}}>
                    <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedReferralInstituteName} onChange={(e) => handleReferralInstituteChange(e)}>
                      <option className='patientOptionDropdown' value="" disabled>Select Institute</option>
                      {referralInstituteMaster.map((type, index) => (
                        <option key={index} value={type.refHospitalName}>{type.refHospitalName}</option>
                      ))}
                    </select>
                    </div>
                </div>

                </div>

                <div style={{ width:'16%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Referred by</div>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      className='addressInput'
                      placeholder='Type to search...'
                      value={formData.selectedReferredByName}
                      onChange={(e) => {
                        setFormData(prevFormData => ({
                          ...prevFormData,
                          selectedReferredByName: e.target.value,
                          selectedReferredById: e.target.value.trim() === '' ? '' : prevFormData.selectedReferredById
                        }));
                        if (e.target.value.trim() !== '') {
                          fetchReferredBySuggestions(e.target.value);
                        } else {
                          setReferredBySuggestionList([]); // Clears suggestions if input is cleared
                        }
                      }}
                      style={{ paddingRight: '20px' }}
                    />
                    <img 
                      style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                      src={searchIcon}
                      alt="search Icon"
                      onClick={() => formData.selectedReferredByName.trim() !== '' && fetchReferredBySuggestions(formData.selectedReferredByName)}
                    />
                    {formData.selectedReferredByName.trim() !== '' && referredBySuggestionList.length > 0 && (
                      <div className="suggestions-container">
                        <ul className="suggestions">
                          {referredBySuggestionList.map((suggestion, index) => (
                            <li key={index} onClick={() => {
                              setFormData(prevFormData => ({
                                ...prevFormData,
                                selectedReferredByName: suggestion.doctorName,
                                selectedReferredById: suggestion.doctorId
                              }));
                              setReferredBySuggestionList([]);
                            }}>
                              {suggestion.doctorName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                </div>

                <div style={{ width:'16%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Referred To Consultant</div>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      className='addressInput'
                      placeholder='Type to search...'
                      value={formData.selectedReferredToName}
                      onChange={(e) => {
                        setFormData(prevFormData => ({
                          ...prevFormData,
                          selectedReferredToName: e.target.value,
                          selectedReferredToId: e.target.value.trim() === '' ? '' : prevFormData.selectedReferredToId
                        }));
                        if (e.target.value.trim() !== '') {
                          fetchReferredToSuggestions(e.target.value);
                        } else {
                          setReferredToSuggestionList([]); // Clears suggestions if input is cleared
                        }
                      }}
                      style={{ paddingRight: '20px' }}
                    />
                    <img 
                      style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                      src={searchIcon}
                      alt="search Icon"
                      onClick={() => formData.selectedReferredToName.trim() !== '' && fetchReferredToSuggestions(formData.selectedReferredToName)}
                    />
                    {formData.selectedReferredToName.trim() !== '' && referredToSuggestionList.length > 0 && (
                      <div className="suggestions-container">
                        <ul className="suggestions">
                          {referredToSuggestionList.map((suggestion, index) => (
                            <li key={index} onClick={() => {
                              setFormData(prevFormData => ({
                                ...prevFormData,
                                selectedReferredToName: suggestion.employeeName,
                                selectedReferredToId: suggestion.employeeId
                              }));
                              setReferredToSuggestionList([]);
                            }}>
                              {suggestion.employeeName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                </div>

                <div style={{ width:'16%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Ref. Hospital Patient Number</div>
                  <div style={{display:'flex'}}>
                  <input className='aadharNumberInput' placeholder='Enter Ref. Hospital patient Number' name='refHospitalPatientNo' value={formData.refHospitalPatientNo} onChange={handleInputChange}></input>
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
          <div style={{width:'169%'}} className='addressInputRow'>
                <div className='patientTypeDetailLabel'>House No. / Street <span className='mandatoryField'>*</span></div>
                <input
                  style={{width:'93%'}}
                  type='text'
                  name='address'
                  className='addressInput'
                  placeholder='Enter House no./ street / lane '
                  value={formData.address}
                  onChange={handleAddressChange}
                />
              </div>
          <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Pin Code<span className='mandatoryField'>*</span></div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '6px 6px 6px 6px', width: '93%' }}>
                <input
                  type="text"
                  name="pinCode"
                  className='addressInput'
                  placeholder='Pin Code'
                  value={formData.pinCode}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                  style={{width:'94%'}}
                />

                  {/* Pin code suggestions */}
                  {/* pinCodeSuggestions.length > 1 this condition is added to show suggestions when the length is > 1, since in 
                  handleAddressChange mapping the locality,postOffice fields directly when there is only one locality*/}
                  {pinCodeSuggestions && pinCodeSuggestions.length > 1 && (
                    <div className="suggestions-container">
                      <ul className="suggestions">
                        {pinCodeSuggestions.map((suggestion, index) => (
                          <li key={index} onClick={() => handlePinCodeSuggestionSelect(suggestion)}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
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

                </div>
            
           
            <div className='addressDetailsContentRow1'>
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

            {formData.selectedArea === 'Rural' ? (
            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Village<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="village"
               className='addressInput'
              placeholder='Village'
               value={formData.village}
               disabled={disableInputFieldAadhar}
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
               disabled={disableInputFieldAadhar}
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
              <div className="addressInputRow">
          <div className="patientTypeDetailLabel">Locality</div> 
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '2px' , background:'var(--White, #FFF)',borderRadius:'6px 6px 6px 6px',width:'93%'
              }}>
              <img style={{ cursor: 'pointer' }} src={searchIcon} alt="search Icon" />
                <input
                style={{
                border:'none',
                outline:'none',
                }}
                  className="patientNameInput"
                  name="locality"
                  value={formData.locality}
                  onChange={handleLocalityInputChange}
                  onPaste={handleLocalityInputChange}
                  placeholder="Search Locality"
                  // onKeyDown={handleKeyDown}
                />
              
                {localitySuggestions.length > 0 && (
                  <div className="suggestions-container">
                    <ul className="suggestions">
                      {localitySuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={index === selectedSuggestionIndex ? 'selected' : ''}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              locality: suggestion,
                              postOffice: suggestion
                            });
                            setLocalitySuggestions([]); // Clear suggestions after selection
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            )}
              
            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office<span className='mandatoryField'>*</span></div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Enter Post Office' value={formData.postOffice || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(

              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Enter Post Office' value={formData.postOffice} disabled={disableInputFieldAadhar}  onChange={handleAddressChange} name='postOffice'></input>
                      </div>

            )}

            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Police Station</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Police Station' value={formData.policeStation || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(

              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Police Station</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Enter Police Station' value={formData.policeStation} disabled={disableInputFieldAadhar}   onChange={handleAddressChange} name='policeStation'></input>
                      </div>
          
            )}

            </div>
         </div> 

      </div>

      {/* Notes Div */}
      {disableInputFieldAadhar && (
      <div className='aadhaarNotesDiv'>
      <div className='patientTypeDetailLabel' style={{color:'red', fontStyle: 'italic',fontSize:'14px'}}>
      <span className='mandatoryField'>*</span>Note: Aadhaar data is non-editable.<span className='mandatoryField'>*</span>
      </div>
      </div>
      )}

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