# Blog Post Management API

This project is a simple blog post management API built using Express and Apollo Server for GraphQL. It allows users to perform CRUD operations (Create, Read, Update, Delete) on blog posts.

The blog posts are stored in a `posts.json` file, and each post has the following fields:

- **id**: A unique identifier for the post.
- **title**: The title of the blog post.
- **tag**: The tag/category of the blog post.
- **author**: The name of the author.
- **date**: The date the blog post was created.
- **content**: The content of the blog post.

## Features

- **GraphQL API**: The API is built using GraphQL with Apollo Server.
- **CRUD Operations**: Supports creating, reading, updating, and deleting blog posts.
- **Persistent Data Storage**: Data is saved to a `posts.json` file, which allows the data to persist even after the server restarts.
- **UUID for Posts**: Each new post gets a unique ID generated using UUID.

## API Endpoints

### Queries

- **`posts`**: Fetch all blog posts.

  Example:
  ```graphql
  query {
    posts {
      id
      title
      tag
      author
      date
      content
    }
  }
