
function getVisiblePages(current, total) {
  const pages = [];

  // Show all pages if total is less than or equal to 7
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1); // Always show the first page

    if (current > 3) {
      pages.push('...'); // Add ellipsis if current page is far from the start
    }

    // Add middle pages around current
    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) {
        pages.push(i);
      }
    }

    if (current < total - 2) {
      pages.push('...'); // Add ellipsis if current page is far from the end
    }

    pages.push(total); // Always show the last page
  }

  return pages;
}
