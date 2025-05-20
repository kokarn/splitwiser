import React from 'react';
import PropTypes from 'prop-types';
import {
    Paper,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const TotalPaidList = ({ expenses }) => {
    // Calculate total paid by each person
    const totalPaid = {};

    expenses.forEach((expense) => {
        if (!totalPaid[expense.payer]) {
            totalPaid[expense.payer] = 0;
        }
        totalPaid[expense.payer] = totalPaid[expense.payer] + parseFloat(expense.amount);
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('sv-SE', {
            currency: 'SEK',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
        }).format(amount);
    };

    // Calculate total amount
    const totalAmount = Object.values(totalPaid).reduce((sum, amount) => sum + amount, 0);

    // Convert to array and sort by amount (low to high)
    const sortedPayments = Object.entries(totalPaid)
        .map(([person, amount]) => ({
            amount,
            person,
            percentage: (amount / totalAmount) * 100,
        }))
        .sort((a, b) => a.amount - b.amount);

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
                    justifyContent: 'space-between',
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <AccountBalanceIcon color="primary" />
                    <Typography
                        variant="h5"
                        color="primary"
                    >
                        Total Paid
                    </Typography>
                </Box>
                <Chip
                    label={formatCurrency(totalAmount)}
                    color="primary"
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {sortedPayments.map(({ person, amount, percentage }) => (
                    <Box
                        key={person}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body1">
                                {person}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {percentage.toFixed(1)}%
                                </Typography>
                                <Chip
                                    label={formatCurrency(amount)}
                                    color="primary"
                                    size="small"
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                height: 24,
                                width: '100%',
                                backgroundColor: 'background.default',
                                borderRadius: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    width: `${percentage}%`,
                                    backgroundColor: 'primary.main',
                                    transition: 'width 0.5s ease-in-out',
                                }}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

TotalPaidList.propTypes = {
    expenses: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string.isRequired,
            amount: PropTypes.string.isRequired,
            payer: PropTypes.string.isRequired,
            participants: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
};

export default TotalPaidList;