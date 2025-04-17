import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Box,
    Typography,
    Chip,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { jsonBlobService } from '../services/jsonBlobService';

const CreateGroupForm = ({ onCreate }) => {
    const [groupName, setGroupName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [newParticipant, setNewParticipant] = useState('');

    const handleAddParticipant = () => {
        if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    const handleRemoveParticipant = (participantToRemove) => {
        setParticipants(participants.filter(p => p !== participantToRemove));
    };

    const handleCreate = async () => {
        if (!groupName.trim() || participants.length === 0) return;

        try {
            const blobId = await jsonBlobService.createGroup({
                name: groupName.trim(),
                participants: participants,
                expenses: []
            });
            onCreate(blobId);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                maxWidth: 400,
                mx: 'auto'
            }}
        >
            <Typography variant="h6" gutterBottom>
                Create New Group
            </Typography>

            <TextField
                fullWidth
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Participants
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                        fullWidth
                        label="Add Participant"
                        value={newParticipant}
                        onChange={(e) => setNewParticipant(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleAddParticipant}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {participants.map((participant) => (
                        <Chip
                            key={participant}
                            label={participant}
                            onDelete={() => handleRemoveParticipant(participant)}
                            deleteIcon={<DeleteIcon />}
                        />
                    ))}
                </Box>
            </Box>

            <Button
                fullWidth
                variant="contained"
                onClick={handleCreate}
                disabled={!groupName.trim() || participants.length === 0}
            >
                Create Group
            </Button>
        </Paper>
    );
};

export default CreateGroupForm;