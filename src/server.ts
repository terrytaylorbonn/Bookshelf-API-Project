import express, { Request, Response } from 'express';
import dbService from './dbService';

const app = express();
const port = 3000;

app.use(express.json());

// L4 @1330 no longer needed
// const books = [
//     { title: "book1title", author: "book1author", published: true },
//     { title: "book2title", author: "book2author", published: false },
// ];

// old
// app.get('/books', (req: Request, res: Response) => {
//     res.status(200).json(books);
// });

// new my guess.. he did not shwo this in the video
app.get('/books', async (req: Request, res: Response) => {
    const foundBooks = await dbService.getBooks();
    res.status(200).json(foundBooks);
});


app.get('/books/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const foundBook = await dbService.getBookById(Number(id));
    res.status(200).json(foundBook);
});

app.post('/books', async (req: Request, res: Response) => {
    const { title, author, published } = req.body
    const newBook = { title, author, published }
    await dbService.insertBook(newBook)
    const allBooks = await dbService.getBooks()
    res.status(201).json(allBooks);
});

// app.put('/books/:id', (req: Request, res: Response) => {
//     const { title, author, published } = req.body;
//     const { id } = req.params;
//     const updatedBook = { title, author, published };
//     books[Number(id)] = updatedBook;
//     res.status(200).json(books);
// });

// 2a video version
app.put("/books/:id", async (req: Request, res: Response) => {
    const { title, author, published } = req.body
    const { id } = req.params
    const updates = { title, author, published }
    const updatedBook = await dbService.updateBookById(Number(id), updates)
    res.status(200).json(updatedBook)
})


// 2b git version
// app.put("/books/:id", async (req: Request, res: Response) => {
//     const { title, author, published } = req.body
//     const { id } = req.params
//     const updatedBook = { title, author, published }
//     const result = await dbPrismaService.updateBookById(Number(id), updatedBook)
//     res.status(200).json(result)
//   })


// old
// app.delete('/books/:id', (req: Request, res: Response) => {
//     const { id } = req.params;
//     books.splice(Number(id), 1);
//     res.status(200).json(books);
// });

// 3a video
app.delete('/books/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    await dbService.deleteBookById(Number(id));
    res.status(200).send("book deleted");
});


// 3b git 
// app.delete("/books/:id", (req: Request, res: Response) => {
//     const { id } = req.params
//     dbPrismaService.deleteBook(Number(id))
//     res.sendStatus(200)
//   })



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});