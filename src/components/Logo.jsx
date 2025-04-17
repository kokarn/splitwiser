import React from 'react';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Logo = ({ variant = 'h2' }) => {
    return (
        <Link
            component={RouterLink}
            to="/"
            sx={{
                textDecoration: 'none',
                '&:hover': {
                    opacity: 0.8
                }
            }}
        >
            <Typography
                variant={variant}
                sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Splitwiser
            </Typography>
        </Link>
    );
};

export default Logo;