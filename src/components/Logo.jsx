import React from 'react';
import { Typography } from '@mui/material';

const Logo = ({ variant = 'h2', onClick }) => {
    return (
        <Typography
            variant={variant}
            onClick={onClick}
            sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    opacity: onClick ? 0.8 : 1
                }
            }}
        >
            Splitwiser
        </Typography>
    );
};

export default Logo;