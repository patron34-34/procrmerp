import React, { useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { useNotification } from '../../../../context/NotificationContext';

const FeedbackCard: React.FC = () => {
    const [feedbackText, setFeedbackText] = useState('');
    const { addToast } = useNotification();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackText.trim()) return;

        // Simulate sending feedback
        console.log('Feedback submitted:', feedbackText);

        addToast('Geri bildiriminiz için teşekkür ederiz!', 'success');
        setFeedbackText('');
    };

    return (
        <Card title="Geri Bildirim Gönder">
            <form onSubmit={handleSubmit}>
                <p className="text-sm text-text-secondary mb-3">
                    Portal hakkındaki düşüncelerinizi veya önerilerinizi bizimle paylaşın. Bu, hizmetlerimizi iyileştirmemize yardımcı olur.
                </p>
                <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    placeholder="Deneyiminizi anlatın..."
                />
                <div className="text-right mt-3">
                    <Button type="submit" disabled={!feedbackText.trim()}>
                        Gönder
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default FeedbackCard;
