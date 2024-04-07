import Swal from "sweetalert2";
import { Avatar, Button, TextField } from "@mui/material";
import Heading from "./Heading";
import categoryIcon from "../Assets/category.png"
import { useState } from "react";
import { getData, postData } from "../Services/FetchNodeServices";
import { useStylesCategory } from "../CSS Components/CategoryCss";
import { FetchToken } from "../Services/FetchToken";
export default function Category() {
  const classes = useStylesCategory()
  const [catName, setCatName] = useState("")
  const [image, setImage] = useState({ bytes: "", filename:"" })
  const [error, setError] = useState({})

  //To Change State for Error Color of Button
  const [handleButton, setHandleButton] = useState(false)
  const handleChange = (event) => {
    //Change handleButton State
    setHandleButton(false)
    setImage({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
  }
  const validation = () => {
    var error = false
    if (catName.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("Plz fill category...!", "categoryname")
      error = true
    }
    if (image.filename.length == 0) {
      //setHandleButton for state change to color
      setHandleButton(true)
      handleError("Plz Choose Picture...!", "image")
      error = true
    }
    return error
  }
  /*Important const to set Error*/
  const handleError = (error, lable) => {
    setError((prev) => ({ ...prev, [lable]: error }))
  }
  const handleSubmit = async () => {
    const TokenAvailable= await FetchToken()
    var error = validation()
    if (error == false) {
      var formData = new FormData()
      formData.append("categoryname", catName)
      formData.append("picture", image.bytes)
      const token = localStorage.getItem('token');
      alert("Token:"+token)
      if(TokenAvailable)
      {
        alert("Token State"+TokenAvailable)
      var result = await postData("category/submit_category", formData)
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
    else{
      alert("Pagal hai kya bina token ke ghus raha hai, kuch bhi...!")
    }
    }

  }
  const handleReset = () => {
    setCatName("")
    setImage({ bytes: "", filename: "" })
  }

  return (
    

      <div className={classes.div2}>
        <Heading link={"/dashboard/displaycategory"} image={categoryIcon} caption="Add Category" />
        <div className={classes.div3}>
          {/* Important Error Handling calling~ */}
          <TextField value={catName} error={error.categoryname} onFocus={() => handleError(null, "categoryname")} helperText={error.categoryname} onChange={(e) => setCatName(e.target.value)} fullWidth label="Category" size="small" placeholder="Category" title="Category" />
          <div className={classes.div4}>
            <div>
              {/* Important Error Handling calling for Image~ */}
              <Button color={handleButton ? "error" : "primary"} variant="outlined" onFocus={() => handleError(null, "image")} component="label" size="small">
                <input onChange={handleChange} hidden type="file" accept="images/*" multiple />
                Category Image
              </Button>
              <div className={classes.div6}>{error.image}</div>
            </div>
            <Avatar src={image.filename} alt="category" variant="circle" />

          </div>
          <div className={classes.div5}>
            <Button onClick={handleSubmit} size="small">Submit</Button>
            <Button onClick={handleReset} size="small">reset</Button>
          </div>
        </div>
      </div>
  )
}