import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Card, Typography, Grid, TextField, Button, Avatar, Snackbar, Alert,
  MenuItem, Stack, Divider,
} from '@mui/material';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';

export default function Account() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [user, setUser] = useState({
    name: '', gender: '', birthDate: '', heightFeet: '', heightInches: '', weight: '',
    phoneNumber: '', address: '', bio: '', Password: '', newPassword: '', confirmPassword: '', profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const closeSnack = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!email || !authToken) return;
    axios.get(`${API_BASE}/users?email=${email}`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((res) => {
        if (res.data.user) {
          setUser((u) => ({ ...u, ...res.data.user }));
          if (res.data.user.profileImage) setImagePreview(`data:image/jpeg;base64,${res.data.user.profileImage}`);
        }
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to load your profile.', severity: 'error' }));
  }, []);

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setUser({ ...user, profileImage: file });
  };

  const buildForm = () => {
    const fd = new FormData();
    ['name', 'gender', 'birthDate', 'heightFeet', 'heightInches', 'weight', 'phoneNumber', 'address', 'bio'].forEach((k) => fd.append(k, user[k] ?? ''));
    if (user.newPassword) fd.append('newPassword', user.newPassword);
    if (user.profileImage && typeof user.profileImage !== 'string') fd.append('profileImage', user.profileImage);
    return fd;
  };

  const doUpdate = (email) =>
    axios.put(`${API_BASE}/edit/${email}`, buildForm(), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => { setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' }); setUser((u) => ({ ...u, ...res.data })); })
      .catch(() => setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' }));

  const onSave = (e) => {
    e.preventDefault();
    if (user.newPassword !== user.confirmPassword) { setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' }); return; }
    if (user.newPassword && user.newPassword.length < 8) { setSnackbar({ open: true, message: 'New password must be at least 8 characters.', severity: 'error' }); return; }
    const email = sessionStorage.getItem('email');
    if (user.Password) {
      axios.post(`${API_BASE}/verify-password`, { email, password: user.Password })
        .then(() => doUpdate(email))
        .catch(() => setSnackbar({ open: true, message: 'Current password is incorrect.', severity: 'error' }));
    } else {
      doUpdate(email);
    }
  };

  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'gender', label: 'Gender', select: true, options: [['male', 'Male'], ['female', 'Female'], ['other', 'Prefer not to say']] },
    { name: 'birthDate', label: 'Birth Date', type: 'date', shrink: true },
    { name: 'weight', label: 'Weight (kg)', type: 'number' },
    { name: 'heightFeet', label: 'Height (Feet)', type: 'number' },
    { name: 'heightInches', label: 'Height (Inches)', type: 'number' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    { name: 'address', label: 'Address' },
  ];

  return (
    <AppLayout title="Account">
      <Box component="form" onSubmit={onSave}>
        <Grid container spacing={3}>
          {/* Profile card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto' }}>
                <Avatar src={imagePreview} sx={{ width: 120, height: 120, mx: 'auto', bgcolor: '#16a34a', fontSize: 44, fontWeight: 800 }}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Button onClick={() => fileInputRef.current.click()} sx={{ position: 'absolute', bottom: 0, right: '30%', minWidth: 0, p: 1, borderRadius: '50%', bgcolor: '#fff', boxShadow: 2, '&:hover': { bgcolor: '#eafce9' } }}>
                  <PhotoCameraRoundedIcon sx={{ color: '#16a34a' }} />
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onImage} style={{ display: 'none' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, mt: 2 }}>{user.name || 'Your name'}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{sessionStorage.getItem('email')}</Typography>
              <Divider sx={{ my: 2 }} />
              <TextField fullWidth multiline rows={3} name="bio" label="Bio" value={user.bio || ''} onChange={onChange} />
            </Card>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 2 }}>Personal details</Typography>
              <Grid container spacing={2}>
                {fields.map((f) => (
                  <Grid item xs={12} sm={6} key={f.name}>
                    <TextField
                      fullWidth name={f.name} label={f.label} type={f.type || 'text'} select={f.select}
                      value={user[f.name] || ''} onChange={onChange}
                      InputLabelProps={f.shrink || f.select ? { shrink: true } : undefined}
                      SelectProps={f.select ? { displayEmpty: true, MenuProps: { disableScrollLock: true } } : undefined}
                    >
                      {f.select && [<MenuItem key="" value="" disabled>{`Select ${f.label.toLowerCase()}`}</MenuItem>, ...f.options.map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)]}
                    </TextField>
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mt: 3, mb: 2 }}>Change password</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><TextField fullWidth type="password" name="Password" label="Current password" value={user.Password || ''} onChange={onChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth type="password" name="newPassword" label="New password" value={user.newPassword || ''} onChange={onChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth type="password" name="confirmPassword" label="Confirm new" value={user.confirmPassword || ''} onChange={onChange} /></Grid>
              </Grid>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" size="large">Save changes</Button>
                <Button variant="outlined" color="primary" onClick={() => window.location.reload()} sx={{ borderWidth: 2 }}>Cancel</Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnack}>
        <Alert onClose={closeSnack} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}
