import React from 'react';
import Navbar from '../components/Adminnav'; // Importing Navbar component
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button, TextField } from '@mui/material';
import img1 from '../images/chicken.png';
import img2 from '../images/veg.png';
import img3 from '../images/salamon.png';

const foodItems = [
  {
    name: 'Grilled Chicken',
    image: img1,
    description: 'Juicy grilled chicken with herbs and spices.',
    energy: '300 kcal',
    fat: '10g',
    protein: '45g',
    carbs: '0g',
  },
  {
    name: 'Salmon Fillet',
    image: img3,
    description: 'Rich and flavorful salmon fillet with lemon zest.',
    energy: '350 kcal',
    fat: '20g',
    protein: '35g',
    carbs: '0g',
  },
  {
    name: 'Vegetable Salad',
    image: img2,
    description: 'Fresh vegetable salad with olive oil and vinegar.',
    energy: '150 kcal',
    fat: '8g',
    protein: '3g',
    carbs: '15g',
  },
];

const Admin = () => {

  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        {/* Centered Heading with Add button and Search bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)', // Enlarge slightly on hover
                textShadow: '0 4px 10px rgba(0, 186, 255, 0.5)', 
              },
            }}
          >
            Welcome to Admin Dashboard!
          </Typography>

          <TextField
            variant="outlined"
            placeholder="Search..."
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: '8px',
                },
              },
            }}
          />
        </Box>

        {/* Food Cards */}
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            {foodItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', // Spread image and content apart
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                    borderRadius: '8px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition for smooth hover effect
                    '&:hover': {
                      transform: 'scale(1.04)', // Enlarge slightly on hover
                      boxShadow: '0 8px 16px rgba(0, 186, 255, 0.5)', // Sky-blue shadow on hover
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: 150, 
                      height: '190px', // Full height for no gaps
                      objectFit: 'cover', 
                      borderTopLeftRadius: '8px', // Rounded corners
                      borderBottomLeftRadius: '8px', 
                    }}
                    image={item.image}
                    alt={item.name}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5" sx={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        {item.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">Energy: {item.energy}</Typography>
                        <Typography variant="body2">Fat: {item.fat}</Typography>
                        <Typography variant="body2">Protein: {item.protein}</Typography>
                        <Typography variant="body2">Carbs: {item.carbs}</Typography>
                      </Box>
                    </CardContent>
                  </Box>

                  {/* Vertical Button Section */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', // Stack buttons vertically
                      justifyContent: 'center', 
                      padding: '0.5rem', 
                      gap: '0.5rem' // Space between buttons
                    }}
                  >
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: '#00baff', 
                        color: '#fff', 
                        '&:hover': {
                          backgroundColor: '#008fcc', // Darker blue on hover
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: '#ff4d4d', 
                        color: '#fff', 
                        '&:hover': {
                          backgroundColor: '#cc0000', // Darker red on hover
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </main>
    </div>
  );
};

export default Admin;
