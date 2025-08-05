function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export const getVehicleByPhone = (id, name) => {
  const webHookId = generateUUID();
  return {
    workflow: {
      name: `Get Vehicle by Phone(${name})`,
      nodes: [
        {
          parameters: {
            url: `https://api.autoops.com/v1/clients/${id}/customers`,
            sendQuery: true,
            queryParameters: {
              parameters: [
                {
                  name: "pageIndex",
                  value: "={{ $json.index }}",
                },
              ],
            },
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-1968, 176],
          id: "f525956a-cd96-4e92-bb0b-0380854089ca",
          name: "Get Customers",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "e25d4a4b-b1ba-43de-82fd-eeed16bfa059",
                  leftValue: "={{ $json.status }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-1536, 176],
          id: "02a35fbf-b811-4c02-ad3a-4662259950cd",
          name: "Customer exist?",
        },
        {
          parameters: {
            url: "=https://api.autoops.com/v1/clients/{{ $('Customer exist?').item.json.status.client }}/vehicles",
            sendQuery: true,
            queryParameters: {
              parameters: [
                {
                  name: "pageIndex",
                  value: "={{ $json.index }}",
                },
              ],
            },
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-1088, -32],
          id: "6413be51-833f-470c-a4fb-509874584033",
          name: "Get Vehicles",
        },
        {
          parameters: {
            jsCode:
              'for (const item of $input.first().json.data) {\n  if(item.customer == $(\'Customer exist?\').first().json.status.id ){\n    return {"vehicle": item};\n  }\n}\n\nreturn {"status": ""};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-880, -32],
          id: "5c36560f-9bfe-4acb-b9c8-0edda3e74046",
          name: "Find Vehicle by Customer",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "d64f133a-0e54-44c6-a245-136b23a633cd",
                  leftValue: "={{ $('Get Customers').item.json.data }}",
                  rightValue: "",
                  operator: {
                    type: "array",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-1312, 512],
          id: "423e4cde-c9f2-4518-bc51-2e8a9168a07e",
          name: "If",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nworkflow_variable.rowIndex = 0;\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-2416, 256],
          id: "dfe20ed2-0139-4c88-9ecd-a84eeffe7077",
          name: "Code1",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nworkflow_variable.rowIndex = workflow_variable.rowIndex + 1;\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1088, 672],
          id: "b794592b-0f24-41cd-8b16-374a2324fc46",
          name: "Code",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-2192, 256],
          id: "67d691d6-889a-461e-bbb8-06bab7d62356",
          name: "Code2",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-1088, 448],
          id: "254f200e-8bc1-4235-a3d4-9ffd0882b805",
          name: "Respond to Webhook",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": {{ $json.vehicle.toJsonString() }}\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-432, -128],
          id: "039c5a49-2833-4d71-bf12-ece3c886ff3a",
          name: "Respond to Webhook1",
        },
        {
          parameters: {
            jsCode:
              'for (const item of $input.first().json.data) {\n  if(item.phone == $(\'Webhook\').first().json.body.message.toolCalls[0].function.arguments.phoneNumber ){\n    return {"status": item};\n  }\n}\n\nreturn {"status": {}};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1760, 176],
          id: "da247bef-bfa6-4739-9493-9cb784c0aac2",
          name: "Find Customer by phone",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1312, 48],
          id: "30c931c3-fbe7-414e-86e9-eb499b95ef68",
          name: "Code3",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nworkflow_variable.rowIndex = workflow_variable.rowIndex + 1;\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-208, 256],
          id: "10a41f49-4c8c-4ed0-adb3-27517c632f5f",
          name: "Code4",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "39369251-d082-4d95-bf25-40c9274d8948",
                  leftValue: "={{ $json.vehicle }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "exists",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-656, -32],
          id: "031e45bd-c02d-4c27-a969-69f9fad0501e",
          name: "If1",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "0444d2d0-1971-41fa-8a89-c0db7235efd4",
                  leftValue: "={{ $('Get Vehicles').item.json.data }}",
                  rightValue: "",
                  operator: {
                    type: "array",
                    operation: "exists",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-432, 80],
          id: "d3b57b5d-ab85-4558-887b-2c875e3cf311",
          name: "If2",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-208, 32],
          id: "cbb08952-c1d3-4702-9e18-d65242256571",
          name: "Respond to Webhook2",
        },
        {
          parameters: {
            httpMethod: "POST",
            path: webHookId,
            responseMode: "responseNode",
            options: {},
          },
          type: "n8n-nodes-base.webhook",
          typeVersion: 2,
          position: [-2640, 256],
          id: "fed5c0a8-2471-43c5-b137-f9da9c30ff4d",
          name: "Webhook",
          webhookId: webHookId,
        },
      ],
      connections: {
        "Get Customers": {
          main: [
            [
              {
                node: "Find Customer by phone",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Customer exist?": {
          main: [
            [
              {
                node: "Code3",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "If",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Get Vehicles": {
          main: [
            [
              {
                node: "Find Vehicle by Customer",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Vehicle by Customer": {
          main: [
            [
              {
                node: "If1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        If: {
          main: [
            [
              {
                node: "Code",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Respond to Webhook",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code1: {
          main: [
            [
              {
                node: "Code2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code: {
          main: [
            [
              {
                node: "Code2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code2: {
          main: [
            [
              {
                node: "Get Customers",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Customer by phone": {
          main: [
            [
              {
                node: "Customer exist?",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code3: {
          main: [
            [
              {
                node: "Get Vehicles",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code4: {
          main: [
            [
              {
                node: "Code3",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        If1: {
          main: [
            [
              {
                node: "Respond to Webhook1",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "If2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        If2: {
          main: [
            [
              {
                node: "Code4",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Respond to Webhook2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Webhook: {
          main: [
            [
              {
                node: "Code1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
      },
      settings: {
        executionOrder: "v1",
      },
    },
    uuid: webHookId,
  };
};

export const suggestApptSlots = (id, name) => {
  const webHookId = generateUUID();

  return {
    workflow: {
      name: `Suggest Appt Slots(${name})`,
      nodes: [
        {
          parameters: {
            httpMethod: "POST",
            path: webHookId,
            responseMode: "responseNode",
            options: {},
          },
          type: "n8n-nodes-base.webhook",
          typeVersion: 2,
          position: [-880, 112],
          id: "0b130a00-8a66-4cc2-b9e6-8a169215fb4f",
          name: "Webhook",
          webhookId: webHookId,
        },
        {
          parameters: {
            url: `https://api.autoops.com/v1/clients/${id}/services`,
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-656, 112],
          id: "2c451bae-362a-4d03-bb9c-6fb6d9fcf908",
          name: "Get Services",
        },
        {
          parameters: {
            jsCode:
              'let temp = $(\'Webhook\').first().json.body.message.toolCalls[0].function.arguments.serviceName;\n\nconst key = temp.split(" ")[0];\n\nfor (const item of $input.first().json.data) {\n  if(item.name.includes(key) ){\n    return {"status": item};\n  }\n}\n\nreturn {"status": {}};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-448, 112],
          id: "303650ad-736c-4afa-927f-8b71b404125f",
          name: "Find Service",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "c55d3d19-7acb-4a29-9b12-d5c39355fa7d",
                  leftValue: "={{ $json.status }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-224, 112],
          id: "43e966bd-c96a-4ba3-90ef-80cfdd9c2880",
          name: "If",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '{\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [0, 208],
          id: "1759c0af-e172-4f69-b2fc-9626d2f10b7c",
          name: "Respond to Webhook",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": {{ $json.dates.toJsonString() }}\n    }\n  ]\n}\n ',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [448, 0],
          id: "037abc84-a3b9-4410-9a5c-bb630efb8d80",
          name: "Respond to Webhook1",
        },
        {
          parameters: {
            jsCode:
              'const timestamp = Date.now();\nconst dateObj = new Date(timestamp);\nconst isoString = dateObj.toISOString();\n\nreturn {\n  "currentDate": isoString.split(\'T\')[0],\n  "serviceID": $input.first().json.status.id\n};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [0, 0],
          id: "8e885724-5821-4b1e-9929-7601d8a831bf",
          name: "Code",
        },
        {
          parameters: {
            url: `https://api.autoops.com/v1/booking-flow/${id}/availability`,
            sendQuery: true,
            queryParameters: {
              parameters: [
                {
                  name: "startAt",
                  value: "={{ $json.currentDate }}",
                },
                {
                  name: "service",
                  value: "={{ $json.serviceID }}",
                },
                {
                  name: "isDroppingOff",
                  value: "true",
                },
                {
                  name: "isNewCustomer",
                  value: "false",
                },
              ],
            },
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [224, 0],
          id: "88c8d060-34ba-4e05-b361-a960de32f8ef",
          name: "Get Time Slots",
        },
      ],
      connections: {
        Webhook: {
          main: [
            [
              {
                node: "Get Services",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Get Services": {
          main: [
            [
              {
                node: "Find Service",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Service": {
          main: [
            [
              {
                node: "If",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        If: {
          main: [
            [
              {
                node: "Code",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Respond to Webhook",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code: {
          main: [
            [
              {
                node: "Get Time Slots",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Get Time Slots": {
          main: [
            [
              {
                node: "Respond to Webhook1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
      },
      settings: {
        executionOrder: "v1",
      },
    },
    uuid: webHookId,
  };
};

export const bookAppt = (id, name) => {
  const webHookId = generateUUID();

  return {
    workflow: {
      name: `Book Appt(${name})`,
      nodes: [
        {
          parameters: {
            url: `https://api.autoops.com/v1/clients/${id}/services`,
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-656, 112],
          id: "ea40b29b-2a91-4d6a-88ae-d955e098a398",
          name: "Get Services",
        },
        {
          parameters: {
            jsCode:
              'let temp = $(\'Webhook\').first().json.body.message.toolCalls[0].function.arguments.serviceName;\n\nconst key = temp.split(" ")[0];\n\nfor (const item of $input.first().json.data) {\n  if(item.name.includes(key) ){\n    return {"status": item};\n  }\n}\n\nreturn {"status": {}};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-448, 112],
          id: "774bcbe4-a9e9-4ffe-9a12-d55a20f67d2a",
          name: "Find Service",
        },
        {
          parameters: {
            method: "POST",
            url: `https://api.autoops.com/v1/booking-flow/${id}/book`,
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            sendBody: true,
            specifyBody: "json",
            jsonBody:
              '={\n  "customer": "{{ $json.customer }}",\n  "isDroppingOff": true,\n  "scheduledAt": "{{ $json.scheduledAt }}",\n  "vehicle": "{{ $json.vehicle }}",\n  "services": [\n    {\n      "id": "{{ $(\'Find Service\').item.json.status.id }}",\n      "issueDescription": ["{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.ISSUE }}"],\n      "customerNotes": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.NOTES }}"\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [224, 0],
          id: "1921613a-a8a9-4d03-9a92-fef5b6829c3a",
          name: "Book Appointment",
        },
        {
          parameters: {
            method: "POST",
            url: `https://api.autoops.com/v1/booking-flow/${id}/book`,
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            sendBody: true,
            specifyBody: "json",
            jsonBody:
              '={\n  "customer": { "firstName": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.firstName }}", "lastName": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.lastName }}", "phone": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.phoneNumber }}" },\n  "isDroppingOff": true,\n  "scheduledAt": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.bookDateTime }}",\n  "vehicle": {\n    "make": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.Make }}",\n    "model": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.Model }}",\n    "year": {{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.Year }},\n    "forceCreateNew": true\n  },\n  "services": [\n    {\n      "id": "{{ $json.status.id }}",\n      "issueDescription": [\n        "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.ISSUE }}"\n      ],\n      "customerNotes": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.NOTES }}"\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-448, 752],
          id: "07a7fe06-fa06-4191-b712-28c9507efe33",
          name: "Book Appointment1",
        },
        {
          parameters: {
            url: `https://api.autoops.com/v1/clients/${id}/services`,
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-1104, 864],
          id: "b2ccba8a-fb82-4d70-8e18-9fd7fa666675",
          name: "Get Services1",
        },
        {
          parameters: {
            jsCode:
              'let temp = $(\'Webhook\').first().json.body.message.toolCalls[0].function.arguments.serviceName;\n\nconst key = temp.split(" ")[0];\n\nfor (const item of $input.first().json.data) {\n  if(item.name.includes(key) ){\n    return {"status": item};\n  }\n}\n\nreturn {"status": {}};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-880, 864],
          id: "edfb81a1-2341-48e7-af94-265baf154f78",
          name: "Find Service1",
        },
        {
          parameters: {
            mode: "raw",
            jsonOutput:
              '={\n  "customer": "{{ $(\'Customer exist?\').item.json.status.id }}",\n  "isDroppingOff": true,\n  "scheduledAt": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.bookDateTime }}",\n  "vehicle": "{{ $(\'Vehicle is existing?\').item.json.vehicle.id }}",\n  "services": [\n    {\n      "id": "{{ $json.status.id }}",\n      "issueDescription": [\n        "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.ISSUE }}"\n      ],\n      "customerNotes": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].function.arguments.NOTES }}"\n    }\n  ]\n}',
            options: {},
          },
          type: "n8n-nodes-base.set",
          typeVersion: 3.4,
          position: [0, 0],
          id: "b2dd7b5c-a0c6-47d9-9407-dd8837c44513",
          name: "Edit Fields",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '{\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [0, 208],
          id: "df02ed2e-e836-4717-9147-49b689313009",
          name: "Not find service",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": {{ $json.toJsonString() }}\n    }\n  ]\n}\n ',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [448, 0],
          id: "142f4311-4f88-40b4-9c42-a67ff63a19a1",
          name: "Book appointment success",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "06b64092-59fd-4dea-8a9e-0450c3fa2923",
                  leftValue:
                    "={{ $('Webhook').item.json.body.message.toolCalls[0].function.arguments.Make }}",
                  rightValue: "",
                  operator: {
                    type: "string",
                    operation: "exists",
                    singleValue: true,
                  },
                },
                {
                  id: "a85dbe1c-e187-478a-a86c-4af39f24d9ac",
                  leftValue:
                    "={{ $('Webhook').item.json.body.message.toolCalls[0].function.arguments.Year }}",
                  rightValue: "",
                  operator: {
                    type: "string",
                    operation: "exists",
                    singleValue: true,
                  },
                },
                {
                  id: "ba2cb0a0-c3aa-4037-94bd-3fc871c7e724",
                  leftValue:
                    "={{ $('Webhook').item.json.body.message.toolCalls[0].function.arguments.Model }}",
                  rightValue: "",
                  operator: {
                    type: "string",
                    operation: "exists",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-1328, 960],
          id: "b1f212ca-ad00-45c1-9eb4-73367ac47fe2",
          name: "Year/Make/Model/VIN",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '{\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-1104, 1056],
          id: "6599a3ea-e838-4b0c-b2ad-2f91fc52fdf5",
          name: "Not find para",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "c55d3d19-7acb-4a29-9b12-d5c39355fa7d",
                  leftValue: "={{ $json.status }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-656, 864],
          id: "fc47ea10-a4f0-4a91-9a3d-64032330da88",
          name: "Service is existing?",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '{\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-448, 960],
          id: "b07470b1-5e14-4d0d-b8d2-957b1dafd4e3",
          name: "Not find service1",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": {{ $json.toJsonString() }}\n    }\n  ]\n}\n ',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-224, 752],
          id: "50d5ac11-64dd-43b5-93b5-33bf677ab568",
          name: "Book appointment success1",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nworkflow_variable.rowIndex = 0;\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-2640, 752],
          id: "cf21436b-d90d-42bb-a293-b8ce3e36fa30",
          name: "Code1",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nworkflow_variable.rowIndex = workflow_variable.rowIndex + 1;\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1328, 1184],
          id: "356f55ef-a8d4-46cf-8803-edf2d1034a14",
          name: "Code",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-2416, 752],
          id: "ef7a7eb4-ebfc-4029-b552-188a67361c3a",
          name: "Code2",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1536, 336],
          id: "7f015e16-cf16-486d-9778-cdd1584da83e",
          name: "Code3",
        },
        {
          parameters: {
            jsCode:
              'const workflow_variable = $getWorkflowStaticData("global");\n\nworkflow_variable.rowIndex = workflow_variable.rowIndex + 1;\n\nreturn {\n  index: workflow_variable.rowIndex\n}',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-448, 528],
          id: "9fe1a70d-fce8-48e6-bc0e-7c4133fc4a4a",
          name: "Code4",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "0444d2d0-1971-41fa-8a89-c0db7235efd4",
                  leftValue: "={{ $('Get Vehicles').item.json.data }}",
                  rightValue: "",
                  operator: {
                    type: "array",
                    operation: "exists",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-656, 352],
          id: "512d0143-3823-4279-ac68-95d418d84e20",
          name: "If2",
        },
        {
          parameters: {
            respondWith: "json",
            responseBody:
              '={\n  "results": [\n    {\n      "toolCallId": "{{ $(\'Webhook\').item.json.body.message.toolCalls[0].id }}",\n      "result": ""\n    }\n  ]\n}\n',
            options: {},
          },
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.3,
          position: [-448, 304],
          id: "e3e6638b-58ad-4221-a740-8dc8ddf51d91",
          name: "Respond to Webhook2",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "d64f133a-0e54-44c6-a245-136b23a633cd",
                  leftValue: "={{ $('Get Customers').item.json.data }}",
                  rightValue: "",
                  operator: {
                    type: "array",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-1536, 1008],
          id: "9b4cba7f-047d-4cc3-a040-44f8b968f2b6",
          name: "If3",
        },
        {
          parameters: {
            url: `https://api.autoops.com/v1/clients/${id}/customers`,
            sendQuery: true,
            queryParameters: {
              parameters: [
                {
                  name: "pageIndex",
                  value: "={{ $json.index }}",
                },
              ],
            },
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-2208, 688],
          id: "6b5a16a5-e4e0-460e-a79e-60df9e8786cf",
          name: "Get Customers",
        },
        {
          parameters: {
            jsCode:
              'for (const item of $input.first().json.data) {\n  if(item.phone == $(\'Webhook\').first().json.body.message.toolCalls[0].function.arguments.phoneNumber ){\n    return {"status": item};\n  }\n}\n\nreturn {"status": {}};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1984, 688],
          id: "52b4f0f7-0304-4316-afb2-f22733aac0ce",
          name: "Find Customer by phone",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "e25d4a4b-b1ba-43de-82fd-eeed16bfa059",
                  leftValue: "={{ $json.status }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-1760, 688],
          id: "47fbe071-b207-4bb6-9ec4-1ea2ee41aaf3",
          name: "Customer exist?",
        },
        {
          parameters: {
            url: "=https://api.autoops.com/v1/clients/{{ $('Customer exist?').item.json.status.client }}/vehicles",
            sendQuery: true,
            queryParameters: {
              parameters: [
                {
                  name: "pageIndex",
                  value: "={{ $json.index }}",
                },
              ],
            },
            sendHeaders: true,
            specifyHeaders: "json",
            jsonHeaders:
              '{\n  "Authorization": "Bearer crL8oSwUPhlstiHOth3j5D4qaphlwroflgizezlvakoHofoC2est3zegofu76Ab1"\n}',
            options: {},
          },
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [-1328, 256],
          id: "dc4600ee-a58c-4588-b7c0-eee4aa7f03e8",
          name: "Get Vehicles",
        },
        {
          parameters: {
            jsCode:
              'for (const item of $input.first().json.data) {\n  if(item.customer == $(\'Customer exist?\').first().json.status.id ){\n    return {"vehicle": item};\n  }\n}\n\nreturn {"status": ""};',
          },
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [-1104, 256],
          id: "d657cc5c-c729-4d12-94e3-7e26ead57d88",
          name: "Find Vehicle by Customer",
        },
        {
          parameters: {
            httpMethod: "POST",
            path: webHookId,
            responseMode: "responseNode",
            options: {},
          },
          type: "n8n-nodes-base.webhook",
          typeVersion: 2,
          position: [-2864, 752],
          id: "8957999d-9a9b-4905-9ce6-68efc68dffd5",
          name: "Webhook",
          webhookId: webHookId,
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "39369251-d082-4d95-bf25-40c9274d8948",
                  leftValue: "={{ $json.vehicle }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "exists",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-880, 256],
          id: "cc4455b4-b8e4-4230-b6fb-018be51e33e9",
          name: "Vehicle is existing?",
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2,
              },
              conditions: [
                {
                  id: "c55d3d19-7acb-4a29-9b12-d5c39355fa7d",
                  leftValue: "={{ $json.status }}",
                  rightValue: "",
                  operator: {
                    type: "object",
                    operation: "notEmpty",
                    singleValue: true,
                  },
                },
              ],
              combinator: "and",
            },
            options: {},
          },
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [-224, 112],
          id: "82c703e4-bcd8-48d4-b7b1-e94bde5f65e4",
          name: "Service existing?",
        },
      ],
      connections: {
        "Get Services": {
          main: [
            [
              {
                node: "Find Service",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Service": {
          main: [
            [
              {
                node: "Service existing?",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Book Appointment": {
          main: [
            [
              {
                node: "Book appointment success",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Book Appointment1": {
          main: [
            [
              {
                node: "Book appointment success1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Get Services1": {
          main: [
            [
              {
                node: "Find Service1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Service1": {
          main: [
            [
              {
                node: "Service is existing?",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Edit Fields": {
          main: [
            [
              {
                node: "Book Appointment",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Year/Make/Model/VIN": {
          main: [
            [
              {
                node: "Get Services1",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Not find para",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Service is existing?": {
          main: [
            [
              {
                node: "Book Appointment1",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Not find service1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code1: {
          main: [
            [
              {
                node: "Code2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code: {
          main: [
            [
              {
                node: "Code2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code2: {
          main: [
            [
              {
                node: "Get Customers",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code3: {
          main: [
            [
              {
                node: "Get Vehicles",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Code4: {
          main: [
            [
              {
                node: "Code3",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        If2: {
          main: [
            [
              {
                node: "Code4",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Respond to Webhook2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        If3: {
          main: [
            [
              {
                node: "Code",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Year/Make/Model/VIN",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Get Customers": {
          main: [
            [
              {
                node: "Find Customer by phone",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Customer by phone": {
          main: [
            [
              {
                node: "Customer exist?",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Customer exist?": {
          main: [
            [
              {
                node: "Code3",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "If3",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Get Vehicles": {
          main: [
            [
              {
                node: "Find Vehicle by Customer",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Find Vehicle by Customer": {
          main: [
            [
              {
                node: "Vehicle is existing?",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        Webhook: {
          main: [
            [
              {
                node: "Code1",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Vehicle is existing?": {
          main: [
            [
              {
                node: "Get Services",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "If2",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
        "Service existing?": {
          main: [
            [
              {
                node: "Edit Fields",
                type: "main",
                index: 0,
              },
            ],
            [
              {
                node: "Not find service",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
      },
      settings: {
        executionOrder: "v1",
      },
    },
    uuid: webHookId,
  };
};
