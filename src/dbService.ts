import { Pool } from "pg";

export type Book = {
    title: string
    author: string
    published: boolean
}

//NOT IN GIT, in video @325
export type BookUpdate = {
    title: string | undefined, author: string | undefined, published: boolean | undefined
}

class DBService {
    private pool = new Pool({
        connectionString: "postgresql://bookshelfDatabase_owner:sxxxxxxxxxxxxxx@ep-silent-flower-a54xsfr6.us-east-2.aws.neon.tech/bookshelfDatabase?sslmode=require"
    })

    public async getBooks(): Promise<Book[]> {
        const result = await this.pool.query("SELECT * FROM book")
        return result.rows
    }

    // 1a video version
    public async getBookById(id: number): Promise<Book> {
        const result = await this.pool.query("SELECT * FROM book WHERE id = $1", [id])
        return result.rows[0]
    }

    // // 1b git version
    // public async getBookById(id: number): Promise<Book> {
    //     const result = await this.pool.query("SELECT * FROM book WHERE id = $1", [
    //       id,
    //     ])
    //     return result.rows[0] as Book
    //   }

    public async insertBook(book: {
        title: string
        author: string
        published: boolean
    }): Promise<void> {
        await this.pool.query(
            "INSERT INTO book (title, author, published) VALUES ($1, $2, $3)",
            [book.title, book.author, String(book.published)]
        )
        return
    }

    // 2a video version
    public async updateBookById(id: number, updates: BookUpdate): Promise<Book> {
        let query = "UPDATE book SET "
        const keys = Object.keys(updates).filter(key => updates[key as keyof BookUpdate] !== undefined)
        let commasNeeded = keys.length - 1
        keys.forEach(key => {
            query += ` ${key} = '${updates[key as keyof BookUpdate]}'`
            if (commasNeeded > 0) {
                query += ", "
                commasNeeded--
            }
        })
        query += `WHERE id = ${id}`
        console.log(query)
        await this.pool.query(query)
        const updatedBook = await this.getBookById(id)
        return updatedBook
    }

    // // 2b git version
    // public async updateBookById(
    //     id: number,
    //     book: {
    //       title: string | undefined
    //       author: string | undefined
    //       published: boolean | undefined
    //     }
    //   ): Promise<Book> {
    //     let query = "UPDATE book SET "
    //     if (book.title !== undefined) query += `title = '${book.title}', `
    //     if (book.author !== undefined) query += `author = '${book.author}', `
    //     if (book.published !== undefined) query += `published = ${book.published} `
    //     query += `WHERE id = ${id}`
    //     await this.pool.query(query)
    //     const updatedBook = await this.getBookById(id)
    //     return updatedBook as Book
    //   }

    // 3a video
    public async deleteBookById(id: number): Promise<void> {
        await this.pool.query("DELETE FROM book WHERE id = $1", [id])
        return
    }
    // 3b git
    // public async deleteBook(id: number): Promise<void> {
    //     const result = await this.pool.query("DELETE FROM book WHERE id = $1", [id])
    //     return
    //   }    
}
export default new DBService()

