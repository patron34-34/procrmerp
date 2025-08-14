
import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AccessDenied: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="max-w-md w-full text-center">
                <div className="mx-auto h-16 w-16 text-red-500">
                    {ICONS.lock}
                </div>
                <h1 className="mt-4 text-2xl font-bold text-text-main dark:text-dark-text-main">Erişim Engellendi</h1>
                <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
                    Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsiniz.
                </p>
                <div className="mt-6">
                    <Link to="/">
                        <Button>Kontrol Paneline Dön</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default AccessDenied;
