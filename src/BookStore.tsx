import { useState, useEffect } from 'react';
import axios from 'axios';

const BookStore = () => {
    const [books, setBooks] = useState<{ title: string, author: string, genre: string, yearPublished: number }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('/api/books');
                console.log(res);

                // Filter out books with repeated titles
                const seenTitles = new Set();
                const uniqueBooks = res.data.filter((book: { title: string, author: string, genre: string, yearPublished: number }) => {
                    if (seenTitles.has(book.title)) {
                        return false;
                    } else {
                        seenTitles.add(book.title);
                        return true;
                    }
                });
                setBooks(uniqueBooks);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBooks();
    }, []);

    // Calculate the books to display on the current page
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(books.length / booksPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Book Store</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {currentBooks.map((book, index) => (
                    <div key={index} className="border p-4 rounded shadow hover:shadow-xl hover:bg-gray-300 transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-2">{book.title.toLocaleUpperCase()}</h2>
                        <p className="text-gray-700 mb-1">Author: {book.author}</p>
                        <p className="text-gray-700 mb-1">Genre: {book.genre.charAt(0).toLocaleUpperCase()+ book.genre.substring(1).toLowerCase()}</p>
                        <p className="text-gray-700">Year Published: {book.yearPublished}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-around mt-4 ">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1} 
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                >
                    Previous
                </button>
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === Math.ceil(books.length / booksPerPage)} 
                    className={`px-4 py-2 rounded ${currentPage === Math.ceil(books.length / booksPerPage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BookStore;