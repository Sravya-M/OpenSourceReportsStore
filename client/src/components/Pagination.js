import { set } from 'mongoose';
import React, {useState} from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate ,currentPage}) => {
  const pageNumbers = [];
  const [page,setPage]=useState(1);

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  // for synching the 2 nav bars
  if(page!=currentPage){
    setPage(currentPage);
  }

  return (
    <div className="ml-auto">
      <ul className='pagination'>
      <li className='page-item'>
        <a onClick={()=>{setPage(old => Math.max(old-1,1)); paginate(Math.max(page-1,1));}} href='!#' className='page-link'>Prev</a>
      </li>
        {pageNumbers.map((number) => (
          <li key={number} className='page-item' style={(number==page)?{fontWeight:"bolder"}:{fontWeight:"normal"}}>  
            <a onClick={() => {setPage(number); paginate(number);}} href='!#' className='page-link'>
              {number}
            </a>
          </li>
        ))}
        <li className='page-item'>
          <a onClick={()=>{setPage(old => old==pageNumbers.length?old:old+1); paginate(Math.min(page+1,pageNumbers.length));}} href='!#' className='page-link'>Next</a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
