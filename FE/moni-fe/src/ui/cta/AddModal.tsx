import { useState, cloneElement } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Backdrop } from '@mui/material';

const AddModal = ({ ctaText, heading, paragraph, form }: { ctaText: string, heading: string, paragraph: string, form: any }) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '0px solid #000',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
    };

    // allows us to pass props to the form component
    const clonedForm = cloneElement(form, { handleClose: handleClose });

    // TODO: Remove the margins from the button and let the parent component handle the margins

    return (
        <>
            <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' onClick={handleOpen}>
                {ctaText}
            </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className='mb-4'
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" className='pb-2'>
                            {heading}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} className='pb-10'>
                            {paragraph}
                        </Typography>
                        {clonedForm}
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Modal>
        </>
    );
}

export default AddModal;
