import { makeStyles } from '@mui/styles';

export const useStylesCategory = makeStyles({
    div1: {
        display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"
    },
    div2: {
        width: "30%", borderRadius: "20px", alignItems: "center", padding: "10px", height: "auto", background: "#f0dcff"
    },
    div3:{
        display:'flex', flexDirection:'column', marginTop:"25px", alignItems:"center", width:"100%"
    },
    div4:{
        display:"flex", flexDirection:"row", marginTop:"25px", alignItems:"center", justifyContent:"space-evenly", width:"100%"
    },
    div5:{
        display:"flex", flexDirection:"row", marginTop:"25px", width:"90%", justifyContent:'space-between'
    },
    div6:{
        fontSize:12, color:"#c42514", padding:5
    }
})
