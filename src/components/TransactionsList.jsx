import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

const TransactionsList = ({ transactions }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                width: '100%'
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
            >
                Transactions
            </Typography>
            <List>
                {transactions.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="textSecondary"
                    >
                        No transactions to show. Add expenses to see who owes what!
                    </Typography>
                ) : (
                    transactions.map((transaction, index) => (
                        <ListItem
                            key={index}
                            divider
                            sx={{
                                backgroundColor: '#f5f5f5',
                                mb: 1,
                                borderRadius: 1
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1">
                                        {transaction.from} should pay {transaction.amount} SEK to {transaction.to}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default TransactionsList;