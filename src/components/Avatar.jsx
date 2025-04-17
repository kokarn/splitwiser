import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import PropTypes from 'prop-types';

const getGradientColors = (name) => {
    // Create a hash of the name to get consistent colors
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Define a set of beautiful gradient combinations
    const gradients = [
        ['#FF6B6B', '#FFE66D'], // Warm sunset
        ['#4ECDC4', '#45B7D1'], // Ocean breeze
        ['#A78BFA', '#818CF8'], // Purple dream
        ['#F472B6', '#FB7185'], // Pink passion
        ['#34D399', '#6EE7B7'], // Emerald forest
        ['#FBBF24', '#FCD34D'], // Golden hour
        ['#60A5FA', '#93C5FD'], // Sky blue
        ['#F87171', '#FCA5A5'], // Coral reef
        ['#8B5CF6', '#A78BFA'], // Deep purple
        ['#10B981', '#34D399'], // Forest green
        ['#F59E0B', '#FBBF24'], // Amber
        ['#3B82F6', '#60A5FA'], // Royal blue
    ];

    // Use the hash to select a gradient
    const gradientIndex = Math.abs(hash) % gradients.length;
    return gradients[gradientIndex];
};

const Avatar = ({ name, size = 'medium' }) => {
    const [startColor, endColor] = getGradientColors(name);
    const sizeMap = {
        small: 32,
        medium: 40,
        large: 48
    };

    return (
        <MuiAvatar
            sx={{
                width: sizeMap[size],
                height: sizeMap[size],
                background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: size === 'small' ? '0.875rem' : '1.25rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)'
                }
            }}
        >
            {name.charAt(0).toUpperCase()}
        </MuiAvatar>
    );
};

Avatar.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Avatar;