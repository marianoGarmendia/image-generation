import { createContext, useContext, useState, Dispatch, SetStateAction} from 'react';

interface ContentContextType {
    content: any;
    loading: boolean;
    setContent: Dispatch<SetStateAction<any>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

interface Content {
    id: string;
    url: string;
    type: "image" | "video";
  }

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export function ContextProvider({ children }: Props) {
        const [content, setContent] = useState<Content | null>(null);
        const [loading, setLoading] = useState(true);

       

         

        return (
            <ContentContext.Provider value={{ content, loading, setContent, setLoading }}>
                {children}
            </ContentContext.Provider>
        );
    }


    export function useContent() {
        const context = useContext(ContentContext);
        if (!context) {
            throw new Error('useContent must be used within a ContextProvider');
        }
        return context;
    }