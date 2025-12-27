import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ReactionsPicker.css';

const REACTION_TYPES = [
  { type: 'like', icon: '👍', label: 'Like' },
  { type: 'love', icon: '❤️', label: 'Love' },
  { type: 'haha', icon: '😂', label: 'Haha' },
  { type: 'wow', icon: '😮', label: 'Wow' },
  { type: 'sad', icon: '😢', label: 'Sad' },
  { type: 'angry', icon: '😠', label: 'Angry' }
];

const ReactionsPicker = ({ postId, commentId, userEmail, onReactionChange, currentReaction, reactionsCount, buttonStyle = 'default' }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const handleReactionClick = async (reactionType) => {
    if (!userEmail) {
      alert('Vui lòng nhập email để tham gia cộng đồng');
      return;
    }

    const isRemoving = currentReaction === reactionType;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      const endpoint = isRemoving ? '/api/social/reactions' : '/api/social/reactions';
      const method = isRemoving ? 'DELETE' : 'POST';

      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-user-token'] = token;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify({
          post_id: postId || null,
          comment_id: commentId || null,
          user_email: userEmail,
          reaction_type: reactionType
        })
      });

      if (response.ok) {
        if (onReactionChange) {
          onReactionChange(reactionType, !isRemoving);
        }
        setShowPicker(false);
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const getTotalReactions = () => {
    if (!reactionsCount || !Array.isArray(reactionsCount)) return 0;
    return reactionsCount.reduce((sum, r) => sum + (r.count || 0), 0);
  };

  const getMainReaction = () => {
    if (!reactionsCount || !Array.isArray(reactionsCount) || reactionsCount.length === 0) {
      return { type: 'like', icon: '👍' };
    }
    // Get reaction with highest count
    const topReaction = reactionsCount.reduce((max, r) => 
      (r.count || 0) > (max.count || 0) ? r : max
    );
    return REACTION_TYPES.find(r => r.type === topReaction.reaction_type) || REACTION_TYPES[0];
  };

  const mainReaction = getMainReaction();
  const totalCount = getTotalReactions();

  const getReactionLabel = () => {
    if (!currentReaction) return 'Thích';
    const reactions = { 
      'like': 'Thích', 
      'love': 'Yêu thích', 
      'haha': 'Haha', 
      'wow': 'Wow', 
      'sad': 'Thương thương', 
      'angry': 'Phẫn nộ' 
    };
    return reactions[currentReaction] || 'Thích';
  };

  return (
    <div className="reactions-picker-wrapper" ref={pickerRef}>
      <button
        className={`reaction-button ${currentReaction ? 'has-reaction' : ''} ${buttonStyle === 'an-nhien' ? 'an-nhien-style' : ''}`}
        onClick={() => setShowPicker(!showPicker)}
        onMouseEnter={() => buttonStyle === 'an-nhien' && setShowPicker(true)}
      >
        <span className="reaction-icon">
          {currentReaction 
            ? REACTION_TYPES.find(r => r.type === currentReaction)?.icon || '👍'
            : '👍'
          }
        </span>
        {buttonStyle === 'an-nhien' && (
          <span className="reaction-label">{getReactionLabel()}</span>
        )}
        {buttonStyle !== 'an-nhien' && totalCount > 0 && (
          <span className="reaction-count">{totalCount}</span>
        )}
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="reactions-picker"
            onMouseLeave={() => setShowPicker(false)}
          >
            {REACTION_TYPES.map((reaction) => {
              const reactionData = (Array.isArray(reactionsCount) ? reactionsCount : [])?.find(r => r.reaction_type === reaction.type);
              const count = reactionData?.count || 0;
              const isActive = currentReaction === reaction.type;

              return (
                <button
                  key={reaction.type}
                  className={`reaction-option ${isActive ? 'active' : ''}`}
                  onClick={() => handleReactionClick(reaction.type)}
                  title={reaction.label}
                >
                  <span className="reaction-emoji">{reaction.icon}</span>
                  {count > 0 && <span className="reaction-option-count">{count}</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionsPicker;



