import { Avatar, Paper } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useStylesDashboardCss } from "../CSS Components/DashboardCss";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from "sweetalert2";
import { adminLogout, resetAdmin } from "../Store/AdminActionType";
import { useState } from "react";
import * as React from 'react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Route, Routes } from "react-router-dom";
import Category from "../Components/Category";
import Heading from "../Components/Heading";
import DisplayAllCategory from "../Components/DisplayAllCategory";
import Brands from "../Components/Brands";
import DisplayAllBrands from "../Components/DisplayAllBrands";
import Products from "../Components/Products";
import DisplayAllProducts from "../Components/DisplayAllProducts";
import ProductDetails from "../Components/ProductDetails";
import DisplayAllProductDetails from "../Components/DisplayAllProductDetails";
import Banner from "../Components/Banner";
import DisplayBanners from "../Components/DisplayBanners";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
export default function Dashboard() {
    var navigate = useNavigate()
    const location = useLocation()
    const { name, email, picture } = location.state
    const [categorystatus, setCategoryStatus] = useState(false)
    const [brandstatus, setBrandStatus] = useState(false)
    const [bannerStatus, setBannerStatus] = useState(false)
    const [productStatus, setProductStatus] = useState(false)
    const [productdetailStatus, setProductDetailStatus] = useState(false)
    const [logoutStatus, setLogoutStatus] = useState(false)
    const [selected, setSelected] = useState("")
    const dispatch = useDispatch();
    const classes = useStylesDashboardCss()
    const handleCategory = () => {
        setCategoryStatus(true)
        setBannerStatus(false)
        setBrandStatus(false)
        setLogoutStatus(false)
        setProductDetailStatus(false)
        setProductStatus(false)
        setSelected("Category")
        navigate("/dashboard/category", { state: { email: email, name: name, picture: picture } })
    }
    const handleBrand = () => {
        setCategoryStatus(false)
        setBannerStatus(false)
        setBrandStatus(true)
        setLogoutStatus(false)
        setProductDetailStatus(false)
        setProductStatus(false)
        setSelected("Brands")
        navigate("/dashboard/brands", { state: { email: email, name: name, picture: picture } })
    }
    const handleBanner = () => {
        setCategoryStatus(false)
        setBannerStatus(true)
        setBrandStatus(false)
        setLogoutStatus(false)
        setProductDetailStatus(false)
        setProductStatus(false)
        setSelected("Banners")
        navigate("/dashboard/banner", { state: { email: email, name: name, picture: picture } })
    }
    const handleProduct = () => {
        setProductStatus(true)
        setCategoryStatus(false)
        setBannerStatus(false)
        setBrandStatus(false)
        setLogoutStatus(false)
        setProductDetailStatus(false)
        setSelected("Products")
        navigate("/dashboard/products", { state: { email: email, name: name, picture: picture } })
    }
    const handleProductDetail = () => {
        setProductStatus(false)
        setCategoryStatus(false)
        setBannerStatus(false)
        setBrandStatus(false)
        setLogoutStatus(false)
        setProductDetailStatus(true)
        setSelected("Product Details")
        navigate("/dashboard/productdetails", { state: { email: email, name: name, picture: picture } })
    }
    const handleLogout = () => {
        setProductStatus(false)
        setCategoryStatus(false)
        setBannerStatus(false)
        setBrandStatus(false)
        setLogoutStatus(true)
        setProductDetailStatus(false)
        setSelected("")
        Swal.fire({
            title: "Are you sure?",
            text: "You want to logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                dispatch(resetAdmin());
                dispatch(adminLogout())
                navigate("/adminlogin", { state: null });
                // Dispatch action to logout
                Swal.fire({
                    title: "Logout!",
                    text: "Logout Successfully...!",
                    icon: "success"
                });

            }
            else {
                Swal.fire({
                    title: "Fail!",
                    text: "Fail to Logout...!",
                    icon: "fail"
                });
            }
        });
    }
    const FieldsItems = [
        {
            field: "Category",
            icon: <SaveAsIcon />,
            handle: handleCategory,
            status: categorystatus
        },
        {
            field: "Brands",
            icon: <SaveAsIcon />,
            handle: handleBrand,
            status: brandstatus
        },
        {
            field: "Product",
            icon: <SaveAsIcon />,
            handle: handleProduct,
            status: productStatus
        },
        {
            field: "Product Details",
            icon: <SaveAsIcon />,
            handle: handleProductDetail,
            status: productdetailStatus
        },
        {
            field: "Banners",
            icon: <SaveAsIcon />,
            handle: handleBanner,
            status: bannerStatus
        },
        {
            field: "Logout",
            icon: <LogoutIcon />,
            handle: handleLogout,
            status: logoutStatus
        },
    ]

    return (
        <div className={classes.div1}>
            <div className={classes.div2}>
                <div className={classes.div3}>
                    <Avatar src={picture} /><div className={classes.div4}>Admin Dashboard</div>
                </div>
                <div className={classes.div5}>
                    <div className={classes.div6}>
                        <RocketLaunchIcon className={classes.icon2} /><div className={classes.div4}> Fields To Update</div>
                    </div>
                    <div className={classes.div7}>
                        {/* Fields */}
                        {FieldsItems.map((item, i) => {
                            return (
                                <div className={item.status ? classes.div9 : classes.div8} onClick={item.handle}>
                                    <div className={item.status ? classes.div10 : classes.div10b}>{item.icon}</div> <div className={classes.div11}>{item.field}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className={classes.div12}>
                {/* Admin Header */}
                <div className={classes.div13}>
                    <div className={classes.div14}>
                        <div className={classes.div15}> Admin pannel for data updation and deletion</div>
                        <div className={classes.div16}> <div className={classes.div17}><div className={classes.div18}>Selected:</div><div className={classes.div19}>{selected}</div></div>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', borderRadius: "30px", display: 'flex', alignItems: 'center', width: "70%" }}
                            >
                                <IconButton sx={{ p: '10px' }} aria-label="menu">
                                    <MenuIcon />
                                </IconButton>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search fields"
                                />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </div>
                    </div>

                    <div className={classes.div20}>
                        <div>
                            <Avatar src={picture} />
                        </div>
                        <div className={classes.div21}>
                            <div className={classes.div22}>Admin</div>
                            <div className={classes.div23}>{name}</div>
                            <div className={classes.div24}>{email}</div>
                        </div>

                    </div>
                </div>
                {/* Components call here */}
                <div className={classes.div25}>
                    <Routes>
                        <Route Component={Heading} path="/heading"></Route>
                        <Route Component={Category} path="/category"></Route>
                        <Route Component={DisplayAllCategory} path="/displaycategory"></Route>
                        <Route Component={Brands} path="/brands"></Route>
                        <Route Component={DisplayAllBrands} path="/displaybrands"></Route>
                        <Route Component={Products} path="/products"></Route>
                        <Route Component={DisplayAllProducts} path="/displayproducts"></Route>
                        <Route Component={ProductDetails} path="/productdetails"></Route>
                        <Route Component={DisplayAllProductDetails} path="/displayproductdetails"></Route>
                        <Route Component={Banner} path="/banner"></Route>
                        <Route Component={DisplayBanners} path="/displaybanners"></Route>
                    </Routes>
                </div>
            </div>
        </div>
    )
}