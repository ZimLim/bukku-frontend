This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## How to Use Video
https://youtu.be/6QhVGAW7H8g

## Pre-requisite
* NextJS 15
* Node 22
* MongoDB

## Getting Started

First,

Create a .env file at root level to store MongoDB URI to use database

```
MONGODB_URI=<your_uri_here>

# local MongoDB URI example
MONGODB_URI=mongodb://localhost:27017/bukku
```
If you're using a local MongoDB instance, you should get it running at this point

At project root, run
```
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


