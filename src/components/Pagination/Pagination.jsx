import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 480);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisiblePages = () => {
    const pages = [];
    const showEllipsis = totalPages > (isMobile ? 5 : 7);

    if (showEllipsis) {
      if (isMobile) {
        // Show fewer pages on mobile
        if (currentPage <= 2) {
          // Show first 3 pages + last page
          for (let i = 1; i <= 3; i++) {
            pages.push(i);
          }
          if (totalPages > 3) {
            pages.push('...');
            pages.push(totalPages);
          }
        } else if (currentPage >= totalPages - 1) {
          // Show first page + last 3 pages
          pages.push(1);
          if (totalPages > 3) {
            pages.push('...');
          }
          for (let i = totalPages - 2; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // Show current page and immediate neighbors
          pages.push(1);
          pages.push('...');
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          if (currentPage + 1 < totalPages) {
            pages.push('...');
            pages.push(totalPages);
          }
        }
      } else {
        // Desktop logic remains unchanged
        if (currentPage <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
    } else {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      
      <div className="pagination-numbers">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            className={`pagination-number ${
              page === currentPage ? 'active' : ''
            } ${page === '...' ? 'ellipsis' : ''}`}
            onClick={() => page !== '...' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;