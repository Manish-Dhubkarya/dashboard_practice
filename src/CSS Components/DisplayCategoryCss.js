import { makeStyles } from '@mui/styles';

export const useStylesDisplayCategory = makeStyles({
    div1: {
        width: "500px"
    },
    div2: {
        display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-start'
    },
    div3: {
        fontFamily: "Righteous", fontStyle: "italic"
    },
    div4: {
        display: "flex", flexDirection: "row", alignItems: "center"
    },
    div5: {
        display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"
    },
    div6: {
        width: "auto", borderRadius: "10px", height: "auto", padding: 10, background: "#f6ff5d"
    },
    div7: {
        display: "flex", flexDirection: "column", padding: 10, justifyContent: "center", alignItems: "center"
    },
    div8: {
        fontFamily: "Righteous", fontWeight: "bold"
    },
    button1: {
        position: "relative"
    },
    icon: {
        position: "absolute", zIndex: 1, left: 70, top: 40
    }
})