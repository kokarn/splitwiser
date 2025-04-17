import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 4,
                py: 3,
                px: 2,
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
            >
                {'© '}
                {new Date().getFullYear()}
                {' Splitwiser - Made with ❤️ by '}
                <Link
                    color="inherit"
                    href="https://github.com/kokarn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Kokarn
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;