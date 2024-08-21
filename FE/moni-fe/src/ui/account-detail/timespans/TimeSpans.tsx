import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TransactionList from '../TransactionList';

const TimeSpans = () => {
    return (
        <div className='pt-2 pr-2'>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <div className='flex gap-2'>
                        <span>12.8.2023 - 12.8.2024</span> <span>140 €</span> <span>Delete</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {/* TODO: Make a info panel component here */}
                    <div className='flex flex-col gap-1 mb-1'>
                        <span>Incomes: 400€</span>
                        <span>Spendings: -100€</span>
                        <span>With current balance: 300€</span>
                    </div>
                    <TransactionList />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <div className='flex gap-2'>
                        <span>12.8.2023 - 12.8.2024</span> <span>1430 €</span> <span>Delete</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {/* TODO: Make a info panel component here */}
                    <div className='flex flex-col gap-1 mb-1'>
                        <span>Incomes: 400€</span>
                        <span>Spendings: -100€</span>
                        <span>With current balance: 300€</span>
                    </div>
                    <TransactionList />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <div className='flex gap-2'>
                        <span>12.8.2023 - 12.8.2024</span> <span>1240 €</span> <span>Delete</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {/* TODO: Make a info panel component here */}
                    <div className='flex flex-col gap-1 mb-1'>
                        <span>Incomes: 400€</span>
                        <span>Spendings: -100€</span>
                        <span>With current balance: 300€</span>
                    </div>
                    <TransactionList />
                </AccordionDetails>
                <AccordionActions>
                    <Button>Cancel</Button>
                    <Button>Agree</Button>
                </AccordionActions>
            </Accordion>
        </div>
    );
}

export default TimeSpans;
