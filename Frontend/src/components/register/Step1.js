import React, { useEffect, useState } from 'react';
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
  InputAdornment, 
  Collapse,
  Alert
} from '@mui/material';
import { 
  Person, 
  Email, 
  Lock, 
  Badge,
  ArrowForward,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

// --- STILURI ---
const themeColors = {
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.75)',
    border: 'rgba(255, 255, 255, 0.1)',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    success: '#4caf50',
    error: '#f44336'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        borderRadius: '12px',
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
    padding: '12px 30px',
    borderRadius: '12px',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 90%, 50%) 100%)',
        boxShadow: '0 6px 20px rgba(255, 0, 0, 0.2)',
    }
};

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
        padding: 2
    }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>{children}</Box>
    </Box>
);

const Step1 = ({ formData, setFormData, nextStep }) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    // --- Aici am șters emailOnFocus --- 
    const [arontErr, setArontErr] = useState(false);
    const [finishErr, setFinishErr] = useState(false);
    const [emailLenErr, setEmailLenErr] = useState(false);

    const [pwdOnFocus, setPwdOnFocus] = useState(false); // Pe acesta îl păstrăm pentru lista de cerințe parolă
    const [charErr, setCharErr] = useState(false);
    const [noNrErr, setNoNrErr] = useState(false);
    const [noUpperErr, setNoUpperErr] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const doNextStep = () => {
        const { name, surname, email, password, confirmPassword } = formData;
        
        if (!name || !surname || !email || !password) {
            setErrorMessage('You need to complete all the fields!');
            return;
        } else if (charErr || noNrErr || noUpperErr || arontErr || finishErr || emailLenErr) {
            setErrorMessage('Please fix the errors in red before proceeding.');
            return;
        } else if (!confirmPassword) {
            setErrorMessage("You need to confirm the password!");
            return;
        } else if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        } else if (emailError) {
            return;
        }
        
        setErrorMessage('');
        nextStep();
    };

    useEffect(() => {
        const { name, surname, email, password, confirmPassword } = formData;
        if (name && surname && email && password && confirmPassword) {
            setErrorMessage('');
        }
    }, [formData]);

    useEffect(() => {
        if (formData.email) {
            let ok = true;
            if (formData.email.length <= 6) {
                setEmailLenErr(true); ok = false;
            } else setEmailLenErr(false);

            if (!formData.email.includes("@")) {
                setArontErr(true); ok = false;
            } else setArontErr(false);

            const suffix = formData.email.slice(-4);
            const suffixRo = formData.email.slice(-3);
            if (!suffix.includes(".com") && !suffixRo.includes(".ro")) {
                setFinishErr(true); ok = false;
            } else setFinishErr(false);

            if (!ok) return;

            const checkEmail = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/check-email`, {
                        params: { email: formData.email }
                    });
                    if (response.data) {
                        setEmailError('Email already exists');
                    } else {
                        setEmailError('');
                    }
                } catch (error) {
                    console.error('Error checking email:', error);
                }
            };
            checkEmail();

        } else {
            setEmailError('');
        }
    }, [formData.email]);

    useEffect(() => {
        if (formData.password) {
            setCharErr(formData.password.length < 8 || formData.password.length > 16);
            setNoNrErr(!/\d/.test(formData.password));
            setNoUpperErr(formData.password.toLowerCase() === formData.password);
        } else {
            setCharErr(false);
            setNoNrErr(false);
            setNoUpperErr(false);
        }
    }, [formData.password]);

    const getEmailHelperText = () => {
        if (arontErr) return "Email must contain @";
        if (finishErr) return "Email must finish with .com or .ro";
        if (emailLenErr) return "Email must have at least 10 letters";
        if (emailError) return emailError;
        // Afișăm succesul mereu dacă e valid, indiferent de focus
        if (formData.email && !emailError && !arontErr && !finishErr && !emailLenErr) {
            return <span style={{ color: themeColors.success, display: 'flex', alignItems: 'center' }}><CheckCircle fontSize="small" sx={{ mr: 0.5 }} /> Email valid and available</span>;
        }
        return "";
    };

    const PasswordRequirement = ({ met, text }) => (
        <Typography variant="caption" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: met ? themeColors.success : (pwdOnFocus ? themeColors.error : themeColors.textSecondary),
            mt: 0.5
        }}>
            {met ? <CheckCircle fontSize="inherit" sx={{ mr: 1 }} /> : <Cancel fontSize="inherit" sx={{ mr: 1 }} />}
            {text}
        </Typography>
    );

    return (
        <BackgroundWrapper>
            <Container maxWidth="sm">
                <Paper elevation={24} sx={{
                    backgroundColor: themeColors.glass,
                    backdropFilter: 'blur(16px)',
                    borderRadius: 4,
                    border: `1px solid ${themeColors.border}`,
                    padding: { xs: 3, md: 5 },
                    color: 'white'
                }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="overline" sx={{ color: '#ff4d4d', letterSpacing: 2 }}>
                            Step 1 of 2
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            Create Account
                        </Typography>
                    </Box>

                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Badge /></InputAdornment>) }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    // Aici am scos onFocus și onBlur
                                    sx={inputStyle}
                                    error={!!emailError || arontErr || finishErr || emailLenErr}
                                    helperText={getEmailHelperText()}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setPwdOnFocus(true)}
                                    onBlur={() => setPwdOnFocus(false)}
                                    sx={{ ...inputStyle, mb: 1 }}
                                    error={charErr || noNrErr || noUpperErr}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }}
                                />
                                {formData.password && (
                                    <Box sx={{ ml: 1, mb: 2 }}>
                                        <PasswordRequirement met={!charErr} text="8 - 16 characters" />
                                        <PasswordRequirement met={!noNrErr} text="At least one number" />
                                        <PasswordRequirement met={!noUpperErr} text="At least one uppercase letter" />
                                    </Box>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                                    helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }}
                                />
                            </Grid>
                        </Grid>

                        <Collapse in={!!errorMessage}>
                            <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                                {errorMessage}
                            </Alert>
                        </Collapse>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                onClick={doNextStep}
                                variant="contained"
                                endIcon={<ArrowForward />}
                                sx={buttonStyle}
                            >
                                Next Step
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </BackgroundWrapper>
    );
};

export default Step1;