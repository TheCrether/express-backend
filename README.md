# web-backend

## Table of Contents

- [web-backend](#web-backend)
  - [Table of Contents](#table-of-contents)
  - [Why I made this](#why-i-made-this)
  - [Todolist](#todolist)
  - [Usage of the API](#usage-of-the-api)
    - [Getting my Github repositories](#getting-my-github-repositories)
    - [Sending Contact Info/Message](#sending-contact-infomessage)
    - [Saving a new structogram](#saving-a-new-structogram)
    - [Get a structogram](#get-a-structogram)

## Why I made this

I wanted something to communicate with my web projects like displaying the github repositories on my [Projects site][1].

## Usage of the API

**Info:** If there is an server error the server will return `500 Internal Server Error` or `503 Service Unavailable` if the route is not implemented but will be

### Getting my Github repositories

**Definition**
`GET /api/github`
**Response**

- `200 OK` on success

```json
[
    {
      "name": "Chatroom",
      "gitlink": "https://github.com/TheCrether/Chatroom",
      "description": "A Chatroom that I am making with my friends",
      "url": ""
  },
  {
      "name": "express-backend",
      "gitlink": "https://github.com/TheCrether/express-backend",
      "description": "null",
      "url": "null"
  }
]
```

### Sending Contact Info/Message

**Definition**
`POST /api/contact`
**Arguments**

- `"name":string` Name of the Person which is sending the message
- `"email":string` Email so I can respond
- `"message":string` The message you want to send me

**Response**

- `204 No Content` on success
- `400 Bad Request` if the request has not got one of the above specified arguments

### Saving a new structogram

`POST /api/structograms`
**Arguments**

- `"name":string` the name of the structogram
- `"content":string` the content of the structogram

**Response**

- `200 OK` on success and give back the structogram id
- `400 Bad Request` if the request is bad

```json

{
  "id": 1
}
```

### Get a structogram

`GET /api/structograms/<id>`
**Response**

- `200 OK` on sucesss
- `404 Not Found` if there is no structogram with that id

```json

{
  "ID": 1,
  "name": "1st",
  "content": "(a)variable=2"
}
```

[1]: http://thecrether.at/projects
