import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ClearIcon from '@mui/icons-material/Clear';
import brandIcon from "../Assets/brands.png"
import { TextField, Avatar, DialogTitle, DialogContent, IconButton, Grid, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { useStylesCategory } from "../CSS Components/CategoryCss";
import { useStylesDisplayCategory } from '../CSS Components/DisplayCategoryCss';
import MaterialTable from "@material-table/core"
import { useEffect, useState } from "react"
import { getData, postData, serverURL } from "../Services/FetchNodeServices"
import { useLocation, useNavigate } from "react-router-dom"
import { useStylesDisplayBrands } from '../CSS Components/DisplayBrandCss';
export default function () {
    var location=useLocation()
    const {email, name, picture}=location.state
    const navigate = useNavigate()
    const [brand, setBrand] = useState([])
    const [category, setCategory] = useState([])
    const classes = useStylesCategory()
    const classes2 = useStylesDisplayCategory()
    const classes3 = useStylesDisplayBrands()
    //temporary const to store rowData's categoryname for check
    const [TemCategory, setTempCategory] = useState("")
    const [TemBrand, setTempBrand] = useState("")
    const [TemStatus, setTempStatus] = useState("")
    const [status, setStatus] = useState("")
    const [brandId, setBrandId] = useState("")
    const [brandName, setBrandname] = useState("")
    const [catId, setCatId] = useState("")
    const [image, setImage] = useState({ bytes: "", filename: "" })
    const [error, setError] = useState({})
    const StatusItems=["Trending", "Popular", "Bestseller", "Continue", "Discontinue"] 
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

    const fetchAllCategory = async () => {
        var result = await getData("category/display_all_category")
        setCategory(result.data)
    }
    const fillAllCategory = () => {
        return category.map((i) => {
            //category have the database category set using setCategory on fetchAllcategory()
            return <MenuItem value={i.categoryid}>{i.categoryname}</MenuItem>
        })
    }
    const fillStatus=()=>{
        return StatusItems.map((i)=>{
            return <MenuItem value={i}>{i}</MenuItem>
        })
    }
    useEffect(function () {
        fetchAllCategory()
    }, [])
    //const for fields match or not
    const validation = () => {
        var error = false
        if (catId.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill category...!", "categoryname")
            error = true
        }
        if (brandName.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill brand...!", "brandname")
            error = true
        }
        if (status.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill status...!", "status")
            error = true
        }

        //For giving alert to make changes across fields
        if (TemBrand == brandName && TemStatus == status && TemCategory == catId) {
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
            handleError("Plz Choose Logo...!", "logo")
            error = true
        }
        return error
    }
    const handleSaveImage = async () => {
        setBtnStatus(false)
        var error = validation2()
        if (error == false) {
            var formData = new FormData()
            formData.append("brandid", brandId)
            formData.append("logo", image.bytes)
            var result = await postData("brand/update_logo", formData)
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
        fetchAllBrands()
    }
    const handleEditBrands = async () => {
        //for store current value of categortname to check current changes of const
        var error = validation()
        if (error == false) {
            //must set inside condition for set temprory value after error comes
            setTempCategory(catId)
            setTempBrand(brandName)
            setTempStatus(status)
            var body = { categoryid: catId, brandname: brandName, status: status, brandid: brandId }
            var result = await postData("brand/update_brand", body)
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

        fetchAllBrands()
    }

    /*Important const to set Error*/
    const handleError = (error, lable) => {
        setError((prev) => ({ ...prev, [lable]: error }))
    }

    //To fetch data from node server and then to database!
    const fetchAllBrands = async () => {
        var result = await getData("brand/display_all_brands")
        setBrand(result.data)
    }
    useEffect(function () {
        fetchAllBrands()
    }, [])
    //

    const [open, setOpen] = useState(false);
    //consts for handle dialog
    const handleClose = () => {
        //**very very important to remove error msg from any textfield after close dialog.
        handleError("", "categoryname")
        handleError("", "brandname")
        handleError("", "status")
        setOpen(false);
    };
    /*all data of database come in the form of rowData & get by category const used inside
        material table {data}
    */
    const UpdateBrand = (rowData) => {

        setOpen(true)
        setTempCategory(rowData.categoryid)
        setBrandname(rowData.brandname)
        setTempBrand(rowData.brandname)
        setStatus(rowData.status)
        setTempStatus(rowData.status)
        setCatId(rowData.categoryid)
        setBrandId(rowData.brandid)

        //for temporary store image and further use as filename in real image const
        setTempImage(`${serverURL}/images/${rowData.logo}`)
        setImage({ filename: `${serverURL}/images/${rowData.logo}` })
    }
    //Most important const with confirmation for delete category.
    const DeleteBrand = (rowData) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete brand!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                var result = await postData("brand/delete_brand", { brandid: rowData.brandid })
                if (result.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: result.message,
                        icon: "success"
                    });
                    fetchAllBrands()
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
    //Show popup dialog box for update brand
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
                                    <img width={40} src={brandIcon} />
                                    <div className={classes2.div3}>Update Brand</div></div>
                                <IconButton onClick={handleClose}><ClearIcon color='error' /></IconButton>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className={classes.div3}>
                                {/* Important Error Handling calling~ */}
                                <FormControl error={error.categoryname} onFocus={() => handleError(null, "categoryname")} fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={catId}
                                        label="Category"
                                        onChange={(e) => setCatId(e.target.value)}
                                    >
                                        {fillAllCategory()}
                                    </Select>
                                </FormControl>
                                <div className={classes.div6}>{error.categoryname}</div>
                                <Grid className={classes3.div} item xs={12} container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField value={brandName} error={error.brandname} onFocus={() => handleError(null, "brandname")} helperText={error.brandname} onChange={(e) => setBrandname(e.target.value)} fullWidth label="Brand" size="small" placeholder="Brand" title="Brand" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl error={error.status} onFocus={() => handleError(null, "status")} fullWidth size="small">
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
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
                                    </Grid>
                                </Grid>
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
                            <Button onClick={handleEditBrands}>Edit brand</Button>
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
                            <img width={30} src={brandIcon} />
                            <div className={classes2.div8}> Brands List</div>
                        </div>
                    }
                    columns={[
                        //field as per database
                        {
                            title: 'Category',
                            render: (rowData) => <div>{rowData.categoryid}/{rowData.categoryname}</div>
                        },
                        {
                            title: 'Brands',
                            render: (rowData) => <div>{rowData.brandid}/{rowData.brandname}</div>
                        },
                        {
                            title: "Status",
                            field: "status"
                        },
                        //For Image Show in render
                        { title: 'Logo', render: (rowData) => <img width={50} src={`${serverURL}/images/${rowData.logo}`} /> }
                    ]}
                    data={brand}
                    //actions
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Update Brand',
                            //call function for show popup;
                            onClick: (e, rowData) => { UpdateBrand(rowData) }
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete Brand',
                            onClick: (e, rowData) => { DeleteBrand(rowData) }
                        },
                        {
                            icon: 'add',
                            tooltip: 'Add Brand',
                            isFreeAction: true,
                            onClick: () => navigate("/dashboard/brands", {state:{email:email, name:name, picture:picture}})
                        }
                    ]}
                />
                {open ? ShowDialog() : <></>}
            </div>
    )
}