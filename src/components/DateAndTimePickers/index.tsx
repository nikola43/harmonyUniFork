import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%'
        },
        textField: {
            // marginLeft: theme.spacing(1),
            // marginRight: theme.spacing(1),
            width: '100%', // Set width to 100% of parent component
            '& .MuiInputBase-root': {
                color: 'white', // Change text color
                fontWeight: "bold",
                '&:hover': {
                    '&:before': {
                        borderBottom: 'none', // Remove underline when hovering
                    },
                },
                '&:before': {
                    borderBottom: 'none', // Remove underline
                },
                '&:after': {
                    borderBottom: 'none', // Remove underline when focused
                },
            },
            "& .MuiButtonBase-root": {
                color: '#ffffff',
            },
            "& .MuiInput-icon": {
                color: '#ffffff'
            },
            "& .MuiSelect-icon": {
                color: '#ffffff'
            },
            "& .MuiInputBase": {
                color: '#ffffff'
            },

        },

    }),
);

export default function DateAndTimePickers() {
    const classes = useStyles();
    const defaultDate = new Date(Date.now() + 30 * 86400000).toLocaleString('sv').slice(0, -3)
    return (
        <form className={classes.container} noValidate>
            <TextField
                type="datetime-local"
                defaultValue={defaultDate}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ width: '100%' }}
            />
        </form>
    );
}