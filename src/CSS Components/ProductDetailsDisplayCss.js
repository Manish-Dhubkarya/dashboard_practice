import { makeStyles } from '@mui/styles';

export const useStylesProductDetailsDisplay = makeStyles({
    div1: {
        width: "600px"
    },
    div2: {
        display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-start'
    },
    div3: {
        fontFamily: "Righteous", fontStyle: "italic"
    },
    div4: {
        aspectRatio: "3/4", padding: "5px"
    },
    div5: {
        display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"
    },
    div7: {
        display: "flex", flexDirection: "column", padding: 10, justifyContent: "center", alignItems: "center"
    },
    div8: {
        fontFamily: "Righteous", fontWeight: "bold"
    },
})
