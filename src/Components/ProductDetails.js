import { useEffect, useState, useMemo } from "react"
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import ClearIcon from '@mui/icons-material/Clear';
import UploadMultipleImages from "./UploadMultipleImagesComponent";
import { Avatar, Button, MenuItem, TextField, FormControl, InputLabel, Select, Grid } from "@mui/material";
import Heading from "./Heading";
import ProductDetailsLogo from "../Assets/productdetails.png"
import { postData, getData } from "../Services/FetchNodeServices";
import { useStylesProductDetails } from "../CSS Components/ProductDetailsCss";
export default function ProductDetails() {
    const classes = useStylesProductDetails()
    const [brand, setBrand] = useState([])
    const [productId, setProductId] = useState("")
    const [brandId, setBrandId] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [modelNo, setModelNo] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("")
    const [price, setPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [hsnCode, setHsnCode] = useState("")
    const [stock, setStock] = useState("")
    const [status, setStatus] = useState("")
    const [image, setImage] = useState([])
    const [error, setError] = useState({})
    const [category, setCategory] = useState([])
    const [product, setProduct] = useState([])
    const [background, setBackground] = useState(false)
    const StatusItems = ["Trending", "Popular", "Bestseller", "Continue", "Discontinue"]
    //To Change State for Error Color of Button
    const [handleButton, setHandleButton] = useState(false)
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
    //Must for flitering the remaining images by removing it.
    const handleRemoveImage = (indexToRemove) => {
        setImage(image.filter(index => index !== indexToRemove));
    }

    //For showing multiple images below Upload button
    const showImage = () => {
        //Very Important for the showing multiple images stored in "image"
        return image?.map((item, i) => {
            return <div><div className={classes.div4}><div><Avatar className={classes.div7} src={URL.createObjectURL(item)} /></div><div onClick={() => handleRemoveImage(item)} className={classes.div8}><ClearIcon /></div></div></div>
        })
    }
    const handleQuill = (newValue) => {
        setDescription(newValue)
        if (newValue.trim() !== '') {
            handleError('', 'description');
        }
    }

    //for change the states related to upload or remove images 
    const handleChange = (event) => {
        //Change handleButton State
        setBackground(true)
        setHandleButton(false)
        //Must for showing multiple files in Avatar
        const files = Array.from(event.target.files);

        // Filter out existing images and add new ones
        const newImages = files.filter(file => !image.find(img => img.name === file.name));
        setImage(prevImages => [...prevImages, ...newImages]);
    }
    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value)
        //must set value of category here to fetchAllBrands on change category 
        fetchAllBrands(e.target.value)
    }
    const handleBrandChange = (e) => {
        setBrandId(e.target.value)
        fetchAllProducts(e.target.value)
    }
    const fetchAllCategory = async () => {
        var result = await getData("category/display_all_category")
        setCategory(result.data)
    }
    //fetch brand by categoryid and set value of brand to get in brand map for fill brand
    const fetchAllBrands = async (cid) => {
        var result = await postData("brand/display_all_brands_by_categoryid", { categoryid: cid })
        setBrand(result.data)
    }
    const fetchAllProducts = async (bid) => {
        var result = await postData("product/display_all_products_by_brandid", { categoryid: categoryId, brandid: bid })
        setProduct(result.data)
    }
    const fillAllCategory = () => {
        return category.map((i) => {
            //category have the database category set using setCategory on fetchAllcategory()
            return <MenuItem value={i.categoryid}>{i.categoryname}</MenuItem>
        })
    }
    const fillAllBrands = () => {
        // alert(JSON.stringify(brand))
        return brand.map((i) => {
            return <MenuItem value={i.brandid}>{i.brandname}</MenuItem>
        })
    }
    const fillAllProducts = () => {
        // alert(JSON.stringify(brand))
        return product.map((i) => {
            return <MenuItem value={i.productid}>{i.productname}</MenuItem>
        })
    }
    const fillStatus = () => {
        return StatusItems.map((i) => {
            return <MenuItem value={i}>{i}</MenuItem>
        })
    }
    useEffect(function () {
        fetchAllCategory()
        fetchAllBrands()
        fetchAllProducts()
    }, [])
    const validation = () => {
        var error = false
        if (categoryId.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill category...!", "categoryname")
            error = true
        }
        if (brandId.length == 0) {
            handleError("Plz fill brand...!", "brandname")
            error = true
        }
        if (productId.length == 0) {
            handleError("Plz fill product...!", "productname")
            error = true
        }
        if (status.length == 0) {
            handleError("Plz fill status...!", "status")
            error = true
        }
        if (stock.length == 0) {
            handleError("Plz fill stock...!", "stock")
            error = true
        }
        if (modelNo.length == 0) {
            handleError("Plz fill model no....!", "modelno")
            error = true
        }
        if (hsnCode.length == 0) {
            handleError("Plz fill HSN Code...!", "hsncode")
            error = true
        }
        if (color.length == 0) {
            handleError("Plz fill color...!", "color")
            error = true
        }
        if (price.length == 0) {
            handleError("Plz fill price...!", "price")
            error = true
        }
        if (offerPrice.length == 0) {
            handleError("Plz fill offer price...!", "offerprice")
            error = true
        }
        if (description.length == 0) {
            handleError("Plz fill description...!", "description")
            error = true
        }
        if (image.length == 0) {
            //setHandleButton for state change to color
            setHandleButton(true)
            handleError("Plz Choose Images...!", "image")
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
            formData.append("categoryid", categoryId)
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
            // ! must for the submission of images
            image.map((file, index) => {
                formData.append('pictures' + index, file)
            })
            var result = await postData("productdetails/submit_productdetails", formData)
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
                    position: "center",
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
        setProductId("")
        setCategoryId("")
        setBrandId("")
        setStatus("")
        setImage([])
        setDescription("")
        setBackground(false)
        setOfferPrice("")
        setPrice("")
        setModelNo("")
        setHsnCode("")
        setStock("")
        setColor("")
    }
    return (
            <div className={classes.div2}>
                <Heading link={"/dashboard/displayproductdetails"} image={ProductDetailsLogo} caption="Add Product Details" />
                <div className={classes.div3}>
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl error={error.categoryname} onFocus={() => handleError(null, "categoryname")} fullWidth size="small">
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={categoryId}
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
                                <InputLabel id="demo-simple-select-label">Brands</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={brandId}
                                    label="Brands"
                                    onChange={handleBrandChange}
                                >
                                    {fillAllBrands()}
                                </Select>
                            </FormControl>
                            <div className={classes.div6}>{error.brandname}</div></Grid>
                    </Grid>
                    <Grid container spacing={2} item xs={12}>
                        <Grid item xs={6}>
                            <FormControl error={error.productname} onFocus={() => handleError(null, "productname")} fullWidth size="small">
                                <InputLabel id="demo-simple-select-label">Products</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={productId}
                                    label="Products"
                                    onChange={(e) => setProductId(e.target.value)}
                                >
                                    {fillAllProducts()}
                                </Select>
                            </FormControl>
                            <div className={classes.div6}>{error.productname}</div>
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
                            <div className={classes.div6}>{error.status}</div></Grid>
                    </Grid>
                    <Grid item xs={12} container spacing={2}>
                        <Grid container spacing={2} item xs={6}>
                            <Grid item xs={6}>
                                <TextField value={modelNo} error={error.modelno} onFocus={() => handleError(null, "modelno")} helperText={error.modelno} onChange={(e) => setModelNo(e.target.value)} fullWidth label="Model No." size="small" placeholder="Model No." title="Model No." />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField value={hsnCode} error={error.hsncode} onFocus={() => handleError(null, "hsncode")} helperText={error.hsncode} onChange={(e) => setHsnCode(e.target.value)} fullWidth label="HSN Code" size="small" placeholder="HSN Code" title="HSN Code" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField value={color} error={error.color} onFocus={() => handleError(null, "color")} helperText={error.color} onChange={(e) => setColor(e.target.value)} fullWidth label="Color" size="small" placeholder="Color" title="Model No." />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField value={stock} error={error.stock} onFocus={() => handleError(null, "stock")} helperText={error.stock} onChange={(e) => setStock(e.target.value)} fullWidth label="Stock" size="small" placeholder="Stock" title="Stock" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField value={price} error={error.price} onFocus={() => handleError(null, "price")} helperText={error.price} onChange={(e) => setPrice(e.target.value)} fullWidth label="Price" size="small" placeholder="Price" title="Price" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField value={offerPrice} error={error.offerprice} onFocus={() => handleError(null, "offerprice")} helperText={error.offerprice} onChange={(e) => setOfferPrice(e.target.value)} fullWidth label="Offer Price" size="small" placeholder="Offer Price" title="Offer Price" />
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.div9}>Description</div>
                                <ReactQuill size="small" modules={modules} theme="snow" value={description} onChange={handleQuill} />
                                <div className={classes.div6}>{error.description}</div>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6}>
                            <Grid item xs={12}>
                                <UploadMultipleImages background={background ? "#fff" : ""} showImage={showImage} onChange={handleChange} color={handleButton ? "error" : "primary"} handleError={() => handleError(null, "image")} />
                                {handleButton ? <div className={classes.div6}>{error.image}</div> : <></>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid className={classes.div5} container spacing={2} item xs={12}>
                        <Grid item xs={6}>
                            <Button fullWidth variant="outlined" onClick={handleSubmit} size="small">Submit</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth variant="outlined" onClick={handleReset} size="small">reset</Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
    )
}