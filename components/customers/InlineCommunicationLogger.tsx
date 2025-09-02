import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunicationLogType } from '../../types';
import Button from '../ui/Button';

interface InlineCommunicationLoggerProps {
    customerId: number;
}

const InlineCommunicationLogger: React.FC<InlineCommunicationLoggerProps> = ({ customerId }) => {
    const { addCommunicationLog, currentUser } = useApp();
    const [content, setContent] = useState('');
    const [activeType, setActiveType] = useState<CommunicationLogType>(CommunicationLogType.Note);
    const [isFocused, setIsFocused] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            addCommunicationLog(customerId, activeType, content);
            setContent('');
            setIsFocused(false);
        }
    };
    
    return (
        <div className="p-4 border rounded-lg dark:border-dark-border bg-card dark:bg-dark-card">
            <div className="flex items-start gap-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full"/>
                <div className="flex-1">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            placeholder="Bir not ekleyin veya bir aktivite kaydedin..."
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border focus:ring-primary-500 focus:border-primary-500 text-sm"
                            rows={isFocused ? 3 : 1}
                        />
                        {isFocused && (
                             <div className="flex justify-between items-center mt-2">
                                 <div className="flex gap-1">
                                     {Object.values(CommunicationLogType).map(type => (
                                         <Button 
                                             key={type}
                                             type="button"
                                             size="sm"
                                             variant={activeType === type ? 'primary' : 'secondary'}
                                             onClick={() => setActiveType(type)}
                                         >
                                             {type}
                                         </Button>
                                     ))}
                                 </div>
                                 <div className="flex gap-2">
                                     <Button type="button" variant="secondary" onClick={() => { setContent(''); setIsFocused(false); }}>İptal</Button>
                                     <Button type="submit" disabled={!content.trim()}>Kaydet</Button>
                                 </div>
                             </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InlineCommunicationLogger;