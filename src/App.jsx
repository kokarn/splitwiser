import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Paper
} from '@mui/material';
import AddExpenseForm from './components/AddExpenseForm';
import ExpensesList from './components/ExpensesList';
import TransactionsList from './components/TransactionsList';
import Footer from './components/Footer';
import Logo from './components/Logo';
import CreateGroupForm from './components/CreateGroupForm';
import { jsonBlobService } from './services/jsonBlobService';

const participantsList = [
    { name: 'Proos', color: '#f44336' },
    { name: 'Kokarn', color: '#2196f3' },
    { name: 'Gyran', color: '#4caf50' },
    { name: 'Matzy', color: '#ff9800' },
    { name: 'Gabe', color: '#9c27b0' },
];

const App = () => {
    const pathId = window.location.pathname.slice(1);
    const [blobId, setBlobId] = useState(pathId);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [groupData, setGroupData] = useState(null);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        participants: []
    });
    const [payer, setPayer] = useState('');
    const [transactions, setTransactions] = useState([]);

    const handleGroupCreate = (newBlobId) => {
        window.history.pushState({}, '', `/${newBlobId}`);
        setBlobId(newBlobId);
    };

    useEffect(() => {
        const loadData = async () => {
            if (!blobId) return;

            setIsLoading(true);
            try {
                const data = await jsonBlobService.getGroup(blobId);
                setGroupData(data);
                setExpenses(data.expenses || []);
                setNewExpense(prev => ({
                    ...prev,
                    participants: data.participants || []
                }));
            } catch (error) {
                console.error('Error loading group data:', error);
            }
            setIsLoading(false);
        };
        loadData();
    }, [blobId]);

    useEffect(() => {
        if (blobId) {
            calculateBalances();
        }
    }, [expenses]);

    const calculateBalances = () => {
        const balances = {};

        // Initialize balances for all participants
        participantsList.forEach((participant) => {
            balances[participant.name] = 0;
        });

        // Calculate net balances
        expenses.forEach((expense) => {
            const amountPerParticipant = parseFloat(expense.amount) / expense.participants.length;

            // Add the full amount to payer's balance (they are owed this money)
            balances[expense.payer] += parseFloat(expense.amount);

            // Subtract each participant's share (they owe this money)
            expense.participants.forEach((participant) => {
                balances[participant] -= amountPerParticipant;
            });
        });

        // Simplify debts
        const creditors = [];
        const debtors = [];

        Object.entries(balances).forEach(([participant, balance]) => {
            if (balance > 0) {
                creditors.push({ participant, balance });
            } else if (balance < 0) {
                debtors.push({ participant, balance: -balance });
            }
        });

        // Sort creditors and debtors by amount (largest first)
        creditors.sort((a, b) => b.balance - a.balance);
        debtors.sort((a, b) => b.balance - a.balance);

        const transactions = [];

        while (creditors.length > 0 && debtors.length > 0) {
            const creditor = creditors[0];
            const debtor = debtors[0];

            const amount = Math.min(creditor.balance, debtor.balance);

            transactions.push({
                from: debtor.participant,
                to: creditor.participant,
                amount: Math.floor(amount).toString(),
            });

            creditor.balance -= amount;
            debtor.balance -= amount;

            if (creditor.balance === 0) creditors.shift();
            if (debtor.balance === 0) debtors.shift();
        }

        setTransactions(transactions);
    };

    const handleAddExpense = async () => {
        if (!newExpense.description || !newExpense.amount || !payer) return;

        const updatedExpenses = [...expenses, { ...newExpense, payer }];
        setExpenses(updatedExpenses);
        await jsonBlobService.saveExpenses(updatedExpenses, blobId);
        setNewExpense({
            description: '',
            amount: '',
            participants: []
        });
        setPayer('');
    };

    const handleRemoveExpense = async (indexToRemove) => {
        const updatedExpenses = expenses.filter((_, index) => index !== indexToRemove);
        setExpenses(updatedExpenses);
        await jsonBlobService.saveExpenses(updatedExpenses, blobId);
    };

    const handleParticipantChange = (participant) => {
        setNewExpense((prevExpense) => {
            const isSelected = prevExpense.participants.includes(participant);
            const updatedParticipants = isSelected
                ? prevExpense.participants.filter((p) => p !== participant)
                : [...prevExpense.participants, participant];
            return { ...prevExpense, participants: updatedParticipants };
        });
    };

    const renderLandingPage = () => (
        <Container>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                }}
            >
                <Logo />
                <CreateGroupForm onCreate={handleGroupCreate} />
            </Box>
        </Container>
    );

    const renderGroupPage = () => (
        <Container>
            <Box sx={{ mb: 4, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Logo
                        variant="h4"
                        onClick={() => window.location.href = '/'}
                    />
                    {groupData && (
                        <>
                            <Box sx={{
                                width: '2px',
                                height: '24px',
                                bgcolor: 'divider',
                                borderRadius: '1px'
                            }} />
                            <Typography variant="h6" color="text.secondary">
                                {groupData.name}
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>

            <Grid
                container
                spacing={2}
            >
                <Grid size={{
                    xs: 12,
                    md: 6
                }}>
                    <AddExpenseForm
                        newExpense={newExpense}
                        setNewExpense={setNewExpense}
                        participantsList={groupData?.participants || []}
                        payer={payer}
                        setPayer={setPayer}
                        handleParticipantChange={handleParticipantChange}
                        handleAddExpense={handleAddExpense}
                        calculateBalances={calculateBalances}
                    />
                </Grid>

                <Grid size={{
                    xs: 12,
                    md: 6
                }}>
                    <ExpensesList
                        expenses={expenses}
                        handleRemoveExpense={handleRemoveExpense}
                        isLoading={isLoading}
                    />
                </Grid>

                <Grid size={12}>
                    <TransactionsList
                        transactions={transactions}
                    />
                </Grid>
            </Grid>
            <Footer />
        </Container>
    );

    return !blobId ? renderLandingPage() : renderGroupPage();
};

export default App;
