import React, { useContext, useEffect, useRef, useState } from 'react';
import './Profile.css'
import axios from 'axios';
import { BACKEND_URL } from '../../constants/Constants';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/avatar.png'
import { GlobalStateContext } from '../../context/GlobalState';
import { MenuContext } from '../../context/Menu';
import FormButton from '../FormButton/FormButton';


const Profile = () => {
    const navigate = useNavigate()
    const [formFields, setFormFields] = useState({username: "", firstName: "", lastName: "", password: "", phoneNumber: "", imageSource: "", imgFile: null, fileUrl: ""})
    const [formFieldsErrors, setFormFieldsErrors] = useState({username: "", firstName: "", lastName: "", password: "", phoneNumber: ""})
    const {clearUserCookie, setActiveNavbarItem} = useContext(GlobalStateContext);
    const {clearMenuItemsState} = useContext(MenuContext)

    const [loading, setLoading] = useState(false)

    //const [file, setFile] = useState({removed: false, imgFile: null, fileUrl: ""})

    const [passwordHasErrors, setPasswordHasErrors] = useState({rule1: true, rule2: true, rule3: true, rule4: true})
    
    useEffect(() => {
        axios.post(`${BACKEND_URL}/api/v1/app/users/profile`, {userId: Cookies.get("userId")}, 
        {headers: {"Authorization": `Bearer ${Cookies.get('token')}`}})
        .then((res) => {
            
            setFormFields({...formFields, 
                username: res.data.message.username, 
                firstName: res.data.message.firstName, 
                lastName: res.data.message.lastName, 
                imageSource: res.data.message.imageSource,
                phoneNumber: res.data.message.phoneNumber})
            setActiveNavbarItem("PROFILE");
        })
        .catch((err) => {
            if(err.status == 401 || err.status == 403){
                clearUserCookie();
                clearMenuItemsState();
                navigate("/biteandsip/login");
            }
        })
    }, [])

    const changeFile = (event) => {
        setFormFields({...formFields, imgFile: event.target.files[0], fileUrl: window.URL.createObjectURL(event.target.files[0])})
        //setFile({removed: false, imgFile: event.target.files[0], fileUrl: window.URL.createObjectURL(event.target.files[0])})
    }

    const updateUserDetails = () => {
        let hasErrors = false;
        let newErrors = {};

       

        if(formFields.username.trim() == ""){
            newErrors["username"] = "Username address is required"
            hasErrors=true;
        }

        if(formFields.firstName.trim() == ""){
            newErrors["firstName"] = "First name field is required"
            hasErrors=true;
        }

        if(formFields.lastName.trim() == ""){
            newErrors["lastName"] = "Last name field is required"
            hasErrors=true;
        }

        if(formFields.phoneNumber.trim() == ""){
            newErrors["phoneNumber"] = "phone number field is required"
            hasErrors=true;
        }

        if(formFields.password != "" && (passwordHasErrors["rule1"] || passwordHasErrors["rule2"] || passwordHasErrors["rule3"] || passwordHasErrors["rule4"])){
            newErrors["password"] = "Password is invalid"
            hasErrors=true;
        } else {
            newErrors["password"] = ""
        }

        setFormFieldsErrors(newErrors);

        if(!hasErrors && formFields){
            let formData = new FormData();

        formData.append("file", formFields.imgFile);
        //formData.append("fileRemoved", file.removed);
        formData.append("username", formFields.username)
        formData.append("firstName", formFields.firstName)
        formData.append("lastName", formFields.lastName)
        formData.append("password", formFields.password)
        formData.append("imageSource", formFields.imageSource)
        formData.append("phoneNumber", formFields.phoneNumber)
        formData.append("userId", Cookies.get("userId"))

        setLoading(true)
        axios.put(`${BACKEND_URL}/api/v1/app/users/profile/update`, formData, 
        {headers: {"Authorization": `Bearer ${Cookies.get('token')}`}})
        .then((res) => {
            setLoading(false)
            if(res.status == 200){
                clearUserCookie();
                clearMenuItemsState();
                navigate('/biteandsip/login', { state: { message: "LOGIN AGAIN FOR THE CHANGES TO TAKE EFFECT" } })
            }
        })
        .catch((err) => {
            setLoading(false)
            if(err.status == 401 || err.status == 403){
                clearUserCookie();
                clearMenuItemsState();
                navigate("/biteandsip/login");
            }
        })
        }
    }

    const handleFieldChange = () => {
        
        setFormFields({...formFields, [event.target.name]: event.target.value})

        if(event.target.name == "password" && event.target.value != ""){
            let passwordErrors = {...passwordHasErrors}
            if(event.target.value.length >= 8){
                passwordErrors = {...passwordErrors, rule1: false}
            } else {
                passwordErrors = {...passwordErrors, rule1: true}
            }

            if(/[A-Z]/.test(event.target.value) && /[a-z]/.test(event.target.value)){
                passwordErrors = {...passwordErrors, rule2: false}
            } else {
                passwordErrors = {...passwordErrors, rule2: true}
            }

            if(/[0-9]/.test(event.target.value)){
                passwordErrors = {...passwordErrors, rule3: false}
            } else {
                passwordErrors = {...passwordErrors, rule3: true}
            }

            if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(event.target.value)){
                passwordErrors = {...passwordErrors, rule4: false}
            } else {
                passwordErrors = {...passwordErrors, rule4: true}
            }

            setPasswordHasErrors(passwordErrors)
        }
    }

    const [passwordFieldType, setPasswordFieldType] = useState("password")
    const [passwordFieldVisibilityIcon, setPasswordFieldVisibilityIcon] = useState("visibility");

    const handleShowPassword = () => {
        if(passwordFieldType == "password"){
            setPasswordFieldType("text")
            setPasswordFieldVisibilityIcon("visibility_off")
        } else {
            setPasswordFieldType("password")
            setPasswordFieldVisibilityIcon("visibility")
        }
    }

    const imgFileRef = useRef()

    const showImageSelector = () => {
        imgFileRef.current.click()
    }

    const deleteProfileImg = () => {
        setFormFields({...formFields,  imageSource: "", imgFile: null, fileUrl: ""})
        //setFile({imgFile: null, fileUrl: "", removed: true})
    }

    return <div className="profile-outer-container">
        
       <div className='profile-inner-container'>

        <div className='page-title'>PROFILE</div>
 
       <div className='profile-img-container' onClick={showImageSelector} style={{cursor: "pointer"}}>
            {
                <img src={formFields.fileUrl != "" ? formFields.fileUrl : formFields.imageSource || logoImg} alt='profile img' />
                
            }
            <input type='file' id='imgFile' ref={imgFileRef} style={{display: "none"}} onChange={changeFile}/>
            
        </div>

        <button className='delete-profile-img' onClick={deleteProfileImg}>DELETE PROFILE IMAGE</button>

        <div className='form-field-group'>
                <input type='text' placeholder='Email Address' className='text-field' name='username' value={formFields.username} 
                onChange={handleFieldChange}/>
                <span className="material-symbols-rounded form-field-icon">person</span>
                <p className='form-field-error'>{formFieldsErrors.username}</p>
            </div>

            <div className='form-field-group'>
                <input type='text' placeholder='First Name' className='text-field' name='firstName' value={formFields.firstName} 
                onChange={handleFieldChange}/>
                <span className="material-symbols-rounded form-field-icon">id_card</span>
                <p className='form-field-error'>{formFieldsErrors.firstName}</p>
            </div>

            <div className='form-field-group'>
                <input type='text' placeholder='Last Name' className='text-field' name='lastName' value={formFields.lastName} 
                onChange={handleFieldChange}/>
                <span className="material-symbols-rounded form-field-icon">id_card</span>
                <p className='form-field-error'>{formFieldsErrors.lastName}</p>
            </div>

            <div className='form-field-group'>
                <input type='text' placeholder='Phone Number' className='text-field' name='phoneNumber' value={formFields.phoneNumber} 
                onChange={handleFieldChange}/>
                <span className="material-symbols-rounded form-field-icon">phone</span>
                <p className='form-field-error'>{formFieldsErrors.phoneNumber}</p>
            </div>

            <div className='form-field-group'>
                <input type={[passwordFieldType]} placeholder='Password' 
                className='text-field' name='password' 
                onChange={handleFieldChange} 
                autoComplete='off'/>
                <span className="material-symbols-rounded form-field-icon">password</span>
                <span className="material-symbols-rounded show-password-icon" onClick={handleShowPassword}>{passwordFieldVisibilityIcon}</span>
                <p className='form-field-error'>{formFieldsErrors.password}</p>
                <ul style={{position: "absolute", left: "2px", color: "var(--main-color)", bottom: `${formFieldsErrors.password != "" ? '-120px' : '-105px'}`}}>
                    <li className='password-rule'>{formFields.password != "" && passwordHasErrors["rule1"] == false ? <span className="material-symbols-rounded text-green">check_circle</span> : <span className="material-symbols-rounded text-red">cancel</span>}At least 8 characters long</li>
                    <li className='password-rule'>{formFields.password != "" && passwordHasErrors["rule2"] == false ? <span className="material-symbols-rounded text-green">check_circle</span> : <span className="material-symbols-rounded text-red">cancel</span>}At least 1 uppercase letter</li>
                    <li className='password-rule'>{formFields.password != "" && passwordHasErrors["rule3"] == false ? <span className="material-symbols-rounded text-green">check_circle</span> : <span className="material-symbols-rounded text-red">cancel</span>}At least 1 digit</li>
                    <li className='password-rule'>{formFields.password != "" && passwordHasErrors["rule4"] == false ? <span className="material-symbols-rounded text-green">check_circle</span> : <span className="material-symbols-rounded text-red">cancel</span>}At least 1 special character</li>
                </ul>
            </div>

            <div className="editor-actions-container">
                <FormButton handleRequest={updateUserDetails} isLoading={loading} customStyles={{marginTop: "115px"}}>
                    <div className="editor-action">
                    <span>SAVE</span><span className="material-symbols-rounded">publish</span>
                    </div>
                </FormButton>

            </div>


          
       </div>
    </div>
}

export default Profile;