import { Box } from "@mui/material";
import maggie from '../Images/maggie.jpeg'


const Page: React.FC = () => { 
    return (
        <Box sx={{
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
      
          }}>
            <h1>Welcome to the Maggie Zone</h1>
            
            <img src={maggie} alt='a dog'/>
          </Box>
        )
};

export default Page