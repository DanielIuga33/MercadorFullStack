import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../..';
import img1 from '../../images/img1.jpeg';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Container, 
  TextField, 
  Divider, 
  Alert, 
  Collapse,
  InputAdornment 
} from '@mui/material';
import { 
  Person, 
  Email, 
  CalendarToday, 
  Public, 
  LocationCity, 
  Home, 
  Lock, 
  Edit, 
  Save, 
  Cancel 
} from '@mui/icons-material';

// --- DEFINIȚIILE EXTERNE (Trebuie să fie AICI, în afara componentei) ---

// 1. Stilurile definite o singură dată
const themeColors = {
    primary: 'hsl(0, 90%, 30%)',
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.75)',
    border: 'rgba(255, 255, 255, 0.1)',
    textSecondary: 'rgba(255, 255, 255, 0.7)'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#ff4d4d' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff4d4d' },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' },
    marginBottom: 2
};

const buttonStyle = {
    background: themeColors.gradient,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 90%, 50%) 100%)',
    },
    '&.Mui-disabled': {
        background: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.3)'
    }
};

// 2. Componenta BackgroundWrapper definită ÎN AFARA AccountDetails
const BackgroundWrapper = ({ children }) => (
    <Box sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
    }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>{children}</Box>
    </Box>
);

