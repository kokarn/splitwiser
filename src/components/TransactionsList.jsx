import React from 'react';
import PropTypes from 'prop-types';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const TransactionsList = ({ transactions }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                backgroundColor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                }}
            >
                <TrendingUpIcon color="primary" />
                <Typography
                    variant="h5"
                    color="primary"
                >
                    How to settle up
                </Typography>
            </Box>
            <List sx={{ p: 0 }}>
                {transactions.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 2 }}
                    >
                        No transactions to show. Add expenses to see who owes what!
                    </Typography>
                ) : (
                    transactions.map((transaction, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                backgroundColor: 'background.default',
                                mb: 1,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:last-child': {
                                    mb: 0,
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Chip
                                            label={transaction.from}
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                        <Typography variant="body1">
                                            should pay
                                        </Typography>
                                        <Chip
                                            label={formatCurrency(parseFloat(transaction.amount))}
                                            color="primary"
                                            size="small"
                                        />
                                        <Typography variant="body1">
                                            to
                                        </Typography>
                                        <Chip
                                            label={transaction.to}
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
};

TransactionsList.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            from: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
            amount: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default TransactionsList;