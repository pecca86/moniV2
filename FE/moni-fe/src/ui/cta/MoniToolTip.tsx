import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useState } from 'react';

const MoniToolTip = ({ text, icon }: { text: string, icon: any }) => {
    const [open, setOpen] = useState(false);
    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip PopperProps={{
                disablePortal: true,
            }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={text}>
                <IconButton color={'warning'} onClick={handleTooltipOpen}>
                    {icon}
                </IconButton>
            </Tooltip>
        </ClickAwayListener>
    );
}

export default MoniToolTip;
