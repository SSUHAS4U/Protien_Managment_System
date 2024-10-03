import React, { useState } from 'react';
import Navbar from '../components/Adminnav'; // Importing Navbar component
import { Box, Typography, Card, CardContent, Button, TextField } from '@mui/material';

const Add = () => {
  // State to hold form values
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    description: '',
    energy: '',
    protein: '',
    fat: '',
    netCarbs: '',
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Replace with actual submit logic, e.g., API call
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        {/* Centered Heading with hover effect */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)', // Enlarge slightly on hover
                textShadow: '0 4px 10px rgba(0, 186, 255, 0.5)',
              },
            }}
          >
            Add New Food Item
          </Typography>
        </Box>

        {/* Large Form inside a card */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 900, // Increased width for larger form
              padding: 4, // Added more padding for larger form
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)', // Enlarge slightly on hover
                boxShadow: '0 8px 16px rgba(0, 186, 255, 0.5)', // Sky-blue shadow on hover
              },
            }}
          >
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />

                  {/* Styled Image upload field */}
                  <TextField
                    label="Upload Image"
                    type="file"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleImageUpload}
                    fullWidth
                    required
                    inputProps={{
                      accept: 'image/*',
                    }}
                  />
                  {formData.image && (
                    <Typography variant="body2" color="text.secondary">
                      {formData.image.name}
                    </Typography>
                  )}

                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={3}
                  />
                  <TextField
                    label="Energy (kcal)"
                    name="energy"
                    value={formData.energy}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <TextField
                    label="Protein (g)"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <TextField
                    label="Fat (g)"
                    name="fat"
                    value={formData.fat}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <TextField
                    label="Net Carbs (g)"
                    name="netCarbs"
                    value={formData.netCarbs}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />

                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: '#00baff',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#008fcc',
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </main>
    </div>
  );
};

export default Add;
