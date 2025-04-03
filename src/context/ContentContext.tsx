import { createContext, useContext, useState, Dispatch, SetStateAction} from 'react';

interface ContentContextType {
    content: any;
    loading: boolean;
    setContent: Dispatch<SetStateAction<any>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    status: { id: string; status: string } | null;
    setStatus: Dispatch<SetStateAction<{ id: string; status: string } | null>>;
}

export interface Content {
    id: string;
    url: string;
    type: "image" | "video";
    animation: boolean;
    background: string;
  }

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export function ContextProvider({ children }: Props) {
        const [content, setContent] = useState<Content | null>(null);
        const [loading, setLoading] = useState(true);
        const [status, setStatus] = useState<{ id: string; status: string } | null>(null);

       

         

        return (
            <ContentContext.Provider value={{ content, loading, setContent, setLoading , status, setStatus}}>
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