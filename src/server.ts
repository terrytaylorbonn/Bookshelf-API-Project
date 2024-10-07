import express, { Request, Response } from 'express';
import dbService from './dbService';
import dbPrismaService from './dbPrismaService';

const app = express();
const port = 3000;

app.use(express.json());

// new my guess.. he did not shwo this in the video
app.get('/books', async (req: Request, res: Response) => {
    const foundBooks = await dbPrismaService.getBooks();
    res.status(200).json(foundBooks);
});


app.get('/books/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const foundBook = await dbPrismaService.getBookById(Number(id));
    res.status(200).json(foundBook);
});

app.post('/books', async (req: Request, res: Response) => {
    const { title, author, published } = req.body
    const newBook = { title, author, published }
    const createdBook = await dbPrismaService.insertBook(newBook)
    // await dbService.insertBook(newBook)
    // const allBooks = await dbService.getBooks()
    res.status(201).json(createdBook);
});

// 2a video version
app.put("/books/:id", async (req: Request, res: Response) => {
    const { title, author, published } = req.body
    const { id } = req.params
    const updates = { title, author, published }
    const updatedBook = await dbPrismaService.updateBookById(Number(id), updates)
    res.status(200).json(updatedBook)
})

// 3a video
app.delete('/books/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    await dbPrismaService.deleteBookById(Number(id));
    res.status(200).send("book deleted");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});