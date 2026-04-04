# Projeto PM3 - Lógica para Builders

Clique [neste link](https://guilhermeonrails.github.io/pm3-logica-builders/curso/aula-1/index.html) para acesar o material das aulas.

Estrutura principal
- `index.html` — página de entrada com botão para iniciar o curso.
- `curso/` — contém pastas `aula-1`, `aula-2`, ..., cada uma com seus arquivos.

## Materiais complementares

- Link da [API de produtos](https://raw.githubusercontent.com/guilhermeonrails/api-solar/refs/heads/main/products.json)
- Projeto N8N (você pode copiar e colar no N8N)

```json
{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        0,
        0
      ],
      "id": "140f7b89-a65e-4ed1-ab5b-ed068cddf30a",
      "name": "When clicking ‘Execute workflow’"
    },
    {
      "parameters": {
        "url": "https://raw.githubusercontent.com/guilhermeonrails/api-solar/refs/heads/main/products.json",
        "options": {}
      },
      "id": "9dbcb4b1-3349-4a73-9820-dc7f7ab58b53",
      "name": "Fetch Solar Products",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [
        224,
        0
      ]
    },
    {
      "parameters": {
        "jsCode": "const parsed = JSON.parse($json.data);\nreturn parsed.map(produto => ({json: produto}))"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        448,
        0
      ],
      "id": "91d5615c-ea1c-4c9d-a77e-c4cd958b2cdb",
      "name": "Code in JavaScript"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 3
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.preco }}",
                    "rightValue": 1000,
                    "operator": {
                      "type": "number",
                      "operation": "lt"
                    },
                    "id": "dddd9e44-0b3b-4611-9e5d-be98584ac74a"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "baixo"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 3
                },
                "conditions": [
                  {
                    "id": "8650aeeb-3266-4e69-9c03-498c9324239f",
                    "leftValue": "={{ $json.preco }}",
                    "rightValue": 5000,
                    "operator": {
                      "type": "number",
                      "operation": "lt"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "medio"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 3
                },
                "conditions": [
                  {
                    "id": "96106bc6-fadf-413f-97b4-29b9d0b1836d",
                    "leftValue": "={{ $json.preco }}",
                    "rightValue": 5000,
                    "operator": {
                      "type": "number",
                      "operation": "gt"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "altos"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.4,
      "position": [
        672,
        -16
      ],
      "id": "080a0807-3fa7-4ba6-9d9b-5e750b542f25",
      "name": "Switch"
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE",
          "mode": "list",
          "cachedResultName": "Solar Tech - Produtos",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Produtos com valores baixo",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE/edit#gid=0"
        },
        "columns": {
          "mappingMode": "autoMapInputData",
          "value": {},
          "matchingColumns": [
            "categoria"
          ],
          "schema": [
            {
              "id": "categoria",
              "displayName": "categoria",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "descricao",
              "displayName": "descricao",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "preco",
              "displayName": "preco",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "energia",
              "displayName": "energia",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [
        896,
        -192
      ],
      "id": "79f8a0e5-09ff-4e89-a480-bf11e4c70a3a",
      "name": "Append or update row in sheet",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mPxOCVxMMEYsLsd3",
          "name": "Google Sheets OAuth2 API"
        }
      }
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE",
          "mode": "list",
          "cachedResultName": "Solar Tech - Produtos",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": 1916256080,
          "mode": "list",
          "cachedResultName": "Produtos com valores médios",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE/edit#gid=1916256080"
        },
        "columns": {
          "mappingMode": "autoMapInputData",
          "value": {},
          "matchingColumns": [
            "categoria"
          ],
          "schema": [
            {
              "id": "categoria",
              "displayName": "categoria",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "descricao",
              "displayName": "descricao",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "preco",
              "displayName": "preco",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "energia",
              "displayName": "energia",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [
        896,
        0
      ],
      "id": "d3f172b3-792b-4f93-a812-2b7602a0e1ef",
      "name": "Append or update row in sheet1",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mPxOCVxMMEYsLsd3",
          "name": "Google Sheets OAuth2 API"
        }
      }
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE",
          "mode": "list",
          "cachedResultName": "Solar Tech - Produtos",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": 745107447,
          "mode": "list",
          "cachedResultName": "Produtos com valores altos",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1yQV08k78xpLz8XSZ9n1igy270ozk1LG7pwlAK9xIZuE/edit#gid=745107447"
        },
        "columns": {
          "mappingMode": "autoMapInputData",
          "value": {},
          "matchingColumns": [
            "categoria"
          ],
          "schema": [
            {
              "id": "categoria",
              "displayName": "categoria",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "descricao",
              "displayName": "descricao",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "preco",
              "displayName": "preco",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "energia",
              "displayName": "energia",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [
        896,
        192
      ],
      "id": "9e8b06ae-f0b8-4252-976a-3a74cdb77630",
      "name": "Append or update row in sheet2",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mPxOCVxMMEYsLsd3",
          "name": "Google Sheets OAuth2 API"
        }
      }
    }
  ],
  "connections": {
    "When clicking ‘Execute workflow’": {
      "main": [
        [
          {
            "node": "Fetch Solar Products",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch Solar Products": {
      "main": [
        [
          {
            "node": "Code in JavaScript",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript": {
      "main": [
        [
          {
            "node": "Switch",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Switch": {
      "main": [
        [
          {
            "node": "Append or update row in sheet",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Append or update row in sheet1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Append or update row in sheet2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a3fd18251267bbc749043cc7148117e07246822b527a84c1eecd6fc1de6f8c6e"
  }
}
```