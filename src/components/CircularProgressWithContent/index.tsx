import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, Typography } from '@material-ui/core';
import { FaAdn } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            "& .MuiCircularProgress-root": {
                position: "absolute",
                // Moving this a little off the edge prevents horizontal scrollbar from flickering in and out
                top: 2,
                left: 2,
            },
            // "& .MuiFab-sizeSmall": {
            //     position: "absolute",
            //     top: 9,
            //     right: 9
            // }
        },
        bottom: {
            color: "white",
        },
        top: {
            color: '#1a90ff',
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
        },
        circle: {
            strokeLinecap: 'round',
        },
    }),
);

export default function CircularProgressWithContent(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {props.content}
            <CircularProgress variant="determinate" size={46} thickness={2} value={100} className={classes.bottom} />
            <CircularProgress variant="determinate" size={46} thickness={2} value={24.7} className={classes.top} />
        </div>
    );
}