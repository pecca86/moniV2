import { createContext, useContext, useReducer } from "react";

type InitialState ={
    selections: number[],
    dispatch: React.Dispatch<any>;
}

const TransactionSelectionContext = createContext<InitialState | undefined>(undefined);

const initialState: InitialState = {
    selections: [],
    dispatch: () => {},
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case "ADD":
            return {
                ...state,
                selections: state.selections.concat(action.payload),
            };
        case "REMOVE":
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

type props = {
    children: React.ReactNode;
};

function TransactionSelectionProvider({ children }: props) {
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