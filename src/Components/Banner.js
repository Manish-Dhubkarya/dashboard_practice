import Swal from "sweetalert2";
import { Avatar, Button, MenuItem, Grid, FormControl, InputLabel, Select } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import UploadMultipleImages from "./UploadMultipleImagesComponent";
import Heading from "./Heading";
import BannnerLogo from "../Assets/banner.png"
import { useState } from "react";
import { postData } from "../Services/FetchNodeServices";
import { useStylesProductDetails } from "../CSS Components/ProductDetailsCss";
import { useStylesCategory } from "../CSS Components/CategoryCss";
export default function Banner() {
  const classes = useStylesProductDetails()
  const classes2 = useStylesCategory()
  const [banners, setBanners] = useState([])
  const [error, setError] = useState({})
  const [status, setStatus] = useState("")
  const statusItems = ["Deal of the day", "Festive offer", "Rush Hours", "Lowest Price Ever", "Big Billion Days"]
  const [background, setBackground] = useState(false)
  //To Change State for Error Color of Button
  const [handleButton, setHandleButton] = useState(false)
  //Must for flitering the remaining images by removing it.

  const fillStatus = () => {
    return statusItems.map((i) => {
      return <MenuItem value={i}>{i}</MenuItem>
    })
  }

  const handleRemoveImage = (indexToRemove) => {
    setBanners(banners.filter(index => index !== indexToRemove));
  }
  //For showing multiple images below Upload button
  const showImage = () => {
    //Very Important for the showing multiple images stored in "banner"
    return banners?.map((item, i) => {
      return <div><div className={classes.div4}><div><Avatar className={classes.div7} src={URL.createObjectURL(item)} /></div><div onClick={() => handleRemoveImage(item)} className={classes.div8}><ClearIcon /></div></div></div>
    })
  }
  const handleChange = (event) => {
    //Change handleButton State
    setBackground(true)
    setHandleButton(false)
    //Must for showing multiple files in Avatar
    const files = Array.from(event.target.files);

    // Filter out existing images and add new ones
    const newImages = files.filter(file => !banners.find(img => img.name === file.name));
    setBanners(prevImages => [...prevImages, ...newImages]);
  }
  const validation = () => {
    var error = false
    if (banners.length == 0) {
      //setHandleButton for state change to color
      setHandleButton(true)
      handleError("Plz Choose Picture...!", "banner")
      error = true
    }
    if (status.length == 0) {
      //setHandleButton for state change to color
      setHandleButton(true)
      handleError("Plz fill status...!", "status")
      error = true
    }
    return error
  }
  /*Important const to set Error*/
  const handleError = (error, lable) => {
    setError((prev) => ({ ...prev, [lable]: error }))
  }

  const handleSubmit = async () => {
    var error = validation()
    if (error == false) {
      var formData = new FormData()
      formData.append("status", status)
      banners.map((file, index) => {
        formData.append("banners" + index, file)
      })
      var result = await postData("banner/submit_banner", formData)
      //  alert("hh"+result)
      if (result.status) {
        Swal.fire({
          position: "center",
          size: "small",
          icon: "success",
          title: result.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      }
      else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: result.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      }
    }
  }
  const handleReset = () => {
    setBackground(false)
    setBanners([])
    setStatus("")
  }

  return (
      <div className={classes2.div2}>
        <Heading link={"/dashboard/displaybanners"} image={BannnerLogo} caption="Add Banners" />
        <div className={classes2.div3}>
          {/* Important Error Handling calling~ */}
          <FormControl error={error.status} onFocus={() => handleError(null, "status")} fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Banner Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {fillStatus()}
            </Select>
          </FormControl>
          <div className={classes.div6}>{error.status}</div>
          <div className={classes2.div4}>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <UploadMultipleImages background={background ? "#fff" : ""} showImage={showImage} onChange={handleChange} color={handleButton ? "error" : "primary"} handleError={() => handleError(null, "banner")} />
                {handleButton ? <div className={classes.div6}>{error.banner}</div> : <></>}
              </Grid>
            </Grid>
          </div>
          <div className={classes2.div5}>
            <Button onClick={handleSubmit} size="small">Submit</Button>
            <Button onClick={handleReset} size="small">reset</Button>
          </div>
        </div>
      </div>
  )
}