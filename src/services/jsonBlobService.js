export const jsonBlobService = {
    async createGroup(data) {
        try {
            const response = await fetch('https://jsonblob.com/api/jsonBlob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create group');
            }

            // Extract the ID from the Location header
            const location = response.headers.get('Location');
            if (!location) {
                throw new Error('No Location header in response');
            }

            // Extract the ID from the URL
            const blobId = location.split('/').pop();
            return blobId;
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    },

    async getGroup(blobId) {
        try {
            const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch group data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching group data:', error);
            throw error;
        }
    },

    async getExpenses(blobId) {
        try {
            const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            return data.expenses || [];
        } catch (error) {
            console.error('Error fetching expenses:', error);
            return [];
        }
    },

    async saveExpenses(expenses, blobId) {
        try {
            const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expenses }),
            });
            if (!response.ok) {
                throw new Error('Failed to save expenses');
            }
            return true;
        } catch (error) {
            console.error('Error saving expenses:', error);
            return false;
        }
    }
};