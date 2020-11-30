import React, { useState } from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  var pageNumbers = [];
  const [page, setPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  var totalpages = Math.ceil(totalPosts / postsPerPage);

  for (let j = startPage; j <= totalpages && j <= startPage + 4; j++) {
    pageNumbers.push(j);
  }

  // for synching the 2 nav bars
  if (page !== currentPage) {
    var newstart = 5 * Math.floor((currentPage - 1) / 5) + 1;
    setStartPage(newstart);
    setPage(currentPage);
  }

  return (
    <div className="ml-auto">
      <ul className='pagination'>
        <li className='page-item'>
          <a onClick={() => { setPage(old => Math.max(old - 1, 1)); paginate(Math.max(page - 1, 1)); setStartPage(old => page === old ? Math.max(old - 5, 1) : old) }} href='!#' className='page-link'>Prev</a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className='page-item' style={(number === page) ? { fontWeight: "bolder" } : { fontWeight: "normal" }}>
            <a onClick={() => { setPage(number); paginate(number); }} href='!#' className='page-link'>
              {number}
            </a>
          </li>
        ))}
        <li className='page-item'>
          <a onClick={() => { setPage(old => old === pageNumbers.length ? old : old + 1); paginate(Math.min(page + 1, totalpages)); setStartPage(old => page === old + 4 ? page + 1 : old) }} href='!#' className='page-link'>Next</a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
