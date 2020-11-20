export class Book {

    constructor(title, author, ISBN, genre, complete, shelved, rating = 0) {
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
        this.genre = genre;
        this.complete = complete;
        this.shelved = shelved;
        this.rating = rating;
    }

    read() {
        if (this.shelved) {
            console.log("You must unshelf the book first!");
        }
        else {
            this.complete = true;
            console.log("Congratulations, you've read " + this.title);
        }
    }

    shelveUnshelveBook() {
        this.shelved = !this.shelved;
        console.log("The book " + this.title + " was " + (this.shelved ? "shelved" : "unshelved"));
    }

    rateBook(rating) {
        if (rating > 10) {
            rating = 10;
            console.log("The maximum rating is 10. Re-adjusted to 10.")
        }
        this.rating = rating;
    }

    details() {
        console.log("Book: " + this.title +
            "\nAuthor: " + this.author +
            "\nISBN: " + this.ISBN +
            "\nGenre: " + this.genre +
            "\n" + (this.complete ? "Is completed." : "Isn't completed.") +
            "\n" + (this.shelved ? "Is shelved." : "Isn't shelved.") +
            "\nRating: " + this.rating);
    }


}