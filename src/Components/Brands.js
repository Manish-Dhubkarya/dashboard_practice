import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { Avatar, Button, MenuItem, TextField, FormControl, InputLabel, Select, Grid } from "@mui/material";
import Heading from "./Heading";
import BrandLogo from "../Assets/brands.png"
import { postData, getData } from "../Services/FetchNodeServices";
import { useStylesCategory } from "../CSS Components/CategoryCss";
export default function Brands() {
    const classes = useStylesCategory()
    const [brandName, setBrandname] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [status, setStatus] = useState("")
    const [image, setImage] = useState({ bytes: "", filename: "" })
    const [error, setError] = useState({})
    const [category, setCategory] = useState([])
    const StatusItems=["Trending", "Popular", "Bestseller", "Continue", "Discontinue"] 

    //To Change State for Error Color of Button
    const [handleButton, setHandleButton] = useState(false)
    const handleChange = (event) => {
        //Change handleButton State
        setHandleButton(false)
        setImage({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
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
    const validation = () => {
        var error = false
        if (categoryId.length == 0) {
            /*Pass Parameter to handleError(error, lable) */
            handleError("Plz fill category...!", "categoryname")
            error = true
        }
        if (brandName.length == 0) {
            handleError("Plz fill brand...!", "brandname")
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
            formData.append("brandname", brandName)
            formData.append("status", status)
            formData.append("logo", image.bytes)
            var result = await postData("brand/submit_brand", formData)
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
        setCategoryId("")
        setBrandname("")
        setStatus("")
        setImage({ bytes: "", filename: "" })
    }

    return (

            <div className={classes.div2}>
                <Heading link={"/dashboard/displaybrands"} image={BrandLogo} caption="Add Brand" />
                <div className={classes.div3}>
                    <FormControl error={error.categoryname} onFocus={() => handleError(null, "categoryname")} fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={categoryId}
                            label="Category"
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            {fillAllCategory()}
                        </Select>
                    </FormControl>
                    <div className={classes.div6}>{error.categoryname}</div>
                    <Grid container spacing={2} item xs={12}>
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
                            <div className={classes.div6}>{error.status}</div></Grid>
                    </Grid>
                    <div className={classes.div4}>
                        <div>
                            {/* Important Error Handling calling for Image~ */}
                            <Button color={handleButton ? "error" : "primary"} variant="outlined" onFocus={() => handleError(null, "image")} component="label" size="small">
                                <input onChange={handleChange} hidden type="file" accept="images/*" multiple />
                                Brand Icon
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