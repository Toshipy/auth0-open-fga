import { OpenFgaClient } from '@openfga/sdk'

const apiUrl = process.env.OPENFGA_API_URL
const storeId = process.env.OPENFGA_STORE_ID
const authorization = process.env.OPENFGA_AUTH_TOKEN

export const openfga = new OpenFgaClient({
  apiScheme: apiUrl?.startsWith('https') ? 'https' : 'http',
  apiHost: apiUrl?.replace(/^https?:\/\//, '') || 'localhost:8080',
  storeId,
  authorization: authorization ? `Bearer ${authorization}` : undefined,
})

export type CheckInput = {
  user: string
  relation: string
  object: string
}

export async function checkAccess({ user, relation, object }: CheckInput) {
  const { allowed } = await openfga.check({
    user,
    relation,
    object,
  })
  return allowed
}


