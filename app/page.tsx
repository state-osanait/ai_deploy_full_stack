import { prisma } from '../lib/prisma';

// キャッシュを無効化し、アクセス時に必ずDBへクエリを投げるようにする
export const dynamic = 'force-dynamic';

export default async function Home() {
  // DBからユーザーと紐づく投稿を取得
  let users = await prisma.user.findMany({ include: { posts: true } });
  
  // テスト用: DBが空ならサンプルデータを1件作成
  if (users.length === 0) {
    await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Deployment Tester',
        posts: {
          create: { title: 'First Post', content: 'Connection to Supabase is successful!' },
        },
      },
    });
    users = await prisma.user.findMany({ include: { posts: true } });
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vercel + Supabase Deployment Test</h1>
      <p>Data successfully fetched from PostgreSQL:</p>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: '1rem' }}>
            <strong>{user.name}</strong> ({user.email})
            <ul>
              {user.posts.map((post) => (
                <li key={post.id}>{post.title} - {post.content}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}