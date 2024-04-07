import list from "../../src/Assets/List.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { useStylesHeading } from "../CSS Components/HeadingCss";
export default function Heading(props) {
    var location =useLocation()
    const {email, name, picture}=location.state
    const classes = useStylesHeading()
    var navigate = useNavigate()
    return (
        <div className={classes.div1}>
            <div>
                <img src={props.image} width={50} />
                <div className={classes.div2}>
                    {props.caption}
                </div>
            </div>
            <div className={classes.div3}>
                <img onClick={() => navigate(props.link, { state: { email: email, name: name, picture: picture } })} src={list} className={classes.img1}></img>
            </div>

        </div>
    )
}