import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
    CircularProgress
} from '@mui/material';

const ExpensesList = ({ expenses, handleRemoveExpense, isLoading }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
            }}
        >
            <Typography
                gutterBottom
                variant = 'h5'
            >
                {'Expenses'}
            </Typography>
            <List>
                {isLoading
                    ? (
                    <Box
                        display = 'flex'
                        justifyContent="center"
                        alignItems="center"
                        minHeight={200}
                    >
                        <CircularProgress />
                    </Box>
                ) : expenses.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="textSecondary"
                    >
                        No expenses added yet. Start by adding a new expense!
                    </Typography>
                ) : (
                    expenses.map((expense, index) => (
                        <ListItem
                            key={index}
                            divider
                        >
                            <ListItemText
                                primary={`${expense.description} - ${expense.amount} SEK`}
                                secondary={
                                    <Box component="span">
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            display="block"
                                        >
                                            Paid by: {expense.payer}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            display="block"
                                        >
                                            Split between: {expense.participants.join(', ')}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleRemoveExpense(index)}
                            >
                                Remove
                            </Button>
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default ExpensesList;