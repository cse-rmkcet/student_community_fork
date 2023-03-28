# Student Community Platform

## Tech stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [PlanetScale](https://planetscale.com)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Deployment**: [Vercel](https://vercel.com), [Fly](https://fly.io)
- **Styling**: [Tailwind CSS](https://tailwindcss.com), [Chakra UI](https://chakra-ui.com)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Running Locally

Create a `.env` file similar to [`.env.example`](https://github.com/Keshav13142/Student-community/blob/main/.env.example).

```bash
git clone git@github.com:Keshav13142/Student-community.git
cd Student-community
npm install
npx prisma db push && npx prisma db generate
npm run dev
```

> You need to run this [socket server](https://github.com/Keshav13142/student_comm_socket_server), for real-time messaging to work
