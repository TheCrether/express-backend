# web-backend

## Table of Contents

- [web-backend](#web-backend)
  - [Table of Contents](#table-of-contents)
  - [Why I made this](#why-i-made-this)
  - [Todolist](#todolist)
  - [Usage of the API](#usage-of-the-api)
    - [Getting my Github repositories](#getting-my-github-repositories)
    - [Sending Contact Info/Message](#sending-contact-infomessage)
    - [Getting info on a user with a specific id](#getting-info-on-a-user-with-a-specific-id)
    - [Add an user](#add-an-user)
    - [Changing an specific user](#changing-an-specific-user)
    - [Removing an specific user](#removing-an-specific-user)
    - [Getting the structograms for a specific userid](#getting-the-structograms-for-a-specific-userid)
    - [Saving a new structogram](#saving-a-new-structogram)
    - [Changing a structogram](#changing-a-structogram)
    - [Delete a structogram](#delete-a-structogram)

---

## Why I made this

I wanted something to communicate with my web projects like displaying the github repositories on my [Projects site][1].

---

## Todolist

- [ ] Finish README
- [ ] Make all routes function

---

## Usage of the API

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

---

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

---

### Getting info on a user with a specific id

**Definition**
`GET /api/users/<username>`
**Response**

- `200 OK` on success and returns data about the user
- `404 Not Found` if there is no user with such a id

```json

{
  "id": 1,
  "name": "TheCrether",
  "structograms": [
    {
      "owner": 1,
      "allowedEditors": [
        1
      ],
      "id": 0,
      "content": "(a)variable=2"
    },
    {
      "allowedEditors": [
        1
      ],
      "id": 1,
      "content": "for(i = 0; i<10;i++) {\n(a)variable=i\n}"
    }
  ]
}
```

---

### Add an user

**Definition**
`POST /api/users`
**Arguments**

- `"name":string` the name you want to have for the new user, must be unique
**Response**

- `204 No Content` on success
- `409 Conflict` if the user is already exists

---

### Changing an specific user

**Definition**
`PUT /api/users/<username>`
**Arguments**

- `"name":string` the name you want to change to
**Response**
- `204 No Content` on success

---

### Removing an specific user

**Definition**
`DELETE /api/users/<username>`
**Arguments**

- `"username":string` the username which is requesting
**Response**

- `204 No Content` on success
- `403 Forbidden` if you are not the user

---

### Getting the structograms for a specific userid

`GET /api/users/<username>/structograms`
**Response**

- `200 OK` on success and returns the something like the JSON below
- `204 No Content` if there are no structograms saved
- `404 Not Found` if there is no user with that id

```json

[
  {
    "owner": 1,
    "allowedEditors": [
      1
    ],
    "id": 0,
    "content": "(a)variable=2"
  },
  {
    "owner": 1,
    "allowedEditors": [
      1
    ],
    "id": 1,
    "content": "for(i = 0; i<10;i++) {\n(a)variable=i\n}"
  }
]
```

---

### Saving a new structogram
`POST /api/users/<username>/structograms`
**Arguments**

- `"content":string` the content of the structogram
**Response**

- `204 No Content` on success after creation of the item
- `404 Not Found` if there is no user with that id

---

### Changing a structogram

**Definition**
`PUT /api/users/<userid>/structograms`
**Arguments**

- `"content":string` the new content of an specific structogram
- `"id": number` the id of the structogram you want to edit
**Response**

- `204 No Content` on success
- `403 Forbidden` if you are not an allowed editor of the structogram

---

### Delete a structogram

**Definition**
`DELETE /api/users/<username>/structograms`
**Arguments**

- `"id":number` the id of the structogram you want to edit

[1]: http://thecrether.net/projects
