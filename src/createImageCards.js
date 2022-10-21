export function createImageCards(img) {
  return img
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-card" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b class='info-text'>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b class='info-text'>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b class='info-text'>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b class='info-text'>Downloads: </b> ${downloads}
    </p>
  </div>
</a>`;
      }
    )
    .join('');
}
