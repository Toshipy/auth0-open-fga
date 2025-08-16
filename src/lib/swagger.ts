export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Auth0 認証API',
    version: '1.0.0',
    description: 'Auth0を使用した認証システムのAPIドキュメント',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: '開発サーバー',
    },
  ],
  components: {
    securitySchemes: {
      Auth0: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Auth0のアクセストークンを使用した認証',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ユーザーID',
          },
          name: {
            type: 'string',
            description: 'ユーザー名',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'メールアドレス',
          },
          role: {
            type: 'string',
            enum: ['admin', 'user'],
            description: 'ユーザーロール',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'エラーメッセージ',
          },
          code: {
            type: 'string',
            description: 'エラーコード',
          },
        },
      },
    },
  },
  paths: {
    '/protected': {
      get: {
        summary: '保護されたエンドポイント',
        description: '認証されたユーザーのみアクセス可能なテストエンドポイント',
        security: [{ Auth0: [] }],
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: '保護されたAPIへのアクセス成功！',
                    },
                    user: {
                      $ref: '#/components/schemas/User',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: '認証が必要',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        summary: 'ユーザー一覧取得',
        description: '登録されているユーザーの一覧を取得します',
        security: [{ Auth0: [] }],
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                    currentUser: {
                      $ref: '#/components/schemas/User',
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        total: {
                          type: 'number',
                        },
                        timestamp: {
                          type: 'string',
                          format: 'date-time',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: '認証が必要',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'ユーザー作成',
        description: '新しいユーザーを作成します',
        security: [{ Auth0: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'ユーザー名',
                    example: '田中太郎',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'メールアドレス',
                    example: 'tanaka@example.com',
                  },
                  role: {
                    type: 'string',
                    enum: ['admin', 'user'],
                    default: 'user',
                    description: 'ユーザーロール',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'ユーザー作成成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'ユーザーが正常に作成されました',
                    },
                    user: {
                      allOf: [
                        { $ref: '#/components/schemas/User' },
                        {
                          type: 'object',
                          properties: {
                            createdAt: {
                              type: 'string',
                              format: 'date-time',
                            },
                            createdBy: {
                              type: 'string',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'バリデーションエラー',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: '認証が必要',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};