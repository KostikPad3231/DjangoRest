import React from 'react';

export const Paginator = ({paginator, curPage, fetchPosts, setCurPage}) => {
    const pageRange = [];
    for (let i = curPage - 3; i < curPage + 3; ++i) {
        if (i >= 0 && i < paginator.pageCount) {
            pageRange.push(i);
        }
    }
    return (
        <>
            {curPage > 0 ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = 0;
                        fetchPosts(0);
                    }}>First</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">First</span>
                </li>
            )}

            {paginator.previous ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = curPage - 1;
                        fetchPosts(curPage - 1);
                    }}>Previous</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                </li>
            )}

            {pageRange.map((page, i) => (
                page === curPage ? (
                    <li className="page-item active" key={i}>
                        <span className="page-link">
                          {curPage + 1}
                            <span className="visually-hidden-focusable">(current)</span>
                        </span>
                    </li>
                ) : (
                    <li className="page-item" key={i}>
                        <a className="page-link" onClick={() => {
                            setCurPage.current = page;
                            fetchPosts(page);
                        }}>{page + 1}</a>
                    </li>
                )
            ))}

            {paginator.next ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = curPage + 1;
                        fetchPosts(curPage + 1);
                    }}>Next</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">Next</span>
                </li>
            )}

            {curPage + 1 !== paginator.pageCount ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = paginator.pageCount - 1;
                        fetchPosts(paginator.pageCount - 1);
                    }}>Last</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">Last</span>
                </li>
            )}
        </>
    );
};