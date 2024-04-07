import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from "@mui/material";
export default function UploadMultipleImages(props) {
    return (
        <div>
            <Button fullWidth color={props.color} variant="outlined" component="label" size="small" onFocus={() => props.handleError}>
                <input onChange={props.onChange} hidden type="file" accept="images/*" multiple />
                Upload multiple images
                <UploadFileIcon />
            </Button>
            <div style={{ display: "flex", background: props.background, borderRadius: "5px", flexWrap: "wrap", paddingTop: "10px", flexDirection: "row" }}>
                {props.showImage()}
            </div>
        </div>
    )
}