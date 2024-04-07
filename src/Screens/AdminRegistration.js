import { registerAdmin } from "../Store/AdminSlice";
import { useDispatch } from "react-redux";
import React, { useState } from "react"
import { Paper, TextField, Avatar, InputAdornment, InputLabel, FormControl, Button, OutlinedInput, IconButton } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useStylesAdminRegistration } from "../CSS Components/AdminregistrationCss";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function () {
  const dispatch = useDispatch()
  var navigate = useNavigate()
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [handleButton, setHandleButton] = useState(false)
  const [error, setError] = useState({})
  const [image, setImage] = useState("")
  const classes = useStylesAdminRegistration()
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    //Change handleButton State
    setHandleButton(false)
    const file = event.target.files[0];
    setImage(file);
  }

  const validation = () => {
    var error = false
    if (adminName.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("Plz fill admin name...!", "adminname")
      error = true
    }
    if (image.length == 0) {
      //setHandleButton for state change to color
      setHandleButton(true)
      handleError("Plz Choose Picture...!", "image")
      error = true
    }
    if (email.length == 0 && mobileNumber.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("* You must submit any one, email or mobile...!", "email")
      error = true
    }
    if (email.length == 0 && mobileNumber.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("* You must submit any one, email or mobile...!", "mobile")
      error = true
    }
    if (password.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("Plz fill password...!", "password")
      error = true
    }
    return error
  }
  /*Important const to set Error*/
  const handleError = (error, lable) => {
    setError((prev) => ({ ...prev, [lable]: error }))
  }
  const handleSubmit = (e) => {

    var error = validation()
    if (error == false) {
      e.preventDefault()

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        const imageData = reader.result;

        dispatch(
          registerAdmin({
            id: Math.random().toString(36).substring(2, 9), adminName, email, mobileNumber, password, imageData
          }))
      }
      Swal.fire({
        position: "center",
        size: "small",
        icon: "success",
        title: "Admin Registered Successfully",
        showConfirmButton: true,
        timer: 1500,
        toast: true
      });
      navigate("/adminlogin")
    }
  }
  const handleReset = () => {
    setAdminName("")
    setImage(null)
    setEmail("")
    setPassword("")
    setMobileNumber("")
  }
  return (
    <div className={classes.div1}>
      <Paper className={classes.div2}>
        <div className={classes.div3}><div className={classes.div3a}><AdminPanelSettingsIcon /></div><div className={classes.div3b}>Admin Registration</div></div>

        <div className={classes.div4}>
          <div className={classes.div5}>
            <TextField value={adminName} error={error.adminname} onFocus={() => handleError(null, "adminname")} helperText={error.adminname} onChange={(e) => setAdminName(e.target.value)} fullWidth label="Admin Name" size="small" placeholder="Admin Name" title="Admin Name" /></div>
          <div className={classes.div7}>{error.email}</div>
          <div className={classes.div5}>
            <TextField value={email} error={error.email} onFocus={() => handleError(null, "email")} onChange={(e) => setEmail(e.target.value)} fullWidth label="Email ID" size="small" placeholder="Email ID" title="Email ID" /></div>
          <div className={classes.div5}>
            <TextField type="tel" value={mobileNumber} error={error.mobile} onFocus={() => handleError(null, "mobile")} onChange={(e) => setMobileNumber(e.target.value)} fullWidth label="Mobile" size="small" placeholder="Mobile" title="Mobile" /></div>
          <div className={classes.div6}>
            <FormControl error={error.password} onFocus={() => handleError(null, "password")} onChange={(e) => setPassword(e.target.value)} fullWidth size="small" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <div className={classes.div8}>{error.password}</div>
          </div>
        </div>
        <div className={classes.div9}>
          <div>
            {/* Important Error Handling calling for Image~ */}
            <Button color={handleButton ? "error" : "primary"} variant="outlined" onFocus={() => handleError(null, "image")} component="label" size="small">
              <input onChange={handleChange} hidden type="file" accept="images/*" multiple />
              Admin Picture
            </Button></div>
          <div className={classes.div8}>{error.image}</div>
          <div>
            {image && (
              <Avatar src={URL.createObjectURL(image)} alt="adminregistration" variant="circle" />)} </div>
        </div>

        <div className={classes.div10}>
          <Button variant="outlined" onClick={handleSubmit} size="small">Submit</Button>
          <Button variant="outlined" onClick={handleReset} size="small">reset</Button>
        </div>
        <div className={classes.div11}>
          <div className={classes.div12}>Or, Have You Any Existing Admin Account??</div>
          <div onClick={() => navigate("/adminlogin")} className={classes.div13}>Login Here</div>
        </div>
      </Paper>
    </div>
  )
}