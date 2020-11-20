//Exercise 6

import { Book } from './book.js';

//title,author,ISBN,genre,complete,shelved
var book1 = new Book('Mitul lui Sisif', 'Albert Camus', 9789734681433, 'psychology', false, false);
var book2 = new Book('Dune', 'Frank Herbert', 9786064304834, 'sci-fi', true, false, 9);
var book3 = new Book('Cimitirul Animalelor', 'Stephen King', 9786065799363, 'horror', true, true);

book1.read();
book2.read();

book1.shelveUnshelveBook();
book3.shelveUnshelveBook();
book3.rateBook(9.5);

book1.details();
book2.details();
book3.details();
