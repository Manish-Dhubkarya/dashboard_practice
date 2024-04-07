import * as React from 'react';
import Button from '@mui/material/Button';
import ReactQuill from 'react-quill';
import Dialog from '@mui/material/Dialog';
import Swal from 'sweetalert2';
import UploadMultipleImages from './UploadMultipleImagesComponent';
import { useStylesProductDetails } from '../CSS Components/ProductDetailsCss';
import DialogActions from '@mui/material/DialogActions';
import ClearIcon from '@mui/icons-material/Clear';
import productDetailsIcon from "../Assets/productdetails.png"
import { TextField, Avatar, DialogTitle, DialogContent, IconButton, Grid, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { useStylesCategory } from "../CSS Components/CategoryCss";
import MaterialTable from "@material-table/core"
import { useEffect, useState, useMemo } from "react"
import { getData, postData, serverURL } from "../Services/FetchNodeServices"
import { useLocation, useNavigate } from "react-router-dom"
import { useStylesDisplayBrands } from '../CSS Components/DisplayBrandCss';
import { useStyleDisplayProduct } from '../CSS Components/DisplayProductCss';
import { useStylesProductDetailsDisplay } from '../CSS Components/ProductDetailsDisplayCss';
export default function DisplayAllProductDetails() {
    var location=useLocation()
    const {email, name, picture}=location.state
    // CSS classes
    const classes = useStylesCategory()
    const classes5 = useStylesProductDetails()
    const classes2 = useStylesProductDetailsDisplay()
    const classes4 = useStyleDisplayProduct()
    const classes3 = useStylesDisplayBrands()

    const navigate = useNavigate()

    //fetch data from server and put it in array
    const [brand, setBrand] = useState([])
    const [category, setCategory] = useState([])
    const [image, setImage] = useState([])
    const [recentImages, setRecentImage] = useState([])
    const combinedImages = [...image, ...recentImages];
    // const images=[image+recentImages]
    const [productDetailsList, setProductDetailsList] = useState([])
    const [product, setProduct] = useState([])

    // related fileds to product details
    const [modelNo, setModelNo] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("")
    const [price, setPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [hsnCode, setHsnCode] = useState("")
    const [stock, setStock] = useState("")
    const [status, setStatus] = useState("")
    const [brandId, setBrandId] = useState("")
    const [catId, setCatId] = useState("")
    const [productDetailId, setProductDetailid] = useState("")
    //id use only for delete and update data i.e.,productId
    const [productId, setProductId] = useState("")

    //temporary const to store rowData's categoryname for check
    const [TemCategory, setTempCategory] = useState("")
    const [TemBrand, setTempBrand] = useState("")
    const [temProduct, setTempProduct] = useState("")
    const [TemStatus, setTempStatus] = useState("")
    const [tempModelNo, setTempModelNo] = useState("")
    const [tempDescription, setTempDescription] = useState("")
    const [tempColor, setTempColor] = useState("")
    const [tempPrice, setTempPrice] = useState("")
    const [tempOfferPrice, setTempOfferPrice] = useState("")
    const [tempHsnCode, setTempHsnCode] = useState("")
    const [TempStock, setTempStock] = useState("")
    // extra filelds related to different works
    const [background, setBackground] = useState(false)
    const [error, setError] = useState({})
    const StatusItems = ["Trending", "Popular", "Bestseller", "Continue", "Discontinue"]
    //image save & cancle button hide or show
    const [handleButton, setHandleButton] = useState(false)
    const [open, setOpen] = useState(false);
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', "strike"],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['image', "link", 'video'],
                [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
            ],

        },
    }), [])
    const handleQuill = (newValue) => {
        setDescription(newValue)
        if (newValue.trim() !== '') {
            handleError('', 'description');
        }
    }

    //Change the images that set recently
    const handleChange = (event) => {
        //Change handleButton State
        setBackground(true)
        setHandleButton(false)
        //Must for showing multiple files in Avatar
        const files = Array.from(event.target.files);

        // Filter out files that are not already present in image state
        const newImages = files.filter(file => !image.split(",").find(imgName => imgName === file.name));
        setRecentImage(prevImages => [...prevImages, ...newImages]);
    }

    //To show the images that was uploaded 
    const showImage = () => {
        //Very Important for the showing multiple images stored in "image"
        const serverUploadedImages = image?.split(",") || [];
        const serverImagesJSX = serverUploadedImages.map((item, i) => (
            <div key={i}>
                <div className={classes5.div4}>
                    <div>
                        <Avatar className={classes5.div7} src={`${serverURL}/images/${item}`} />
                    </div>
                    <div onClick={() => handleRemoveImage(item)} className={classes5.div8}>
                        <ClearIcon />
                    </div>
                </div>
            </div>
        ));
        // Render recently uploaded images as files
        const recentlyUploadedImagesJSX = recentImages.map((file, i) => (
            <div key={i}>
                <div className={classes5.div4}>
                    <div>
                        <Avatar className={classes5.div7} src={URL.createObjectURL(file)} />
                    </div>
                    <div onClick={() => handleRemoveRecentlyUploaded(file)} className={classes5.div8}>
                        <ClearIcon />
                    </div>
                </div>
            </div>
        ));

        // Combine both sets of images
        return [...serverImagesJSX, ...recentlyUploadedImagesJSX];

    }

    // To filter out the removed images from uploaded and join the remaining images
    const handleRemoveImage = (indexToRemove) => {
        // Split the image string into an array of image paths
        const imageArray = image.split(",");
        // Filter the image array based on the indexToRemove
        const filteredImages = imageArray.filter(index => index !== indexToRemove);
        // Join the filtered image paths back into a string
        setImage(filteredImages.join(","));
    }

    //Remove images from recently uploaded images
    const handleRemoveRecentlyUploaded = (indexToRemove) => {
        setRecentImage(recentImages.filter(index => index !== indexToRemove));
    }

    //for showing the images on Material Table 
    const handleShowImages = (rowData) => {
        return rowData.pictures.split(",").map((item) => {
            return <img className={classes2.div4} width={20} src={`${serverURL}/images/${item}`} />
        })
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

    const fillAllProducts = () => {
        return product.map((i) => {
            //category have the database category set using setBrands on fetchAllBrands()
            return <MenuItem value={i.productid}>{i.productname}</MenuItem>
        })
    }
    const fillStatus = () => {
        return StatusItems.map((i) => {
            return <MenuItem value={i}>{i}</MenuItem>
        })
    }
    const handleCategoryChange = (e) => {
        setCatId(e.target.value)
        //must set value of category here to fetchAllBrands on change category 
        fetchAllBrands(e.target.value)
    }
    const handleBrandChange = (e) => {
        setBrandId(e.target.value)
        /*Very Must to passing the catId, .value to fetch products in accordance
        to passed parameters in fetchAllProductList()*/
        fetchAllProductList(catId, e.target.value)
    }
    useEffect(function () {
        fetchAllCategory()
        fetchAllProductDetails()
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
        if (productId.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill product...!", "productname")
            error = true
        }
        if (modelNo.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill modelno...!", "modelno")
            error = true
        }
        if (description.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill description...!", "description")
            error = true
        }
        if (hsnCode.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill HSN code...!", "hsncode")
            error = true
        }
        if (price.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill price...!", "price")
            error = true
        }
        if (offerPrice.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill offerprice...!", "offerprice")
            error = true
        }
        if (stock.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill stock...!", "stock")
            error = true
        }
        if (color.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill color...!", "color")
            error = true
        }

        //For giving alert to make changes across fields
        if (TemBrand == brandId && temProduct == productId && TemStatus == status && TemCategory == catId && tempColor == color && tempModelNo == modelNo && tempDescription == description && tempHsnCode == hsnCode && tempPrice == price && tempOfferPrice == offerPrice && TempStock == stock) {
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
    const handleEditProductDetails = async () => {
        //for store current value of categortname to check current changes of const
        var error = validation()
        if (error == false) {
            //must set inside condition for set temprory value after error comes
            setTempCategory(catId)
            setTempModelNo(modelNo)
            setTempDescription(description)
            setTempPrice(price)
            setTempOfferPrice(offerPrice)
            setTempHsnCode(hsnCode)
            setTempStock(stock)
            setTempBrand(brandId)
            setTempStatus(status)
            setTempProduct(productId)
            setTempColor(color)

            var formData = new FormData()
            formData.append("categoryid", catId)
            formData.append("brandid", brandId)
            formData.append("productid", productId)
            formData.append("modelno", modelNo)
            formData.append("hsncode", hsnCode)
            formData.append("description", description)
            formData.append("color", color)
            formData.append("price", price)
            formData.append("offerprice", offerPrice)
            formData.append("status", status)
            formData.append("stock", stock)
            formData.append("productdetailid", productDetailId)

            // ! must for the submission of images
            combinedImages.map((file, index) => {
                formData.append('pictures' + index, file)
            })
            Swal.fire({
                customClass: {
                    container: 'swal-container'
                },
                title: "Are you sure?",
                text: "You want to update product details!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    var result = await postData("productdetails/update_productdetails", formData)
                    if (result.status) {
                        Swal.fire({
                            customClass: {
                                container: 'swal-container'
                            },
                            title: "Update!",
                            text: result.message,
                            icon: "success"
                        });
                        fetchAllProductDetails()
                    }
                    else {
                        Swal.fire({
                            customClass: {
                                container: 'swal-container'
                            },
                            title: "Fail!",
                            text: result.message,
                            icon: "fail"
                        })
                    }

                }
                else {
                    Swal.fire({
                        customClass: {
                            container: 'swal-container'
                        },
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
            })
        }

    }

    /*Important const to set Error*/
    const handleError = (error, lable) => {
        setError((prev) => ({ ...prev, [lable]: error }))
    }

    //To fetch data from node server and then to database!
    const fetchAllBrands = async (cid) => {
        var result = await postData("brand/display_all_brands_by_categoryid", { categoryid: cid })
        setBrand(result.data)
    }
    const fetchAllProducts = async () => {
        var result = await getData("product/display_all_products");
        setProduct(result.data);
    };
    const fetchAllProductDetails = async () => {
        var result = await getData("productdetails/display_all_productdetails")
        setProductDetailsList(result.data)
    }
    const fetchAllProductList = async (cid, bid) => {
        var body = { categoryid: cid, brandid: bid };
        var result = await postData("product/display_all_products_by_brandid", body)
        setProduct(result.data)
    }
    useEffect(function () {
        fetchAllProducts()
    }, [])
    //
    //consts for handle dialog
    const handleClose = () => {
        //**very very important to remove error msg from any textfield after close dialog.       
        handleError("", "categoryname")
        handleError("", "productname")
        handleError("", "brandname")
        handleError("", "status")
        handleError("", "modelno")
        handleError("", "description")
        handleError("", "hsncode")
        handleError("", "price")
        handleError("", "color")
        handleError("", "offerprice")
        handleError("", "stock")
        setOpen(false);
    };
    /*all data of database come in the form of rowData & get by category const used inside
        material table {data}
    */
    const UpdateProductDetails = (rowData) => {
        setOpen(true)
        //Must for fill Dropdown on immidiately fill fields
        fetchAllBrands(rowData.categoryid)
        fetchAllProductList(rowData.categoryid, rowData.brandid)
        //se temporary values
        setTempCategory(rowData.categoryid)
        setTempBrand(rowData.brandid)
        setTempStatus(rowData.status)
        setTempProduct(rowData.productid)
        setTempModelNo(rowData.productid)
        setTempDescription(rowData.description)
        setTempPrice(rowData.price)
        setTempOfferPrice(rowData.offerprice)
        setTempHsnCode(rowData.hsncode)
        setTempStock(rowData.stock)
        setTempBrand(rowData.brand)
        setTempStatus(rowData.status)
        setTempColor(rowData.color)

        //set real state values to fatch from database
        setCatId(rowData.categoryid)
        setStatus(rowData.status)
        setBrandId(rowData.brandid)
        setProductDetailid(rowData.productdetailid)
        setModelNo(rowData.modelno)
        setDescription(rowData.description)
        setPrice(rowData.price)
        setOfferPrice(rowData.offerprice)
        setStock(rowData.stock)
        setColor(rowData.color)
        setHsnCode(rowData.hsncode)
        setProductId(rowData.productid)
        setImage(rowData.pictures)

        //for temporary store image and further use as filename in real image const
    }
    //Most important const with confirmation for delete product.
    const DeleteProductDetails = (rowData) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete product details!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                var result = await postData("productdetails/delete_productdetails", { productdetailid: rowData.productdetailid })
                if (result.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: result.message,
                        icon: "success"
                    });
                    fetchAllProductDetails()
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
                                    <img width={40} src={productDetailsIcon} />
                                    <div className={classes2.div3}>Update Product Details</div></div>
                                <IconButton onClick={handleClose}><ClearIcon color='error' /></IconButton>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className={classes5.div3}>
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
                                                onChange={handleBrandChange}
                                            >
                                                {fillAllBrands()}
                                            </Select>
                                        </FormControl>
                                        <div className={classes.div6}>{error.brandname}</div>
                                    </Grid>
                                </Grid>

                                <Grid className={classes3.div} item xs={12} container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl error={error.product} onFocus={() => handleError(null, "product")} fullWidth size="small">
                                            <InputLabel id="demo-simple-select-label">Product</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={productId}
                                                label="Brand"
                                                onChange={(e) => setProductId(e.target.value)}
                                            >
                                                {fillAllProducts()}
                                            </Select>
                                        </FormControl>
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
                                    <Grid item xs={6}>
                                        <TextField fullWidth onChange={(e) => setModelNo(e.target.value)} onFocus={() => handleError(null, "modelno")} value={modelNo} label="Model No." size='small' helperText={error.modelno} error={error.modelno}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth onChange={(e) => setHsnCode(e.target.value)} onFocus={() => handleError(null, "hsncode")} value={hsnCode} label="HSN Code" size='small' helperText={error.hsncode} error={error.hsncode}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth onChange={(e) => setPrice(e.target.value)} onFocus={() => handleError(null, "price")} value={price} label="Price" size='small' helperText={error.price} error={error.price}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth onChange={(e) => setOfferPrice(e.target.value)} onFocus={() => handleError(null, "offerprice")} value={offerPrice} label="Offer Price" size='small' helperText={error.offerprice} error={error.offerprice}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth onChange={(e) => setColor(e.target.value)} onFocus={() => handleError(null, "color")} value={color} label="Color" size='small' helperText={error.color} error={error.color}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth onChange={(e) => setStock(e.target.value)} onFocus={() => handleError(null, "stock")} value={stock} label="Stock" size='small' helperText={error.stock} error={error.stock}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={classes5.div9}>Description</div>
                                        <ReactQuill size="small" modules={modules} theme="snow" value={description} onChange={handleQuill} />
                                        <div className={classes5.div6}>{error.description}</div>
                                        <Grid item xs={12}>
                                            <UploadMultipleImages background={background ? "#fff" : ""} showImage={showImage} onChange={handleChange} color={handleButton ? "error" : "primary"} handleError={() => handleError(null, "image")} />
                                            {handleButton ? <div className={classes5.div6}>{error.image}</div> : <></>}
                                        </Grid>
                                    </Grid>


                                </Grid>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditProductDetails}>Edit product details</Button>
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
                            <img width={30} src={productDetailsIcon} />
                            <div className={classes2.div8}> Product Details List</div>
                        </div>
                    }

                    //important for set rows for the table
                    options={{
                        paging: true,
                        pageSize: 3,       // make initial page size
                        emptyRowsWhenPaging: false,   // To avoid of having empty rows
                        pageSizeOptions: [2, 3, 5, 12, 20, 50]
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
                            title: "Model No.",
                            field: "modelno"
                        },
                        {
                            title: "Status",
                            field: "status"
                        },
                        {
                            title: "Description",
                            field: "description"
                        },
                        {
                            title: "HSN Code",
                            field: "hsncode"
                        },
                        {
                            title: "Color",
                            field: "color"
                        },
                        {
                            title: 'Price/Offer Price',
                            render: (rowData) => <div>₹.{rowData.price}/₹.{rowData.offerprice}</div>
                        },
                        {
                            title: 'Stock',
                            field: "stock"
                        },
                        //For Image Show in render
                        { title: 'Pictures', render: (rowData) => handleShowImages(rowData) }
                    ]}
                    data={productDetailsList}
                    //actions
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Update Product Details',
                            //call function for show popup;
                            onClick: (e, rowData) => { UpdateProductDetails(rowData) }
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete Product Details',
                            onClick: (e, rowData) => { DeleteProductDetails(rowData) }
                        },
                        {
                            icon: 'add',
                            tooltip: 'Add Product Details',
                            isFreeAction: true,
                            onClick: () => navigate("/dashboard/productdetails", {state:{email:email, name:name, picture:picture}})
                        }
                    ]}
                />
                {open ? ShowDialog() : <></>}
            </div>
    )
}