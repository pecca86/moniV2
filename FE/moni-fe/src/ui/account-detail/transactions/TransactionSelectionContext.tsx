import { createContext, useContext, useReducer } from "react";

const TransactionSelectionContext = createContext();

const initialState = {
    selections: [],
};

function reducer(state, action) {
    switch (action.type) {
        case "ADD":
            console.log("ADDED SELECTION: ", state.selections);
            return {
                ...state,
                selections: state.selections.concat(action.payload),
            };
        case "REMOVE":
            console.log("REMOVED SELECTION: ", state.selections);
            return {
                ...state,
                selections: state.selections.filter((id: number) => id !== action.payload),
            };
        case "RESET":
            return { ...initialState };
        default:
            throw new Error("Action unkonwn");
    }
}

function TransactionSelectionProvider({ children }) {
    const [
        { selections },
        dispatch,
    ] = useReducer(reducer, initialState);

    return (
        <TransactionSelectionContext.Provider
            value={{
                selections,
                dispatch,
            }}
        >
            {children}
        </TransactionSelectionContext.Provider>
    );
}

function useSelection() {
    const context = useContext(TransactionSelectionContext);
    if (context === undefined)
        throw new Error("TransactionSelectionContext was used outside of the TransactionSelectionProvider");
    return context;
}

export { TransactionSelectionProvider, useSelection };