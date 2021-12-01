# [SafeBike Boston](https://safebike-boston.herokuapp.com/)

## [WAGL]

### Purpose and Functionality

Describe the purpose and functionality of your application (~50 words)

The purpose of SafeBike Boston is to help bikers in the Boston area feel more certain in the routes they take, and to help local government improve the condition of bike lanes. We do this by allowing users to report blockages for others to plan around, and providing a platform for users to easily share information on which bike lanes are unsafe and in need of repair.

### Instructions to Run Locally:

In command line:

```console
$ npm i
$ npm run serve
```

In a separate shell:

```console
$ npm start
```

then you will find the application at `localhost:8080` in the browser

### Authorship:

- **Amir-Hizami S Anuar**:

  - src
    - App.vue
    - Subscription.vue
  - src/components
    - Map.vue
    - MapCircle.vue
    - MapMarker.vue
    - MapSubscription.vue
    - CreateCircle.vue
    - SubscriptionCircle.vue
    - SubscriptionItem.vue
  - models:
    - Blockage.js
  - routes:
    - blockages.js
    - subscriptions.js
    - users.js
    - session.js
    - middleware.js
  - router:
    - index.js
  - API.md
  - heuristics.md

- **Victor Luo**:
  - models:
    - Blockage.js
    - User.js
  - public
    - style.css
  - src
    - Account.vue
    - App.vue
    - Blockage.vue
    - Blockages.vue
    - CreateBlockage.vue
    - Debug.vue
    - History.vue
    - Home.vue
    - Login.vue
    - Settings.vue
    - Signup.vue
    - Map.vue
    - MapMarker.vue
    - definePopupClass.js
    - main.js
  - router
    - index.js
  - routes
    - blockages.js
    - middleware.js
    - session.js
    - users.js

- **Karen Gao**:

  - src
    - App.vue
    - Home.vue
    - Blockage.vue
    - Blockages.vue
    - CreateBlockage.vue
    - NavBar.vue
    - Map.vue
    - Account.vue
    - index.js
    - Login.vue
    - Logout.vue
    - Signup.vue
    - Settings.vue
    - MapMarker.vue
    - Comments.vue
    - History.vue
  - routes:
    - blockages.js
    - users.js
    - middleware.js
  - app.js

- **Cindy Wang**:

  - src
    - App.vue
    - Login.vue
    - Logout.vue
    - Signup.vue
    - main.js
  - models:
    - Blockage.js
    - Comment.js
  - routes:
    - blockages.js
    - index.js
    - middleware.js
    - session.js
    - users.js
  - app.js
  - Other skeleton code files (bin/www etc.)
