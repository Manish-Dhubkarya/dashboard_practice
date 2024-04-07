import * as React from 'react';
import Swal from 'sweetalert2';
import BannerLogo from "../Assets/banner.png"
import MaterialTable from "@material-table/core"
import { useStylesDisplayCategory } from '../CSS Components/DisplayCategoryCss';
import { useEffect, useState } from "react"
import { getData, postData, serverURL } from "../Services/FetchNodeServices"
import { useLocation, useNavigate } from "react-router-dom"
import { useStylesProductDetailsDisplay } from '../CSS Components/ProductDetailsDisplayCss';
export default function DisplayBanners() {
  var location = useLocation()
  const { email, name, picture } = location.state
  const [banners, setBanners] = useState([])
  const classes = useStylesProductDetailsDisplay()
  const classes2 = useStylesDisplayCategory()
  var navigate = useNavigate()
  const fetchAllBanners = async () => {
    var result = await getData("banner/display_all_banners")
    setBanners(result.data)
  }
  useEffect(function () {
    fetchAllBanners()
  }, [])
  //for showing the images on Material Table 
  const handleShowImages = (rowData) => {
    return rowData.banners.split(",").map((item) => {
      return <img className={classes.div4} width={20} src={`${serverURL}/images/${item}`} />
    })
  }
  const DeleteBanners = (rowData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete banners!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        var result = await postData("banner/delete_banners", { bannerid: rowData.bannerid })
        if (result.status) {
          Swal.fire({
            title: "Deleted!",
            text: result.message,
            icon: "success"
          });
          fetchAllBanners()
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
  return (
    <div className={classes2.div6}>
      <MaterialTable
        title={
          <div className={classes2.div7}>

            <img width={30} src={BannerLogo} />
            <div className={classes2.div8}> Banners List</div>

          </div>
        }
        columns={[
          //field as per database
          { title: 'Banner ID', field: 'bannerid' },
          { title: 'Status', field: 'status' },
          //For Image Show in render
          { title: 'Banners', render: (rowData) => handleShowImages(rowData) }

        ]}
        data={banners}
        //actions
        actions={[
          {
            icon: 'delete',
            tooltip: 'Delete Banner',
            onClick: (e, rowData) => { DeleteBanners(rowData) }
          },
          {
            icon: 'add',
            tooltip: 'Add Banners',
            isFreeAction: true,
            onClick: () => navigate("/dashboard/banner", { state: { email: email, name: name, picture: picture } })
          }
        ]}
      />
    </div>
  )
}