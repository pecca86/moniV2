import { useState, cloneElement } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 480,
    maxWidth: 'calc(100vw - 32px)',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    p: 0,
    overflow: 'hidden',
    outline: 'none',
};

function resolveButtonClass(ctaStyle: string): string {
    if (ctaStyle.trim() === 'hidden' || ctaStyle.startsWith('hidden')) return 'hidden';
    if (ctaStyle.includes('hidden') && !ctaStyle.includes('bg-')) return 'hidden';
    if (ctaStyle.includes('red')) return 'stripe-btn-danger';
    if (ctaStyle.includes('yellow') || ctaStyle.includes('amber')) return 'stripe-btn-warning';
    if (ctaStyle === 'secondary') return 'stripe-btn-secondary';
    return 'stripe-btn-primary';
}

const AddModal = ({
    ctaText, heading, paragraph, form, buttonIcon, ctaStyle = 'primary'
}: {
    ctaText: string;
    heading: string;
    paragraph: string;
    form: any;
    buttonIcon: any;
    ctaStyle?: string;
}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const clonedForm = cloneElement(form, { handleClose });
    const btnClass = resolveButtonClass(ctaStyle);

    if (btnClass === 'hidden') return null;

    return (
        <>
            <button className={btnClass} onClick={handleOpen}>
                {buttonIcon}
                {ctaText && <span>{ctaText}</span>}
            </button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="px-6 pt-6 pb-4 border-b border-[#E3E8EF]">
                        <h2 className="text-base font-semibold text-[#1A1F36]">{heading}</h2>
                        {paragraph && <p className="text-sm text-[#697386] mt-1">{paragraph}</p>}
                    </div>
                    <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        {clonedForm}
                    </div>
                    <div className="px-6 pb-5">
                        <button onClick={handleClose} className="stripe-btn-secondary text-xs py-1.5 px-3">
                            Close
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default AddModal;
