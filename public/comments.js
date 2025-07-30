// ✅ Like an article
function likeArticle(articleId) {
    fetch(`/articles/like/${articleId}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          updateLikes(data.article);
        }
      })
      .catch(err => console.error('Like failed:', err));
  }
  
  // ✅ Dislike an article
  function dislikeArticle(articleId) {
    fetch(`/articles/dislike/${articleId}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          updateLikes(data.article);
        }
      })
      .catch(err => console.error('Dislike failed:', err));
  }
  
  // ✅ Submit a new comment
  function submitComment(articleId) {
    const textArea = document.getElementById('new-comment');
    const commentText = textArea.value.trim();
    if (!commentText) return;
  
    fetch(`/articles/comment/${articleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentText })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          appendComment(data.comment);
          textArea.value = ''; // Clear input after submission
        }
      })
      .catch(err => console.error('Comment failed:', err));
  }
  
  // ✅ Render the new comment dynamically
  function appendComment(comment) {
    const commentsWrapper = document.querySelector('.comments-wrp');
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment');
  
    commentEl.innerHTML = `
      <div class="comment-header">
        <strong>${comment.user || 'Anonymous'}</strong>
        <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
      </div>
      <p>${sanitize(comment.text)}</p>
    `;
  
    commentsWrapper.appendChild(commentEl);
  }
  
  // ✅ Update likes/dislikes dynamically
  function updateLikes(article) {
    const likeBtn = document.querySelector(`.like-button[data-id="${article._id}"]`);
    const dislikeBtn = document.querySelector(`.dislike-button[data-id="${article._id}"]`);
  
    if (likeBtn) {
      likeBtn.innerHTML = `👍 (${article.likes})`;
      likeBtn.style.backgroundColor = article.liked ? 'black' : 'white';
    }
    if (dislikeBtn) {
      dislikeBtn.innerHTML = `👎 (${article.dislikes})`;
      dislikeBtn.style.backgroundColor = article.disliked ? 'black' : 'white';
    }
  }
  
  // 🔐 Basic sanitization to prevent XSS (optional enhancement)
  function sanitize(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }