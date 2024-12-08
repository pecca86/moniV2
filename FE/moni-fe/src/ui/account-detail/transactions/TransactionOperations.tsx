import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

const TransactionOperations = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sort, setSort] = useState('date');

    const handleFilter = (filterValue: string) => {
        searchParams.set('filter', filterValue);
        setSearchParams(searchParams);
    }

    const handleChange = (event: SelectChangeEvent) => {
        setSort(event.target.value);
        searchParams.set('sort', event.target.value);
        setSearchParams(searchParams);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        // create a delay before evaluating the search query
        // this way we can avoid making a request on every keystroke
        // and only make a request when the user has stopped typing
        // for a certain amount of time
        const delay = 500;
        setTimeout(() => {
            searchParams.set('search', event.target.value);
            setSearchParams(searchParams);
        }, delay);

        // searchParams.set('search', event.target.value);
        // setSearchParams(searchParams);
        // console.log(event.target.value);
    }

    return (
        <>
            <div className='p-2 mt-2 flex gap-2 justify-between'>
                <div>
                    <FormControl>
                        <InputLabel id="demo-simple-select-helper-label">Sort by</InputLabel>
                        <Select
                            value={sort}
                            onChange={handleChange}
                            defaultValue="date"
                            label="Sort by"
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value={'date'}>Date</MenuItem>
                            <MenuItem value={'sum'}>Sum</MenuItem>
                            <MenuItem value={'category'}>Category</MenuItem>
                            <MenuItem value={'type'}>Type</MenuItem>
                            <MenuItem value={'description'}>Description</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button
                            sx={{
                                backgroundColor: '#d8b4fe',
                                '&:hover': {
                                    backgroundColor: '#a855f7'
                                }
                            }}
                            onClick={() => handleFilter('all')}>All</Button>
                        <Button
                            sx={{
                                backgroundColor: '#d8b4fe',
                                '&:hover': {
                                    backgroundColor: '#a855f7'
                                }
                            }}
                            onClick={() => handleFilter('deposit')}>Income</Button>
                        <Button
                            sx={{
                                backgroundColor: '#d8b4fe',
                                '&:hover': {
                                    backgroundColor: '#a855f7'
                                }
                            }}
                            onClick={() => handleFilter('withdrawal')}>Expense</Button>
                    </ButtonGroup>
                </div>
            </div>
            <TextField onChange={handleSearch} id="standard-basic" label="Search by description" variant="standard" />
        </>

    );
}

export default TransactionOperations;
