import { NextResponse } from 'next/server'
import { openfga } from '@/lib/openfga'

export async function POST() {
  // 開発用: 最小の関係データを投入
  // user:auth0|test は document:123 を閲覧できる（can_read）
  const tuples = [
    {
      user: 'user:auth0|test',
      relation: 'viewer',
      object: 'document:123',
    },
  ]

  try {
    await openfga.write({ writes: { tuple_keys: tuples } })
    return NextResponse.json({ ok: true, wrote: tuples.length })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'seed failed' }, { status: 500 })
  }
}