// --- COMPONENTA PRINCIPALĂ ---
const AccountDetails = ({ userData, setUserData }) => {
    const navigate = useNavigate();

    // ... (restul logicii rămâne exact la fel) ...
    // COL 1 States
    const [formData, setFormData] = useState(userData);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [errorMsgFirstCol, setErrorMsgFirstCol] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const [emailOnFocus, setEmailOnFocus] = useState(false);
    const [arontErr, setArontErr] = useState(false);
    const [finishErr, setFinishErr] = useState(false);
    const [emailLenErr, setEmailLenErr] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible1, setIsVisible1] = useState(false);

    // COL 2 States
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [errorMsgSecondCol1, setErrorMsgSecondCol1] = useState('');
    const [errorMsgSecondCol2, setErrorMsgSecondCol2] = useState('');
    const [password, setPassword] = useState('');
    const [newpassword, setnewPassword] = useState('');
    const [cfnpassword, setcfnPassword] = useState('');

    const [charErr, setCharErr] = useState(false);
    const [noNrErr, setNoNrErr] = useState(false);
    const [noUpperErr, setNoUpperErr] = useState(false);

    useEffect(() => {
        if (!userData.email) navigate('/account');
    }, [navigate, userData.email]);

    // --- LOGIC FUNCTIONS ---
    
    const showDiv = () => {
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 5000);
    };

    const showDiv1 = () => {
        setIsVisible1(true);
        setTimeout(() => setIsVisible1(false), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValidationErrors({ ...validationErrors, [name]: false });
        setFormData({ ...formData, [name]: value });
    };

    // Email Validation
    useEffect(() => {
        if (formData.email) {
            let ok = true;
            if (formData.email.length <= 6) { setEmailLenErr(true); ok = false; } else setEmailLenErr(false);
            if (!formData.email.includes("@")) { setArontErr(true); ok = false; } else setArontErr(false);
            if (!formData.email.endsWith(".com") && !formData.email.endsWith(".ro")) { setFinishErr(true); ok = false; } else setFinishErr(false);

            if (!ok) return;

            const checkEmail = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/check-email`, { params: { email: formData.email } });
                    if (response.data && emailOnFocus && !isReadOnly && formData.email !== userData.email) {
                        setEmailError('Email already exists');
                    } else {
                        setEmailError('');
                    }
                } catch (error) { console.error('Error checking email:', error); }
            };
            checkEmail();
        } else { setEmailError(''); }
    }, [formData.email, emailOnFocus, isReadOnly, userData.email]);

    const submitInfo = () => {
        let hasError = false;
        const requiredFields = ['name', 'surname', 'email', 'birthDate', 'country', 'county', 'city', 'street'];
        let newErrors = {};

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = true;
                hasError = true;
            }
        });

        if (hasError) {
            setValidationErrors(newErrors);
            setErrorMsgFirstCol('Please complete all fields!');
            return;
        }

        setErrorMsgFirstCol("");
        if (!emailError && !arontErr && !finishErr && !emailLenErr) {
            setIsReadOnly(true);
            updateUser(formData.id, formData);
        }
    };

    // Password Logic
    useEffect(() => {
        if (newpassword) {
            setCharErr(newpassword.length < 8 || newpassword.length > 16);
            setNoNrErr(!/\d/.test(newpassword));
            setNoUpperErr(newpassword.toLowerCase() === newpassword);
        } else {
            setCharErr(false); setNoNrErr(false); setNoUpperErr(false);
        }
    }, [newpassword]);

    useEffect(() => {
        if (newpassword && cfnpassword && newpassword !== cfnpassword) {
            setErrorMsgSecondCol2('Passwords do not match!');
        } else { setErrorMsgSecondCol2(''); }
    }, [newpassword, cfnpassword]);

    const verifyPassword = async (event) => {
        event.preventDefault();
        if (!password) return;
        setErrorMsgSecondCol1('');
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email: userData.email, password });
            if (response.status === 200) setPasswordsMatch(true);
        } catch (error) {
            setErrorMsgSecondCol1(error.response?.status === 401 ? 'Wrong password!' : 'Network error');
        }
    };

    const changePassword = () => {
        if (!newpassword || !cfnpassword) { setErrorMsgSecondCol2('Complete all fields!'); return; }
        if (newpassword === password) { setErrorMsgSecondCol2('New password cannot be the same!'); return; }
        if (charErr || noNrErr || noUpperErr) return;

        if (!errorMsgSecondCol2) {
            const updatedData = { ...formData, password: newpassword };
            updateUser(formData.id, updatedData);
            exitPasswordMode();
        }
    };

    const exitPasswordMode = () => {
        setPasswordsMatch(false); setcfnPassword(''); setnewPassword(''); setPassword('');
    };

    const updateUser = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/users/${id}`, data);
            setUserData(data);
            if (!newpassword) showDiv(); else showDiv1();
        } catch (error) { console.error('Error updating user:', error); }
    };

    return (
        <BackgroundWrapper>
            <Container maxWidth="lg">
                <Paper elevation={24} sx={{
                    backgroundColor: themeColors.glass,
                    backdropFilter: 'blur(16px)',
                    borderRadius: 4,
                    border: `1px solid ${themeColors.border}`,
                    color: 'white',
                    p: { xs: 2, md: 4 }
                }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold' }}>
                        Account Settings
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 4, color: themeColors.textSecondary }}>
                        Manage your profile information and security
                    </Typography>

                    <Grid container spacing={6}>
                        {/* COL 1: PERSONAL INFO */}
                        <Grid item xs={12} lg={7}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Person sx={{ color: '#ff4d4d', mr: 1, fontSize: 30 }} />
                                <Typography variant="h5" fontWeight="bold">Personal Information</Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="First Name" name="name" value={formData.name} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.name} sx={inputStyle} 
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Surname" name="surname" value={formData.surname} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.surname} sx={inputStyle}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.username} sx={inputStyle}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.email || !!emailError || arontErr || finishErr || emailLenErr} 
                                        helperText={emailError || (arontErr && "Must contain @") || (finishErr && "Must end with .com or .ro") || (emailLenErr && "Too short")}
                                        onFocus={() => setEmailOnFocus(true)} onBlur={() => setEmailOnFocus(false)} sx={inputStyle}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Birth Date" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.birthDate} sx={inputStyle} InputLabelProps={{ shrink: true }}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarToday /></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Country" name="country" value={formData.country} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.country} sx={inputStyle}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><Public /></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="County" name="county" value={formData.county} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.county} sx={inputStyle}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><LocationCity /></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.city} sx={inputStyle}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><LocationCity /></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Street" name="street" value={formData.street} onChange={handleChange} 
                                        disabled={isReadOnly} error={validationErrors.street} sx={inputStyle}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><Home /></InputAdornment>) }}
                                    />
                                </Grid>
                            </Grid>

                            <Collapse in={!!errorMsgFirstCol}>
                                <Alert severity="error" sx={{ mb: 2 }}>{errorMsgFirstCol}</Alert>
                            </Collapse>
                            <Collapse in={isVisible}>
                                <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>
                            </Collapse>

                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                {isReadOnly ? (
                                    <Button variant="contained" startIcon={<Edit />} onClick={() => setIsReadOnly(false)} sx={buttonStyle} disabled={passwordsMatch}>
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="contained" startIcon={<Save />} onClick={submitInfo} sx={buttonStyle}>
                                            Save Changes
                                        </Button>
                                        <Button variant="outlined" startIcon={<Cancel />} onClick={() => { setIsReadOnly(true); setFormData(userData); setErrorMsgFirstCol(''); }} 
                                            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#ff4d4d', color: '#ff4d4d' } }}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        {/* COL 2: SECURITY */}
                        <Grid item xs={12} lg={5}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                backgroundColor: 'rgba(0,0,0,0.2)', 
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 4 
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Lock sx={{ color: '#ff4d4d', mr: 1, fontSize: 30 }} />
                                    <Typography variant="h5" fontWeight="bold">Security</Typography>
                                </Box>
                                <Divider sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                                <Typography variant="subtitle2" sx={{ mb: 1, color: themeColors.textSecondary }}>
                                    Current Password
                                </Typography>
                                <TextField fullWidth type="password" placeholder="Enter current password" 
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    disabled={!isReadOnly || passwordsMatch} sx={inputStyle}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }}
                                />
                                
                                {!passwordsMatch && (
                                    <Button fullWidth variant="contained" onClick={verifyPassword} 
                                        disabled={!isReadOnly || !password} sx={{ ...buttonStyle, mt: 1, mb: 2 }}>
                                        Verify to Change Password
                                    </Button>
                                )}
                                
                                <Collapse in={!!errorMsgSecondCol1}>
                                    <Alert severity="error" sx={{ mb: 2 }}>{errorMsgSecondCol1}</Alert>
                                </Collapse>

                                <Collapse in={passwordsMatch}>
                                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#ff4d4d' }}>Set New Password</Typography>
                                        
                                        <TextField fullWidth type="password" label="New Password" 
                                            value={newpassword} onChange={(e) => setnewPassword(e.target.value)} sx={inputStyle} 
                                            error={charErr || noNrErr || noUpperErr}
                                        />
                                        <Box sx={{ mb: 2, pl: 1 }}>
                                            <Typography variant="caption" display="block" color={charErr ? 'error' : 'textSecondary'}>• 8-16 characters</Typography>
                                            <Typography variant="caption" display="block" color={noNrErr ? 'error' : 'textSecondary'}>• At least one number</Typography>
                                            <Typography variant="caption" display="block" color={noUpperErr ? 'error' : 'textSecondary'}>• At least one uppercase letter</Typography>
                                        </Box>

                                        <TextField fullWidth type="password" label="Confirm Password" 
                                            value={cfnpassword} onChange={(e) => setcfnPassword(e.target.value)} sx={inputStyle}
                                            error={!!errorMsgSecondCol2} helperText={errorMsgSecondCol2}
                                        />

                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Button fullWidth variant="contained" onClick={changePassword} sx={buttonStyle}>
                                                Update
                                            </Button>
                                            <Button fullWidth variant="outlined" onClick={exitPasswordMode} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Box>
                                </Collapse>

                                <Collapse in={isVisible1}>
                                    <Alert severity="success" sx={{ mt: 2 }}>Password changed successfully!</Alert>
                                </Collapse>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </BackgroundWrapper>
    );
};

export default AccountDetails;