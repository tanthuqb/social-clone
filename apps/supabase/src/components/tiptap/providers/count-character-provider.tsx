"use clinet"
import { SetStateAction, createContext, useContext, useState } from "react";

type TCountCharactersContextProvider = {
    countCharacters: number;
    setCountCharacters: React.Dispatch<SetStateAction<number>>
}

const CountCharactersContext = createContext<TCountCharactersContextProvider>({
    countCharacters: 0,
    setCountCharacters:() => {}
});

export const CountCharactersProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [countCharacters, setCountCharacters] = useState<number>(0);

    return (
        <CountCharactersContext.Provider 
            value={{countCharacters, setCountCharacters}}
        >
            {children}
        </CountCharactersContext.Provider>
    )
}

export const useCountCharacters = () => {
    const context = useContext(CountCharactersContext);
    return context;
}