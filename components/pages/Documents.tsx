
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Document, DocumentType, DocumentSortConfig } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import DocumentListView from '../documents/DocumentListView';
import DocumentGridView from '../documents/DocumentGridView';
import CreateFolderModal from '../documents/CreateFolderModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import MoveItemsModal from '../documents/MoveItemsModal';
import DocumentPreviewModal from '../documents/DocumentPreviewModal';
import Modal from '../ui/Modal';
import DocumentContextMenu from '../documents/DocumentContextMenu';
import ShareModal from '../documents/ShareModal';

type ViewMode = 'list' | 'grid';

const Documents: React.FC = () => {
    const { documents, addDocument, deleteMultipleDocuments, moveDocuments, hasPermission, toggleDocumentStar } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [previewItem, setPreviewItem] = useState<Document | null>(null);
    const [shareModalItem, setShareModalItem] = useState<Document | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [isStarredFilterActive, setIsStarredFilterActive] = useState(false);
    const [sortConfig, setSortConfig] = useState<DocumentSortConfig>({ key: 'name', direction: 'ascending' });
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: Document } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    
    const canManageDocs = hasPermission('dokuman:yonet');
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const breadcrumbs = useMemo(() => {
        const path = [];
        let folderId = currentFolderId;
        while (folderId !== null) {
            const folder = documents.find(d => d.id === folderId);
            if (folder) {
                path.unshift(folder);
                folderId = folder.parentId;
            } else {
                break;
            }
        }
        return path;
    }, [currentFolderId, documents]);
    
    const currentItems = useMemo(() => {
        const items = isStarredFilterActive
          ? documents.filter(d => d.isStarred)
          : documents.filter(d => d.parentId === currentFolderId);

        return items.filter(d => 
            d.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            if (a.type === 'folder' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'folder') return 1;
            
            const valA = a[sortConfig.key] ?? 0;
            const valB = b[sortConfig.key] ?? 0;

            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [documents, currentFolderId, searchTerm, sortConfig, isStarredFilterActive]);
    
    const handleFolderDoubleClick = useCallback((folderId: number) => {
        setCurrentFolderId(folderId);
        setSelectedIds([]);
        setIsStarredFilterActive(false);
    }, []);

    const handleFileClick = useCallback((file: Document) => {
        setPreviewItem(file);
    }, []);

    const handleBreadcrumbClick = (folderId: number | null) => {
        setCurrentFolderId(folderId);
        setSelectedIds([]);
        setIsStarredFilterActive(false);
    };

    const handleSelectionChange = useCallback((ids: number[]) => {
        setSelectedIds(ids);
    }, []);

    const handleDeleteConfirm = () => {
        deleteMultipleDocuments(selectedIds);
        setIsDeleteModalOpen(false);
        setSelectedIds([]);
    };
    
    const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fileName = formData.get('fileName') as string;

        if (fileName) {
            const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
            let docType = DocumentType.Other;
            if (fileExt === 'pdf') docType = DocumentType.PDF;
            else if (['doc', 'docx'].includes(fileExt)) docType = DocumentType.Word;
            else if (['xls', 'xlsx'].includes(fileExt)) docType = DocumentType.Excel;
            else if (['jpg', 'png', 'gif'].includes(fileExt)) docType = DocumentType.Image;
            
            addDocument({
                name: fileName,
                type: 'file',
                parentId: currentFolderId,
                documentType: docType,
                fileSize: Math.floor(Math.random() * 5000) + 100, // Simulated size
                uploadDate: new Date().toISOString(),
                uploadedById: 0, 
            });
            setIsUploadFileModalOpen(false);
        }
    };

    const handleContextMenu = (e: React.MouseEvent, item: Document) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, item });
    };

    const handleDrop = (targetFolderId: number | null, draggedItemId: number) => {
        if(draggedItemId !== targetFolderId) {
             moveDocuments([draggedItemId], targetFolderId);
        }
    };
    
    return (
        <div className="space-y-4">
            <Card>
                <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                         <input
                            type="text"
                            placeholder="Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        />
                         <Button
                            variant={isStarredFilterActive ? 'primary' : 'secondary'}
                            onClick={() => setIsStarredFilterActive(!isStarredFilterActive)}
                         >
                            <span className="flex items-center gap-2">{ICONS.starFilled} Yıldızlı</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                            <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-500 shadow' : ''}`} title="Grid Görünümü">{ICONS.kanban}</button>
                            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-500 shadow' : ''}`} title="Liste Görünümü">{ICONS.list}</button>
                        </div>
                        {canManageDocs && (
                            <>
                            <Button variant="secondary" onClick={() => setIsCreateFolderModalOpen(true)}>Yeni Klasör</Button>
                            <Button onClick={() => setIsUploadFileModalOpen(true)}>Dosya Yükle</Button>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="p-4 border-y dark:border-dark-border flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        {isStarredFilterActive ? (
                            <span className="font-semibold">Yıldızlı Öğeler</span>
                        ) : (
                            <>
                            <button onClick={() => handleBreadcrumbClick(null)} className="text-primary-600 hover:underline">Ana Dizin</button>
                            {breadcrumbs.map(folder => (
                                <React.Fragment key={folder.id}>
                                    <span className="text-slate-400">/</span>
                                    <button onClick={() => handleBreadcrumbClick(folder.id)} className="text-primary-600 hover:underline">{folder.name}</button>
                                </React.Fragment>
                            ))}
                            </>
                        )}
                    </div>
                    <div>
                        <select 
                            onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value as DocumentSortConfig['key']})}
                            value={sortConfig.key}
                            className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border text-xs"
                        >
                            <option value="name">İsim</option>
                            <option value="uploadDate">Tarih</option>
                            <option value="fileSize">Boyut</option>
                        </select>
                         <button onClick={() => setSortConfig({...sortConfig, direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'})} className="p-1 ml-1">
                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                         </button>
                    </div>
                </div>

                 {selectedIds.length > 0 && (
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/30 flex items-center gap-4">
                        <span className="font-semibold">{selectedIds.length} öğe seçildi.</span>
                        <Button variant="secondary" onClick={() => setIsMoveModalOpen(true)}>Taşı</Button>
                        <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Sil</Button>
                        <Button variant="secondary" onClick={() => setSelectedIds([])}>Seçimi Temizle</Button>
                    </div>
                )}
                
                <div className="p-4 min-h-[400px]">
                    {viewMode === 'list' ? (
                        <DocumentListView 
                            items={currentItems}
                            selectedIds={selectedIds}
                            onSelectionChange={handleSelectionChange}
                            onFolderDoubleClick={handleFolderDoubleClick}
                            onFileClick={handleFileClick}
                            onContextMenu={handleContextMenu}
                            onDrop={handleDrop}
                        />
                    ) : (
                        <DocumentGridView 
                            items={currentItems}
                            selectedIds={selectedIds}
                            onSelectionChange={handleSelectionChange}
                            onFolderDoubleClick={handleFolderDoubleClick}
                            onFileClick={handleFileClick}
                            onContextMenu={handleContextMenu}
                            onDrop={handleDrop}
                        />
                    )}
                </div>
            </Card>

            {contextMenu && (
                <div ref={contextMenuRef}>
                    <DocumentContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        item={contextMenu.item}
                        onClose={() => setContextMenu(null)}
                        onPreview={() => setPreviewItem(contextMenu.item)}
                        onMove={() => { setSelectedIds([contextMenu.item.id]); setIsMoveModalOpen(true); }}
                        onDelete={() => { setSelectedIds([contextMenu.item.id]); setIsDeleteModalOpen(true); }}
                        onShare={() => setShareModalItem(contextMenu.item)}
                        onToggleStar={() => toggleDocumentStar(contextMenu.item.id)}
                    />
                </div>
            )}

            {isCreateFolderModalOpen && (
                <CreateFolderModal 
                    isOpen={isCreateFolderModalOpen}
                    onClose={() => setIsCreateFolderModalOpen(false)}
                    parentId={currentFolderId}
                />
            )}
            
            {isUploadFileModalOpen && (
                 <Modal isOpen={isUploadFileModalOpen} onClose={() => setIsUploadFileModalOpen(false)} title="Dosya Yükle">
                     <form onSubmit={handleFileUpload} className="space-y-4">
                         <div>
                             <label htmlFor="fileName" className="block text-sm font-medium">Dosya Adı (Simülasyon)</label>
                             <input type="text" name="fileName" id="fileName" required className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" placeholder="rapor.pdf" />
                         </div>
                         <p className="text-xs text-slate-500">Bu bir simülasyondur. Gerçek bir dosya yüklenmeyecek.</p>
                         <div className="flex justify-end gap-2">
                             <Button variant="secondary" type="button" onClick={() => setIsUploadFileModalOpen(false)}>İptal</Button>
                             <Button type="submit">Yükle</Button>
                         </div>
                     </form>
                </Modal>
            )}

            {isDeleteModalOpen && (
                <ConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Öğeleri Sil"
                    message={`${selectedIds.length} öğeyi ve (varsa) içeriklerini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                />
            )}

            {isMoveModalOpen && (
                <MoveItemsModal
                    isOpen={isMoveModalOpen}
                    onClose={() => setIsMoveModalOpen(false)}
                    itemsToMove={selectedIds}
                    currentFolderId={currentFolderId}
                />
            )}
            
            {previewItem && (
                <DocumentPreviewModal
                    isOpen={!!previewItem}
                    onClose={() => setPreviewItem(null)}
                    item={previewItem}
                />
            )}

            {shareModalItem && (
                <ShareModal
                    isOpen={!!shareModalItem}
                    onClose={() => setShareModalItem(null)}
                    item={shareModalItem}
                />
            )}
        </div>
    );
};

export default Documents;
