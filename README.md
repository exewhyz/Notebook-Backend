- Day 3 (Express.js)

## Express Framework

## Express Server request-response

## configuration and middleware

## REST APIs in Express

## Mini Project - NoteBook Backend


## Getting Started

After downloading this source code, download all packages by running the below command:

```bash
npm install
```

The above command will download all packages and create a node_modules folder

To run the file use the following command:

```bash
node refinedServer.js
```
Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.


## you can test all the routes in the thunder client to get the response.

#### to test these apis run your refinedServer.js file ( recommended ).

##### refindServer.js file is also Notebook and it has been modified to handle all the errors of our server.
- It is basically the upgraded version of the server.js file.

## To Fetch all the notes
### for example

- you want to fetch all the notes open your thunder client and create a new request.
- select GET method and enter your localhost url like:
```bash
    http://localhost:5000/notes
```
- click on send button.


## To Create a new Note
### for example
- open your thunder client and create a new request.
- select POST method and enter your localhost url like:

```bash
    http://localhost:5000/create
```

- go to body tab and select JSON tab.
- And paste the following :

```bash
    {
        "title":"Data Science",
        "body":"This is a Data Science Note",
        "tag": "alpha"
    }
```
- Click on the send button.

- if you want to create a new note just change all the values of the above object and paste in that body tab in thiunder client and send request.



## To Update a new Note
### for example

- open your thunder client and create a new request.
- select PUT method and enter your localhost url like:

```bash
    http://localhost:5000/update/data-science
```
    - go to body tab and select JSON tab.
    - And paste the following :

    ```bash
    {
        "title":"Data Science",
        "body":"This is Updated Data Science Note",
        "tag": "alpha"
    }
    ```
    -Click on the send button.


## To Delete a new Note
### for example

- open your thunder client and create a new request.
- select DELETE method and enter your localhost url like:

```bash
    http://localhost:5000/delete/data-science
```
- Click on the send button. //It will delete the note.
