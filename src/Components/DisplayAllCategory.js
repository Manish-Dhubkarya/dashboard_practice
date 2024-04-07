import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ClearIcon from '@mui/icons-material/Clear';
import categoryIcon from "../Assets/category.png"
import { TextField, Avatar, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useStylesCategory } from "../CSS Components/CategoryCss";
import { useStylesDisplayCategory } from '../CSS Components/DisplayCategoryCss';
import MaterialTable from "@material-table/core"
import { useEffect, useState } from "react"
import { getData, postData, serverURL } from "../Services/FetchNodeServices"
import { useLocation, useNavigate } from "react-router-dom"
export default function DisplayAllCategory() {
  const navigate = useNavigate()
  var location=useLocation()
  const {name, email, picture}=location.state
  const [category, setCategory] = useState([])
  const classes = useStylesCategory()
  const classes2 = useStylesDisplayCategory()
  const [catName, setCatName] = useState("")
  //temporary const to store rowData's categoryname for check
  const [TemCategory, setTempCategory] = useState("")
  const [catId, setCatId] = useState("")
  const [image, setImage] = useState({ bytes: "", filename: "" })
  const [error, setError] = useState({})
  //image save & cancle button hide or show
  const [handleButton, setHandleButton] = useState(false)
  const [cameraShow, setCameraShow] = useState(false)
  const [BtnStatus, setBtnStatus] = useState(false)
  const [tempImage, setTempImage] = useState("")
  const handleChange = (event) => {
    //Change handleButton State
    setHandleButton(false)
    setBtnStatus(true)
    setImage({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
  }
  const handleImageCancle = () => {
    setBtnStatus(false)
    //image filename set and get by temporary store const
    setImage({ filename: tempImage, bytes: "" })
  }

  //const for fields match or not
  const validation = () => {
    var error = false
    if (catName.length == 0) {
      /*Pass Parameter to handleError(error, lable) */
      handleError("Plz fill category...!", "categoryname")
      error = true
    }
    if (TemCategory == catName) {
      Swal.fire({
        customClass: {
          container: 'swal-container'
        },
        toast: true,
        title: "You didn't change anything.",
        icon: "info"
      });
      error = true
    }
    return error
  }
  //const for check image validation
  const validation2 = () => {
    var error = false
    if (image.filename.length == 0) {
      //setHandleButton for state change to color
      setHandleButton(true)
      handleError("Plz Choose Picture...!", "image")
      error = true
    }
    return error
  }
  const handleSaveImage = async () => {
    setBtnStatus(false)
    var error = validation2()
    if (error == false) {
      var formData = new FormData()
      formData.append("categoryid", catId)
      formData.append("picture", image.bytes)
      var result = await postData("category/update_picture", formData)
      if (result.status) {
        Swal.fire({
          /*very important class to pop-up sweetalert over dialog
            and make sure to put inside index.html
            <style type="text/css">
             .swal-container {
              z-index: 10000;
            };
          */
          customClass: {
            container: 'swal-container'
          },
          position: "center",
          icon: "success",
          title: result.message,
          showConfirmButton: true,
          timer: 1500,
          toast: true
        });
      }
      else {
        Swal.fire({
          //very important class to pop-up sweetalert over dialog
          customClass: {
            container: 'swal-container'
          },
          position: "center",
          icon: "error",
          title: result.message,
          showConfirmButton: true,
          timer: 1500,
          toast: true
        });
      }
    }
    fetchAllCategory()
  }
  const handleEditCategory = async () => {
    //for store current value of categortname to check current changes of const
    var error = validation()
    if (error == false) {
      //must set inside condition for set temprory value after error comes
      setTempCategory(catName)
      var body = { categoryid: catId, categoryname: catName }
      var result = await postData("category/update_category", body)
      if (result.status) {
        Swal.fire({
          //very important class to pop-up sweetalert over dialog
          customClass: {
            container: 'swal-container'
          },
          position: "center",
          icon: "success",
          title: result.message,
          showConfirmButton: true,
          timer: 1500,
          toast: true
        });
      }
      else {
        Swal.fire({
          //very important class to pop-up sweetalert over dialog
          customClass: {
            container: 'swal-container'
          },
          position: "center",
          icon: "error",
          title: result.message,
          showConfirmButton: true,
          timer: 1500,
          toast: true
        });
      }
    }

    fetchAllCategory()
  }

  /*Important const to set Error*/
  const handleError = (error, lable) => {
    setError((prev) => ({ ...prev, [lable]: error }))
  }

  //To fetch data from node server and then to database!
  const fetchAllCategory = async () => {
    var result = await getData("category/display_all_category")
    setCategory(result.data)
  }
  useEffect(function () {
    fetchAllCategory()
  }, [])
  //

  const [open, setOpen] = useState(false);
  //consts for handle dialog
  const handleClose = () => {
    //**very very important to remove error msg from any textfield.
    handleError("", "categoryname")
    setOpen(false);
  };
  /*all data of database come in the form of rowData & get by category const used inside
      material table {data}
  */
  const UpdateCategory = (rowData) => {
    setOpen(true)
    setTempCategory(rowData.categoryname)
    setCatId(rowData.categoryid)
    setCatName(rowData.categoryname)
    //for temporary store image and further use as filename in real image const
    setTempImage(`${serverURL}/images/${rowData.picture}`)
    setImage({ filename: `${serverURL}/images/${rowData.picture}` })
  }
  //Most important const with confirmation for delete category.
  const DeleteCategory = (rowData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        var result = await postData("category/delete_category", { categoryid: rowData.categoryid })
        if (result.status) {
          Swal.fire({
            title: "Deleted!",
            text: result.message,
            icon: "success"
          });
          fetchAllCategory()
        }
        else {
          Swal.fire({
            title: "Fail!",
            text: result.message,
            icon: "fail"
          });
        }
      }
    });



  }
  //image update buttons
  function SaveCancleBtn() {
    return (
      <div>
        <Button onClick={handleSaveImage}>Save</Button>
        <Button onClick={handleImageCancle}>cancle</Button>
      </div>)

  }
  //Show popup dialog box for update category
  function ShowDialog() {
    return (
      <React.Fragment>
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className={classes2.div1}>
            <DialogTitle>
              <div className={classes2.div2}>
                <div>
                  <img width={40} src={categoryIcon} />
                  <div className={classes2.div3}>Update Category</div></div>
                <IconButton onClick={handleClose}><ClearIcon color='error' /></IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className={classes.div3}>
                {/* Important Error Handling calling~ */}
                <TextField value={catName} error={error.categoryname} onFocus={() => handleError(null, "categoryname")} helperText={error.categoryname} onChange={(e) => setCatName(e.target.value)} fullWidth label="Category" size="small" placeholder="Category" title="Category" />
                <div className={classes.div4}>
                  <div className={classes2.div4}>
                    {/* Important Error Handling calling for Image~ */}
                    {BtnStatus ? <SaveCancleBtn /> : <></>}
                    <Button onMouseEnter={() => setCameraShow(true)} onMouseLeave={() => setCameraShow(false)} className={classes2.button1} size="large" color={handleButton ? "error" : "primary"} variant="outlined" onFocus={() => handleError(null, "image")} component="label">

                      {cameraShow ? <AddAPhotoIcon className={classes2.icon} /> : <></>}
                      <input onChange={handleChange} hidden type="file" accept="images/*" multiple />
                      <Avatar src={image.filename} alt="category" variant="circle" />
                    </Button>

                    <div className={classes.div6}>{error.image}</div>
                  </div>


                </div></div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditCategory}>Edit category</Button>
              <Button onClick={handleClose}>Cancle</Button>
            </DialogActions>

          </div>

        </Dialog>
      </React.Fragment>
    );
  }
  return (

      <div className={classes2.div6}>
        <MaterialTable
          title={
            <div className={classes2.div7}>

              <img width={30} src={categoryIcon} />
              <div className={classes2.div8}> Category List</div>

            </div>
          }
          columns={[
            //field as per database
            { title: 'Category Id', field: 'categoryid' },
            { title: 'Category', field: 'categoryname' },
            //For Image Show in render
            { title: 'Picture', render: (rowData) => <img width={50} src={`${serverURL}/images/${rowData.picture}`} /> }

          ]}
          data={category}
          //actions
          actions={[
            {
              icon: 'edit',
              tooltip: 'Update Category',
              //call function for show popup;
              onClick: (e, rowData) => { UpdateCategory(rowData) }
            },
            {
              icon: 'delete',
              tooltip: 'Delete Category',
              onClick: (e, rowData) => { DeleteCategory(rowData) }
            },
            {
              icon: 'add',
              tooltip: 'Add Category',
              isFreeAction: true,
              onClick: () => navigate("/dashboard/category", {state:{email:email, name:name, picture:picture}})
            }
          ]}
        />
        {open ? ShowDialog() : <></>}
      </div>
  )
}