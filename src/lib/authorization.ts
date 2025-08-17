import { checkAccess } from './openfga'

export async function assertCanReadDocument(userSub: string, documentId: string) {
  const ok = await checkAccess({
    user: `user:${userSub}`,
    relation: 'can_read',
    object: `document:${documentId}`,
  })
  if (!ok) {
    throw new Error('forbidden')
  }
}


