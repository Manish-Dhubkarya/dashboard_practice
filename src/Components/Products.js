import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { Avatar, Button, MenuItem, TextField, FormControl, InputLabel, Select, Grid } from "@mui/material";
import Heading from "./Heading";
import ProductLogo from "../Assets/products.png"
import { postData, getData } from "../Services/FetchNodeServices";
import { useStylesCategory } from "../CSS Components/CategoryCss";
export default function Products() {
    const classes = useStylesCategory()
    const [brand, setBrand] = useState([])
    const [brandId, setBrandId] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [status, setStatus] = useState("")
    const [image, setImage] = useState({ bytes: "", filename: "" })
    const [error, setError] = useState({})
    const [category, setCategory] = useState([])
    const [product, setProduct] = useState("")
    const StatusItems = ["Trending", "Popular", "Bestseller", "Continue", "Discontinue"]
    //To Change State for Error Color of Button
    const [handleButton, setHandleButton] = useState(false)
    const handleChange = (event) => {
        //Change handleButton State
        setHandleButton(false)
        setImage({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
    }
    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value)
        //must set value of category here to fetchAllBrands on change category 
        fetchAllBrands(e.target.value)
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
    const fillStatus = () => {
        return StatusItems.map((i) => {
            return <MenuItem value={i}>{i}</MenuItem>
        })
    }
    useEffect(function () {
        fetchAllCategory()
        fetchAllBrands()
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
        if (product.length == 0) {
            handleError("Plz fill product...!", "product")
            error = true
        }
        if (status.length == 0) {
            handleError("Plz fill status...!", "status")
            error = true
        }
        if (image.filename.length == 0) {
            //setHandleButton for state change to color
            setHandleButton(true)
            handleError("Plz Choose Logo...!", "image")
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
            formData.append("status", status)
            formData.append("productname", product)
            formData.append("picture", image.bytes)
            var result = await postData("product/submit_product", formData)
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
        setProduct("")
        setCategoryId("")
        setBrandId("")
        setStatus("")
        setImage({ bytes: "", filename: "" })
    }

    return (
            <div className={classes.div2}>
                <Heading link={"/dashboard/displayproducts"} image={ProductLogo} caption="Add Product" />
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
                                    onChange={(e) => setBrandId(e.target.value)}
                                >
                                    {fillAllBrands()}
                                </Select>
                            </FormControl>
                            <div className={classes.div6}>{error.brandname}</div></Grid>


                    </Grid>
                    <Grid container spacing={2} item xs={12}>
                        <Grid item xs={6}>
                            <TextField value={product} error={error.product} onFocus={() => handleError(null, "product")} helperText={error.product} onChange={(e) => setProduct(e.target.value)} fullWidth label="Product" size="small" placeholder="Product" title="Product" />
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
                    <div className={classes.div4}>
                        <div>
                            {/* Important Error Handling calling for Image~ */}
                            <Button color={handleButton ? "error" : "primary"} variant="outlined" onFocus={() => handleError(null, "image")} component="label" size="small">
                                <input onChange={handleChange} hidden type="file" accept="images/*" multiple />
                                Product Picture
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