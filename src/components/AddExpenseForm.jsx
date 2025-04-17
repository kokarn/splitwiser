import React from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Paper,
    Badge
} from '@mui/material';
import Avatar from './Avatar';

const AddExpenseForm = ({
    newExpense,
    setNewExpense,
    participantsList = [],
    payer,
    setPayer,
    handleParticipantChange,
    handleAddExpense,
    calculateBalances
}) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
            >
                Add New Expense
            </Typography>
            <Box
                sx={{
                    width: '100%'
                }}
            >
                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({
                        ...newExpense,
                        description: e.target.value
                    })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Amount (SEK)"
                    type="number"
                    variant="outlined"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({
                        ...newExpense,
                        amount: e.target.value
                    })}
                    sx={{ mb: 2 }}
                />
                <Typography
                    variant="subtitle1"
                    gutterBottom
                >
                    Select Participants:
                </Typography>
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    {participantsList.map((participant) => (
                        <Grid
                            key={participant}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={newExpense.participants.includes(participant) ? "✓" : null}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: 'success.main',
                                        color: 'white',
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        fontSize: '0.75rem'
                                    }
                                }}
                            >
                                <Box
                                    onClick={() => handleParticipantChange(participant)}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <Avatar
                                        name={participant}
                                        size="medium"
                                    />
                                </Box>
                            </Badge>
                            <Typography
                                variant="caption"
                                align="center"
                                sx={{ width: '100%' }}
                            >
                                {participant}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                >
                    Select Payer:
                </Typography>
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    {participantsList.map((participant) => (
                        <Grid
                            key={participant}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={payer === participant ? "✓" : null}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: 'success.main',
                                        color: 'white',
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        fontSize: '0.75rem'
                                    }
                                }}
                            >
                                <Box
                                    onClick={() => setPayer(participant)}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <Avatar
                                        name={participant}
                                        size="medium"
                                    />
                                </Box>
                            </Badge>
                            <Typography
                                variant="caption"
                                align="center"
                                sx={{ width: '100%' }}
                            >
                                {participant}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddExpense}
                            fullWidth
                        >
                            Add Expense
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default AddExpenseForm;