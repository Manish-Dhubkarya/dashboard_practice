import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Paper, TextField, Avatar, InputAdornment, InputLabel, FormControl, Button, OutlinedInput, IconButton } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useStylesAdminRegistration } from '../CSS Components/AdminregistrationCss';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
export default function AdminLogin() {
  var navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState({})
  const classes = useStylesAdminRegistration()
  const admins = useSelector((state) => state.admin.admins);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleSubmit = (e) => {
    var error = validation()
    if (error == false) {
      e.preventDefault();
      const admin = admins.find(
        (admin) => (admin.email === email || admin.mobileNumber === email) && admin.password === password
      );

      if (admin) {
        // Successfully logged in
        Swal.fire({
          position: "center",
          size: "small",
          icon: "success",
          title: "Admin Login Successfully...!",
          showConfirmButton: true,
          timer: 1500,
          toast: true
        });
        navigate("/dashboard", { state: { email: admin.email ? admin.email : email, name: admin.adminName, picture: admin.imageData } })
        // Redirect or perform other actions as needed
      } else {
        // Display error message
        Swal.fire({
          position: "center",
          size: "small",
          icon: "success",
          title: "Invalid Email/Password/Mobile...!",
          showConfirmButton: true,
          timer: 1500,
          toast: true
        });
      }
    }

  };

  const validation = () => {
    var error = false
    if (email.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("Plz fill email id or mobile number", "email")
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

  return (
    <div className={classes.div1}>
      <Paper className={classes.div2}>
        <div className={classes.div3}><div className={classes.div3a}><AdminPanelSettingsIcon /></div><div className={classes.div3b}>Admin Login</div></div>
        <div className={classes.div4}>
          <div className={classes.div5}>
            <TextField value={email} error={error.email} helperText={error.email} onFocus={() => handleError(null, "email")} onChange={(e) => setEmail(e.target.value)} fullWidth label="Email ID or Mobile" size="small" placeholder="Email ID or Mobile" title="Email ID or Mobile" /></div>
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
        <div className={classes.div10}>
          <Button fullWidth variant="outlined" onClick={handleSubmit} size="small">Login</Button>
        </div>
        <div className={classes.div11}>
          <div className={classes.div12}>Don't Have Existing Admin Account??</div>
          <div onClick={() => navigate("/adminreg")} className={classes.div13}>Register Here</div>
        </div>
      </Paper>
    </div>
  );
};
