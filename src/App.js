import './App.css';
import { Box } from '@mui/material'
import maggie from './Images/maggie.jpeg'

function App() {
  return (
    <Box sx={{
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'

    }}>
      <h1>Welcome to the Maggie Zone</h1>
      
      <img src={maggie} alt='a dog'/>
    </Box>
  );
}

export default App;
