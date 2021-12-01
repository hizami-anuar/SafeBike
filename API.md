# Blockages

**GET /api/blockages**

List all blockages.

Allows query by specific properties of blockage (i.e. reporter).

- @return {Blockage[]} - list of blockages

**POST /api/blockages**

Create a blockage.

- @param {Object} location - object with latitude/longitude values
- @param {string} description - description of blockage
- @param {string} status - status of blockage
- @return {Blockage} - the created blockage
- @throws {403} - if user is not logged in

**PATCH /api/blockages/:id**

Update a blockage.

- @param {Object} location - object with latitude/longitude values
- @param {string} description - description of blockage
- @param {string} status - status of blockage
- @return {Blockage} - the updated blockage
- @throws {403} - if user is not logged in or does not have permission

**DELETE /api/blockages/:id**

Delete a blockage.

- @return {Blockage} - the deleted blockage
- @throws {403} - if user is not logged in or does not have permission

# Voting

**POST /api/blockages/upvote/:id**

Upvote a blockage (removing downvote if exists).

- @return {Blockage} - the upvoted blockage
- @throws {403} - if user is not logged in

**POST /api/blockages/downvote/:id**

Downvote a blockage (removing upvote if exists).

- @return {Blockage} - the downvoted blockage
- @throws {403} - if user is not logged in

**DELETE /api/blockages/upvote/:id**

Remove upvote for a blockage.

- @return {Blockage} - the unupvoted blockage
- @throws {403} - if user is not logged in

**DELETE /api/blockages/downvote/:id**

Remove downvote for a blockage.

- @return {Blockage} - the undownvoted blockage
- @throws {403} - if user is not logged in

# Users

**GET /api/users**

Get a user by user id.

- @param {string} id - userID of user
- @return {User} - the found User
- @throws {400} - if the userID is invalid

**POST /api/users**

Create a user.

- @param {string} username - name of user
- @param {string} password - user's password
- @return {User} - the created User
- @throws {400} - if username is already taken

**PUT /api/users/username**

Update a username.

- @param {string} username - the new username
- @return {User} - the updated User
- @throws {403} - if user is not logged in
- @throws {400} - if username is not formatted correctly - ie there is whitespace or special characters

**PUT /api/users/password**

Update a user's password.

- @param {string} password - the new password
- @return {User} - the updated User
- @throws {403} - if user is not logged in
- @throws {400} - if password is not formatted correctly - ie there is whitespace

**DELETE /api/users**

Delete a user.

- @return {User} - the deleted user
- @throws {404} - if user does not exist

# Session

**POST /api/session**

Set username of active user.

- @return {string} - the username of the user who logged in
- @throws {403} - if username password combo is not correct
- @throws {400} - if username or password is not formatted correctly - ie there is whitespace

**DELETE /api/session**

Remove username of active user.

- @throws 404 if user is not logged in

**GET /api/session**

Get current active user. If not logged in, a 404 shall be returned.

- @throws 404 if user is not logged in

# Comments

**Get /api/blockages/comments/:id**

Get all the comments under a post with the specified id.
- @throws {404} - if the specified blockage does not exist

**POST /api/blockages/comments/:id**

Post a new comment under the post with the specified id.
- @throws {403} - if user is not logged in
- @throws {404} - if the blockage object doesn't exist

**DELETE /api/blockages/comments/:id**

Delete a comment object.
- @throws {403} - if user is not logged in or does not have permission (user deleting someone else's comment)
- @throws {404} - if the Comment doesn't exist.

# Subscriptions

**GET /api/subscriptions**

Get the current user's subscription

- @return {Subscription[]} - list of user's subscriptions
- @throws {403} - if user is not logged in

**POST /api/subscriptions**

Create a subscription.

- @return {Subscription} - the created subscription
- @throws {403} - if user is not logged in
- @throws {400} - if subscription fields are missing

**PATCH /api/subscriptions/:id**

Update a subscription.

- @return {Subscription} - the updated subscription
- @throws {403} - if user is not logged in or does not have permission
- @throws {404} - if no subscription with the given id exists

**DELETE /api/subscriptions/:id**

Delete a subscription.

- @return {Subscription} - the deleted subscription
- @throws {403} - if user is not logged in or does not have permission
- @throws {404} - if no subscription with the given id exists
