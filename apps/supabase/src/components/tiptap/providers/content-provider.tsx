"use client"
import { SetStateAction, createContext, useContext, useEffect, useState } from "react";

type TContentContextProvider = {
    content: string;
    setContent: React.Dispatch<SetStateAction<string>>
}

const ContentContext = createContext<TContentContextProvider>({
    content: "<p></p>",
    setContent: () => {}
});

export const ContentProvider = ({
    children,
    feed
}: {
    children: React.ReactNode,
    feed:Feed_Detail
}) => {
    const [content, setContent] = useState<string>(feed?.content ?? "<p></p>");

    return (
        <ContentContext.Provider 
            value={{content, setContent}}
        >
            {children}
        </ContentContext.Provider>
    )
}

export const useContentTiptap = () => {
    return useContext(ContentContext);
}