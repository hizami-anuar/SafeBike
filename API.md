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
