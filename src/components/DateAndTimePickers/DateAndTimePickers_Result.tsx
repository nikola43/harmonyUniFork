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
            width: 'fit-content', // Set width to 100% of parent component
            '& .MuiInputBase-root': {
                fontSize: "14px",
                color: 'white', // Change text color
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
        },

    }),
);


export default function DateAndTimePickersResult() {
    const classes = useStyles();

    return (
        <form className={classes.container} noValidate>
            <TextField
                id="datetime-local"
                label="in 7 days"
                type="datetime-local"
                defaultValue="2024-05-24T10:30"
                className={classes.textField}
                InputLabelProps={{
                    style: { fontSize: "20px", fontWeight: "bold", color: 'white' }, // Change the color of the label text
                    shrink: true,
                }}
                // InputProps={{
                //     style: { fontSize: '1rem' },
                //     endAdornment: (
                //         <Calendar style={{ color: '#ffffff' }} /> // Replace with your desired icon component
                //     ),
                // }}
                style={{ width: "fit-content" }}
            />
        </form>
    );
}