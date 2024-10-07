import express, { Request, Response } from 'express';
import dbService from './dbService';

const app = express();
const port = 3000;

app.use(express.json());

const books = [
    { title: "book1title", author: "book1author", published: true },
    { title: "book2title", author: "book2author", published: false },
];

app.get('/books', (req: Request, res: Response) => {
    res.status(200).json(books);
});

app.get('/books/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const foundBook = books[Number(id)];
    res.status(200).json(foundBook);
});

app.post('/books', async (req: Request, res: Response) => {
    const { title, author, published } = req.body
    const newBook = { title, author, published }
    await dbService.insertBook(newBook)
    const allBooks = await dbService.getBooks()
    res.status(201).json(allBooks);
});

app.put('/books/:id', (req: Request, res: Response) => {
    const { title, author, published } = req.body;
    const { id } = req.params;
    const updatedBook = { title, author, published };
    books[Number(id)] = updatedBook;
    res.status(200).json(books);
});

app.delete('/books/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    books.splice(Number(id), 1);
    res.status(200).json(books);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});