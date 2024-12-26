const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // UUID for unique ID generation

// GraphQL schema definition
const typeDefs = gql`
  type BlogPost {
    id: ID!
    title: String!
    tag: String!
    author: String!
    date: String!
    content: String!
  }

  input BlogPostInput {
    title: String!
    tag: String!  
    author: String!
    date: String!
    content: String!
  }

  type Query {
    posts: [BlogPost!]!
  }

  type Mutation {
    createPost(input: BlogPostInput!): BlogPost!
    updatePost(id: ID!, input: BlogPostInput!): BlogPost!
    deletePost(id: ID!): BlogPost!
  }
`;

// Path to posts.json file
const postsFilePath = path.join(__dirname, 'posts.json');

// Reading posts from posts.json if it exists
let posts = [];
if (fs.existsSync(postsFilePath)) {
  const rawPosts = fs.readFileSync(postsFilePath);
  posts = JSON.parse(rawPosts);
  console.log('Posts loaded from posts.json');
} else {
  console.log('posts.json not found, creating new file...');
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

const resolvers = {
  Query: {
    posts: () => posts,
  },
  Mutation: {
    createPost: (_, { input }) => {
      console.log('Received new post:', input); // Log the input

      const newPost = {
        id: uuidv4(), // Generate a unique ID for each new post
        ...input,,.
      };
      posts.push(newPost);

      // Writing the updated posts array to posts.json
      try {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
        console.log('Post created and saved to posts.json');
      } catch (error) {
        console.error('Error writing to posts.json:', error);
        throw new Error('Failed to create post');
      }

      return newPost;
    },
    updatePost: (_, { id, input }) => {
      const index = posts.findIndex(post => post.id === id);
      if (index === -1) {
        throw new Error('Post not found');
      }

      const updatedPost = { ...posts[index], ...input };
      posts[index] = updatedPost;

      // Write updated posts back to posts.json
      try {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
        console.log('Post updated and saved to posts.json');
      } catch (error) {
        console.error('Error writing to posts.json:', error);
        throw new Error('Failed to update post');
      }

      return updatedPost;
    },
    deletePost: (_, { id }) => {
      const index = posts.findIndex(post => post.id === id);
      if (index === -1) {
        throw new Error('Post not found');
      }

      const deletedPost = posts.splice(index, 1)[0];

      // Write updated posts back to posts.json
      try {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
        console.log('Post deleted and saved to posts.json');
      } catch (error) {
        console.error('Error writing to posts.json:', error);
        throw new Error('Failed to delete post');
      }

      return deletedPost;
    },
  },
};

// Express server setup
const app = express();

// Use express.json middleware to parse request bodies
app.use(express.json());

// ApolloServer setup with typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server and apply middleware to the Express app
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app, path: '/posts' });

  // Start the Express server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}/posts`);
  });
};

startServer();
