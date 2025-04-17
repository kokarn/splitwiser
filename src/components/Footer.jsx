import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 8,
                py: 4,
                px: 2,
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    maxWidth: '600px',
                    mx: 'auto',
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    {'© '}
                    {new Date().getFullYear()}
                    {' Splitwiser'}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    {'Made with ❤️ by '}
                    <Link
                        href="https://github.com/kokarn"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Kokarn
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;