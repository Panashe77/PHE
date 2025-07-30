document.addEventListener('DOMContentLoaded', () => {
    const articleId = document.body.dataset.articleId;
  
    // Load existing comments
    fetch(`/articles/${articleId}/comments`)
      .then(res => res.json())
      .then(data => renderComments(data.comments));
  
    // Submit comment
    document.getElementById('send-comment').addEventListener('click', () => {
      const comment = document.getElementById('new-comment').value.trim();
      if (!comment) return;
  
      fetch(`/articles/comment/${articleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      })
        .then(res => res.json())
        .then(data => {
          renderComments(data.comments);
          document.getElementById('new-comment').value = '';
        });
    });
  
    // Like
    document.querySelector('.like-button').addEventListener('click', () => {
      fetch(`/articles/like/${articleId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          document.querySelector('.like-button').textContent = `👍 (${data.likes})`;
        });
    });
  
    // Dislike
    document.querySelector('.dislike-button').addEventListener('click', () => {
      fetch(`/articles/dislike/${articleId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          document.querySelector('.dislike-button').textContent = `👎 (${data.dislikes})`;
        });
    });
  });
  
  function renderComments(comments) {
    const wrapper = document.querySelector('.comments-wrp');
    wrapper.innerHTML = '';
    comments.forEach(comment => {
      const el = createCommentElement(comment);
      wrapper.appendChild(el);
    });
  }
  
  function createCommentElement(comment) {
    const template = document.querySelector('.comment-template');
    const node = template.content.cloneNode(true);
    node.querySelector('.usr-name').textContent = comment.user || 'Anonymous';
    node.querySelector('.c-body').textContent = comment.text;
    node.querySelector('.comment-date').textContent = new Date(comment.date).toLocaleString();
    node.querySelector('.score-number').textContent = comment.score || 0;
    return node;
  }