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
import DocumentHead from './components/DocumentHead';
import { jsonBlobService } from './services/jsonBlobService';

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
    const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

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
        groupData?.participants?.forEach((participant) => {
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

    const getBackgroundImage = () => {
        return groupData?.background || null;
    };

    const backgroundStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e6f3ff',
        backgroundImage: `
            linear-gradient(rgba(230, 243, 255, 0.7), rgba(230, 243, 255, 0.7)),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
        `,
        zIndex: 0,
        '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: groupData?.background ? `url(${groupData.background})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: isBackgroundLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: 1
        },
        '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2
        }
    };

    useEffect(() => {
        const img = new Image();
        img.src = getBackgroundImage();
        img.onload = () => {
            setIsBackgroundLoaded(true);
        };
    }, [groupData?.background]);

    const renderLandingPage = () => (
        <>
            <DocumentHead
                title="Splitwiser - Create a New Group"
                description="Create a new expense sharing group and start splitting costs with friends and family."
            />
            <Box sx={backgroundStyles} />
            <Container sx={{ position: 'relative', zIndex: 2 }}>
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
        </>
    );

    const renderGroupPage = () => (
        <>
            <DocumentHead
                title={`${groupData?.name || 'Group'} - Splitwiser`}
                description={`Manage expenses and split costs with ${groupData?.participants?.length || 0} participants in your group.`}
            />
            <Box sx={backgroundStyles} />
            <Container sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ mb: 4, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Logo variant="h4" />
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
        </>
    );

    return !blobId ? renderLandingPage() : renderGroupPage();
};

export default App;
