import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import { Comment } from '../../types';
import { ICONS } from '../../constants';

interface CommentsThreadProps {
  entityType: 'customer' | 'project' | 'deal' | 'task' | 'ticket' | 'sales_order';
  entityId: number;
}

const CommentsThread: React.FC<CommentsThreadProps> = ({ entityType, entityId }) => {
  const { comments, addComment, updateComment, deleteComment, currentUser, hasPermission } = useApp();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  const canManageComments = hasPermission('yorum:yonet');

  const entityComments = comments
    .filter(c => c.relatedEntityType === entityType && c.relatedEntityId === entityId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment, entityType, entityId);
      setNewComment('');
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComment && editingComment.text.trim()) {
      updateComment(editingComment);
      setEditingComment(null);
    }
  };

  return (
    <div className="space-y-4">
      {canManageComments && (
        <form onSubmit={handleSubmit} className="flex items-start gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full"/>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Bir yorum ekle... @ ile birinden bahsedin."
              className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border focus:ring-primary-500 focus:border-primary-500"
              rows={2}
            />
            <div className="text-right mt-2">
              <Button type="submit" disabled={!newComment.trim()}>Yorum Yap</Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {entityComments.length > 0 ? entityComments.map(comment => (
          <div key={comment.id} className="flex items-start gap-3">
            <img src={comment.userAvatar} alt={comment.userName} className="h-9 w-9 rounded-full"/>
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg w-full">
              {editingComment?.id === comment.id ? (
                <form onSubmit={handleEditSave}>
                    <textarea 
                      value={editingComment.text}
                      onChange={(e) => setEditingComment({...editingComment, text: e.target.value})}
                      className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end mt-2">
                      <Button type="button" variant="secondary" onClick={() => setEditingComment(null)}>İptal</Button>
                      <Button type="submit">Kaydet</Button>
                    </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{comment.userName}</span>
                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
                      {new Date(comment.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
                  {currentUser.id === comment.userId && canManageComments && (
                      <div className="flex gap-2 justify-end mt-1">
                          <button onClick={() => setEditingComment(comment)} className="text-xs text-slate-500 hover:text-primary-600">Düzenle</button>
                          <button onClick={() => deleteComment(comment.id)} className="text-xs text-slate-500 hover:text-red-600">Sil</button>
                      </div>
                  )}
                </>
              )}
            </div>
          </div>
        )) : (
          !canManageComments && <p className="text-sm text-center py-4 text-text-secondary dark:text-dark-text-secondary">Bu kayıt için henüz yorum yok.</p>
        )}
      </div>
    </div>
  );
};

export default CommentsThread;
