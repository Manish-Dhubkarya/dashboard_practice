import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ClearIcon from '@mui/icons-material/Clear';
import productIcon from "../Assets/products.png"
import { TextField, Avatar, DialogTitle, DialogContent, IconButton, Grid, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { useStylesCategory } from "../CSS Components/CategoryCss";
import { useStylesDisplayCategory } from '../CSS Components/DisplayCategoryCss';
import MaterialTable from "@material-table/core"
import { useEffect, useState } from "react"
import { getData, postData, serverURL } from "../Services/FetchNodeServices"
import { useLocation, useNavigate } from "react-router-dom"
import { useStylesDisplayBrands } from '../CSS Components/DisplayBrandCss';
import { useStyleDisplayProduct } from '../CSS Components/DisplayProductCss';
export default function DisplayAllProducts(){
    var location=useLocation()
    const {email, name, picture}=location.state
    const navigate = useNavigate()
    const [productList, setProductList]=useState([])
    const [product, setProduct]=useState("")
    //id use only for delete and update data i.e.,productId
    const [productId, setProductId]=useState("")
    const [brand, setBrand] = useState([])
    const [category, setCategory] = useState([])
    const classes = useStylesCategory()
    const classes2 = useStylesDisplayCategory()
    const classes4=useStyleDisplayProduct()
    const classes3 = useStylesDisplayBrands()
    //temporary const to store rowData's categoryname for check
    const [TemCategory, setTempCategory] = useState("")
    const [TemBrand, setTempBrand] = useState("")
    const [temProduct, setTempProduct]=useState("")
    const [TemStatus, setTempStatus] = useState("")
    const [status, setStatus] = useState("")
    const [brandId, setBrandId] = useState("")
    const [catId, setCatId] = useState("")
    const [image, setImage] = useState({ bytes: "", filename: "" })
    const [error, setError] = useState({})
    const StatusItems=["Trending", "Popular", "Bestseller", "Continue", "Discontinue"]
    //image save & cancle button hide or show
    const [handleButton, setHandleButton] = useState(false)
    const [cameraShow, setCameraShow] = useState(false)
    const [BtnStatus, setBtnStatus] = useState(false)
    const [tempImage, setTempImage] = useState("")
    const [open, setOpen] = useState(false);
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
    const fillAllBrands = () => {
        return brand.map((i) => {
            //category have the database category set using setBrands on fetchAllBrands()
            return <MenuItem value={i.brandid}>{i.brandname}</MenuItem>
        })
    }
    const fillStatus=()=>{
        return StatusItems.map((i)=>{
            return <MenuItem value={i}>{i}</MenuItem>
        })
    }
    const handleCategoryChange=(e)=>{
        setCatId(e.target.value)
        //must set value of category here to fetchAllBrands on change category 
        fetchAllBrands(e.target.value)
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
        if (brandId.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill brand...!", "brandname")
            error = true
        }
        if (status.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill status...!", "status")
            error = true
        }
        if (product.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill product...!", "productname")
            error = true
        }

        //For giving alert to make changes across fields
        if (TemBrand == brandId && temProduct==product && TemStatus == status && TemCategory == catId) {
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
            formData.append("productid", productId)
            formData.append("picture", image.bytes)
            var result = await postData("product/update_picture", formData)
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
        fetchAllProducts()
    }
    const handleEditProducts = async () => {
        //for store current value of categortname to check current changes of const
        var error = validation()
        if (error == false) {
            //must set inside condition for set temprory value after error comes
            setTempCategory(catId)
            setTempBrand(brandId)
            setTempStatus(status)
            setTempProduct(product)
            var body = { categoryid: catId, brandid: brandId, productname:product, status: status, productid:productId }
            var result = await postData("product/update_product", body)
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

        fetchAllProducts()
    }

    /*Important const to set Error*/
    const handleError = (error, lable) => {
        setError((prev) => ({ ...prev, [lable]: error }))
    }

    const fetchAllProducts = async () => {
        var result = await getData("product/display_all_products")
        setProductList(result.data)
    }
    //To fetch data from node server and then to database!
    const fetchAllBrands = async (cid) => {
        var result = await postData("brand/display_all_brands_by_categoryid", {categoryid:cid})
        setBrand(result.data)
    }
    useEffect(function () {
        fetchAllProducts()
        fetchAllBrands()
    }, [])
    //
//consts for handle dialog
    const handleClose = () => {
        //**very very important to remove error msg from any textfield after close dialog.
        handleError("", "categoryname")
        handleError("", "productname")
        handleError("", "brandname")
        handleError("", "status")
        setOpen(false);
    };
    /*all data of database come in the form of rowData & get by category const used inside
        material table {data}
    */
    const UpdateProduct = (rowData) => {
        setOpen(true)
//Must for fill Dropdown on immidiately fill fields
        fetchAllBrands(rowData.categoryid)
        setTempCategory(rowData.categoryid)
        setTempBrand(rowData.brandid)
        setTempStatus(rowData.status)
        setCatId(rowData.categoryid)
        setStatus(rowData.status)
        setBrandId(rowData.brandid)
        setProduct(rowData.productname)
        setTempProduct(rowData.productname)
        setProductId(rowData.productid)
        //for temporary store image and further use as filename in real image const
        setTempImage(`${serverURL}/images/${rowData.picture}`)
        setImage({ filename: `${serverURL}/images/${rowData.picture}` })
    }
    //Most important const with confirmation for delete product.
    const DeleteProduct = (rowData) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete product!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                var result = await postData("product/delete_product", { productid: rowData.productid })
                if (result.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: result.message,
                        icon: "success"
                    });
                    fetchAllProducts()
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
                                    <img width={40} src={productIcon} />
                                    <div className={classes2.div3}>Update Product</div></div>
                                <IconButton onClick={handleClose}><ClearIcon color='error' /></IconButton>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className={classes.div3}>
                                <Grid item xs={12} container spacing={2}>
                                    <Grid item xs={6}>
                                {/* Important Error Handling calling~ */}
                                <FormControl error={error.categoryname} onFocus={() => handleError(null, "categoryname")} fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={catId}
                                        label="Category"
                                        onChange={handleCategoryChange}
                                    >
                                        {fillAllCategory()}
                                    </Select>
                                </FormControl>
                                <div className={classes.div6}>{error.categoryname}</div>
                                </Grid>
                                
                                <Grid item xs={6}>
                                <FormControl error={error.brandname} onFocus={() => handleError(null, "brandname")} fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Brand</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={brandId}
                                        label="Brand"
                                        onChange={(e)=>setBrandId(e.target.value)}
                                    >
                                        {fillAllBrands()}
                                    </Select>
                                </FormControl>
                                <div className={classes.div6}>{error.brandname}</div>
                                </Grid>
                                </Grid>
                                
                                <Grid className={classes3.div} item xs={12} container spacing={2}>
                                    <Grid item xs={6}>
                                    <TextField onChange={(e)=>setProduct(e.target.value)} onFocus={()=>handleError(null, "productname")} value={product} label="Product" size='small' helperText={error.productname} error={error.productname}></TextField>
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
                                        <div className={classes.div6}>{error.status}</div>
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
                            <Button onClick={handleEditProducts}>Edit product</Button>
                            <Button onClick={handleClose}>Cancle</Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }
    return (
            <div className={classes4.div1}>
                <MaterialTable
                    title={
                        <div className={classes2.div7}>
                            <img width={30} src={productIcon} />
                            <div className={classes2.div8}> Product List</div>
                        </div>
                    }
                    options={{
                        paging: true,
                        pageSize: 4,       // make initial page size
                        emptyRowsWhenPaging: false,   // To avoid of having empty rows
                        pageSizeOptions: [2, 4, 5, 12, 20, 50]
                    }}
                    columns={[
                        //field as per database
                        {
                            title: 'Category',
                            render: (rowData) => <div>{rowData.categoryid}/{rowData.categoryname}</div>
                        },
                        {
                            title: 'Brand',
                            render: (rowData) => <div>{rowData.brandid}/{rowData.brandname}</div>
                        },
                        {
                            title: 'Product',
                            render: (rowData) => <div>{rowData.productid}/{rowData.productname}</div>
                        },
                        {
                            title: "Status",
                            field: "status"
                        },
                        //For Image Show in render
                        { title: 'Logo', render: (rowData) => <img width={50} src={`${serverURL}/images/${rowData.picture}`} /> }
                    ]}
                    data={productList}
                    //actions
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Update Product',
                            //call function for show popup;
                            onClick: (e, rowData) => { UpdateProduct(rowData) }
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete Product',
                            onClick: (e, rowData) => { DeleteProduct(rowData) }
                        },
                        {
                            icon: 'add',
                            tooltip: 'Add Product',
                            isFreeAction: true,
                            onClick: () => navigate("/dashboard/products", {state:{email:email, name:name, picture:picture}})
                        }
                    ]}
                />
                {open ? ShowDialog() : <></>}
            </div>
    )
}