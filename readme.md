This architecture design was developed to build a backend ecosystem for a social media platform. Primary goal is to build a robust ecosystem which is reliable and completely dockerized. The document provides all the considerations taken to build this ecosystem. A series 

### Requirements
- NodeJS - 16+
- git

### Installation
bash
git clone git@github.com:SammithSB/social-media-backend.git
npm -i
# setup .env file with the following line as data
# MONGO_CONNECTION_URL="your_mongo_uri"
# TOKEN_KEY = <insert custom token here>
node app.js


### Usage
For local usage, running the above command will start the server at [http://localhost:3000](http://localhost:3000)

Otherwise the deployed API can be accessed at [https://social-media-backend-cg7w.onrender.com/](https://social-media-backend-cg7w.onrender.com/)

### Available endpoints and features
- #### /users 
	- **/login**: _POST Method_ - Takes in the email and password, and if they match, logs in the user, and returns the `JWT Token` which can be used for further authentication in the future
	- **/users**: _GET Method_ - Takes the token of the user, and returns name, folllowers & following count
	- **/{email}**: _GET Method_ - Takes in email of the user, returns the information about the same if exists
	- **/follow/{id}**: _GET Method_ - Takes in the token of the user in the body, and follows the users account provided in url itself
	- **/unfollow/{id}**: _GET Method_ - Takes in the token of the user in the body, and unfollows the users account provided in url itself if following, otherwise ignores
- #### /posts
	- **/**: _POST Method_ - Takes in token, title & description of the post and adds to the database. email of the user will be detected automatically fromthe token
	- **/{id}**: _DELETE Method_ - Takes the id of the post in the url, and token in the body and if the token matches the owner of the post, the post will be deleted
	- **/like/{id}**: _POST Method_ - Likes the post with given post id, from the account of the token provided in the body
	- **/unlike/{id}**: _POST Method_ - Unlikes the post with given post id, from the account of the token provided in the body
	- **/comment/{id}**: _POST Method_ - Adds the comment with given content from the user of the token, to the post with id passed in the url
	- **/all_posts**: _GET Method_ - returns all the posts from the given user detected from the token passed in the body
	- **/{id}**: _GET Method_ - returns the post with the given post id