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
                <AccountBalanceIcon color="primary" />
                <Typography
                    variant="h5"
                    color="primary"
                >
                    Total Paid
                </Typography>
            </Box>
            <Box>
                {Object.entries(totalPaid).map(([person, amount]) => (
                    <Box
                        key={person}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                            p: 1,
                            backgroundColor: 'background.default',
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body1">
                            {person}
                        </Typography>
                        <Chip
                            label={formatCurrency(amount)}
                            color="primary"
                            size="small"
                        />
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