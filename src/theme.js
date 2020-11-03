import {createMuiTheme} from '@material-ui/core/styles';
import {teal,purple} from '@material-ui/core/colors'; 

const theme = createMuiTheme({
    palette:{
        type:"dark", //for dark background color
        primary:teal,
        secondary:purple  
    }
})

export default theme;