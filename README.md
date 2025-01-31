# About


**Athletes-Connect-System** is a sophisticated platform developed to bridge the gap between athletes, teams, and sports events, offering a seamless and intuitive experience for all users. It enables athletes to discover, participate, and engage in various sporting events effortlessly, while also facilitating team management and stadium bookings. By connecting athletes and sports enthusiasts from different backgrounds, the system fosters a thriving sports community, allowing users to share experiences, collaborate, and improve their skills together.
The platform offers a comprehensive set of features designed to meet the diverse needs of athletes and sports organizers. Athletes can easily sign up, create profiles, join teams, and book stadiums for events. Event organizers can create and manage sports events, including scheduling matches, assigning teams, and tracking event progress. The inclusion of a Review model allows participants to leave feedback on events, teams, and matches, which helps improve future experiences and enhances the sense of community.

In addition to these features, Athletes-Connect-System integrates advanced technologies to ensure high performance and provide innovative functionalities. **GeoJSON** technology is employed to allow for precise geographic location tracking. This ensures that users can easily find and participate in events and **locate nearby stadiums** based on their current position.
A standout feature of the platform is its integration of **Synaptic**, a powerful neural network library that uses **artificial intelligence( AI )** to **predict match outcomes**. A specially developed function analyzes various team statistics, including past performances, player data, and historical match results, to provide accurate predictions of the likely winner. This predictive functionality empowers users to make more informed decisions, stay engaged with ongoing events, and follow their favorite teams more closely.

With Athletes-Connect-System, the goal is to create a hub where athletes and sports fans can easily navigate the world of sports events. The platform not only offers practical tools for participation and event management but also enhances the user experience through AI-powered features and real-time location-based services, making it a unique solution for both amateur and professional athletes
## Features
- **AI-Powered Match Prediction with Synaptic**
One of the key features of Athletes-Connect-System is the integration of **Synaptic**, a **neural network library**, to predict match outcomes. The process starts by training a model using historical team statistics. This is done by running the command `ts-node src/utils/trainModel.ts`, which processes and refines the data. Once the model is trained, it can be used in a practical function that takes real-time user input (team statistics) and predicts the likely winner of an upcoming match. This AI-driven prediction system empowers users to make data-backed decisions, enhancing their sports experience with intelligent insights.
 - **GeoJSON for Location-Based Stadium Recommendations**
Another core feature is the use of **GeoJSON** technology to help users **find the nearest stadium to their location**. By retrieving the user's geographical coordinates, the system uses GeoJSON to calculate the closest stadium and return the relevant details. This feature ensures that athletes can easily locate and navigate to the nearest sporting events, providing a seamless and convenient experience based on real-time location data.
- **User Authentication**
A secure and streamlined sign-in and sign-up process enables athletes to easily join the community, with a personalized experience for managing events, bookings, and teams.
Booking Management
Users can create, update, cancel, and track their bookings while filtering by payment or status and checking stadium availability for events.
- **Stadium Management**
Stadiums can be added, updated, searched, and reserved, with a feature to find nearby stadiums based on location and sport type.
- **Booking Management**
Users can create, update, cancel, and track bookings, along with checking availability and filtering by payment or status.
- **Event Management**
Organizers can easily create, update, delete events, and distribute teams for tournaments, simplifying event coordination.
- **Match Management**
This feature allows for scheduling and managing matches, retrieving match results, and predicting winners based on team statistics using AI.
- **Review System**
Users can leave, view, and delete reviews for events, teams, and stadiums, with quick access to the most recent reviews.
- **Team Management**
Athletes can manage teams by creating, updating, and deleting teams, adding/removing players, changing captains, and tracking match results.
- **Tournament Management**
Organizers can create, update, and delete tournaments, view tournament details, set winners, and manage tournament status with ease.

## Using

The platform is built with the following technologies:

<ul> <li><strong>bcrypt</strong>: A library for securely hashing user passwords before storing them in the database, ensuring the protection of user data.</li> <li><strong>CORS</strong>: Middleware for enabling secure cross-origin requests between the client and the backend API, ensuring proper security during communication.</li> <li><strong>dotenv</strong>: Loads environment variables from a .env file, ensuring sensitive information like API keys and database credentials remain secure.</li> <li><strong>Express.js</strong>: A lightweight web framework for building RESTful APIs and managing HTTP requests and responses, helping to structure the application.</li> <li><strong>jsonwebtoken (JWT)</strong>: Used for securing user authentication and ensuring that only authorized users can access protected routes and services.</li> <li><strong>mongoose</strong>: An Object Data Modeling (ODM) library for MongoDB and Node.js. Mongoose simplifies database interactions by defining schemas and models and offering powerful query capabilities.</li> <li><strong>morgan</strong>: HTTP request logger middleware for Node.js, used to log request details, helping with debugging and monitoring.</li> <li><strong>nodemon</strong>: A development tool that automatically restarts the server when file changes are detected, improving the development workflow.</li> <li><strong>rimraf</strong>: A tool for deleting files and directories, particularly used for cleaning up the project during the build process.</li> <li><strong>synaptic</strong>: A neural network library used to power the AI-driven match prediction feature, utilizing team statistics to predict match outcomes.</li> </ul>

## Collections

<p>The platform utilizes the following collections in MongoDB to manage different types of data:</p>
<ul> <li><strong>Users</strong>: Stores user profiles, including authentication details, personal information, and roles. This collection is used to manage user registration, login, and authorization.</li> <li><strong>Bookings</strong>: Keeps track of all booking details, including booking status, payment status, user details, and event/venue reservation data.</li> <li><strong>Events</strong>: Stores event details such as event name, date, location, participating teams, and event status.</li> <li><strong>Matches</strong>: Contains information about scheduled matches, including match date, teams, match results, and statistics.</li> <li><strong>Reviews</strong>: Stores feedback left by users about events, venues, and teams, enabling users to share their experiences and rate different aspects.</li> <li><strong>Stadiums</strong>: Includes details about stadiums, such as name, location, available sports, and time slots for reservations.</li> <li><strong>Teams</strong>: Manages team information, including team members, team captain, match results, and team performance statistics.</li> <li><strong>Tournaments</strong>: Stores data for tournaments, including tournament details, status, teams involved, and winners.</li> </ul>

# API Endpoints Documentation

This document provides a detailed description of all available API endpoints for the platform.

## Auth API

### `POST /auth/signUp`
- **Description**: Registers a new user in the system. This endpoint requires the user's details, including a unique email and password. The system checks if the email is already in use before completing the registration.

### `POST /auth/signIn`
- **Description**: Authenticates a user and generates a token. The user must provide their email and password. Upon successful authentication, the user will receive a JWT token for future requests.

### `PATCH /auth`
- **Description**: Allows a user to change their password. This action requires the user to provide the old password and the new one for security reasons.

---


## Team API

### `POST /teams`
- **Description**: Creates a new team. This endpoint requires details about the team, such as its name, sport type, and other necessary information.

### `PUT /teams/:id`
- **Description**: Updates an existing team. Only accessible to the team owner. The request body should include the updated team information.

### `DELETE /teams/:id`
- **Description**: Deletes an existing team. This endpoint can only be used by the team owner to remove the team from the system.

### `POST /teams/:id/players`
- **Description**: Adds a player to the team. The request body should contain player information, such as their name and position.

### `DELETE /teams/:id/players`
- **Description**: Removes a player from the team. The request body should include the player's ID or other identifying information.

### `PATCH /teams/:id/captain`
- **Description**: Changes the captain of the team. This action requires the new captain's ID to be provided in the request body.

### `GET /teams/sport-type`
- **Description**: Retrieves all teams of a specified sport type. The request query should specify the desired sport type.

### `GET /teams/byPlayer`
- **Description**: Retrieves all teams that involve a specific player. The player’s ID or other identifying information should be provided in the request query.

### `GET /teams/without-coach`
- **Description**: Retrieves teams that do not currently have a coach assigned. This can help identify teams in need of leadership.

### `GET /teams`
- **Description**: Retrieves all teams in the system. This endpoint is only accessible to team owners.

### `GET /teams/:id`
- **Description**: Retrieves the details of a team by its ID. The response will include information such as the team’s roster, sport type, and performance.

### `PUT /teams/:id/addResult`
- **Description**: Adds match results to the team. The request body should include the match details, including score and opponent team information.

### `GET /teams/:id/matches`
- **Description**: Retrieves match details and the points associated with the team’s previous and upcoming matches.

---

## Stadium API

### `POST /stadiums`
- **Description**: Adds a new stadium to the system. The request body should contain the stadium's details, such as its name, location, and facilities.

### `GET /stadiums/nearby`
- **Description**: Retrieves all nearby stadiums based on the user's location. This endpoint uses geographical data to find stadiums close to the user's current position.

### `GET /stadiums`
- **Description**: Retrieves all stadiums in the system. This endpoint requires the user to be authenticated.

### `GET /stadiums/search`
- **Description**: Searches for a stadium by its ID or name. This allows users to find specific stadiums in the system.

### `PATCH /stadiums/:id`
- **Description**: Updates the details of an existing stadium. This endpoint is accessible only to admin users and requires the stadium's ID to be specified.

### `DELETE /stadiums/:id`
- **Description**: Deletes a stadium from the system. This action can only be performed by admin users and requires the stadium's ID.

### `GET /stadiums/sportType`
- **Description**: Retrieves stadiums filtered by sport type. This allows users to find stadiums based on the sport they host.

### `POST /stadiums/:id/reserve`
- **Description**: Reserves a slot at a specific stadium. The request body should include the details of the reservation, such as the time and date. This action is only allowed for users with the "owner" role.

---

## Booking API

### `POST /bookings`
- **Description**: Creates a new booking in the system. The request body should contain the booking details, such as user information, date, time, and stadium.

### `PUT /bookings/:id/status`
- **Description**: Updates the status of an existing booking. This action requires the booking's ID and the new status to be provided.

### `PUT /bookings/:id/paymentStatus`
- **Description**: Updates the payment status of a booking. The booking's ID and the new payment status are required.

### `GET /bookings`
- **Description**: Retrieves all bookings in the system. This action requires the user to be authenticated and authorized.

### `GET /bookings/user/:userId`
- **Description**: Retrieves all bookings for a specific user based on their `userId`.

### `DELETE /bookings/:id`
- **Description**: Cancels a booking based on its ID. This action removes the booking from the system.

### `GET /bookings/availability`
- **Description**: Checks the availability of stadiums for bookings. This endpoint helps users find available slots.

### `GET /bookings/byPayment`
- **Description**: Filters bookings based on their payment status. This helps users track bookings by their payment state.

### `GET /bookings/byStatus`
- **Description**: Filters bookings based on their current status. This endpoint allows users to manage and view bookings by status.

---

## Match API

### `POST /matches`
- **Description**: Creates a new match in the system. This endpoint requires the user to be authenticated and authorized as the "owner" to create a match.

### `GET /matches`
- **Description**: Retrieves all matches in the system. Only authenticated and authorized users can access this information.

### `GET /matches/:id`
- **Description**: Retrieves a specific match by its ID. The request requires the match's ID to fetch the details.

### `PUT /matches/:id`
- **Description**: Updates the details of an existing match. The match's ID is required, and only users with "owner" authorization can update match details.

### `DELETE /matches/:id`
- **Description**: Deletes a match from the system by its ID. Only users with "owner" authorization can perform this action.

### `GET /matches/matchResult/:id`
- **Description**: Retrieves the result of a match by its ID. This provides details of the match outcome.

### `POST /matches/predict-winner`
- **Description**: Predicts the winner of a match based on historical data and team performance.

---

## Event API

### `POST /events`
- **Description**: Creates a new event. The request requires the user to be authenticated and authorized as the "owner" to create the event.

### `GET /events`
- **Description**: Retrieves all events in the system. Only authenticated users can access this information.

### `GET /events/:id`
- **Description**: Retrieves a specific event by its ID. The request requires the event's ID to fetch the details.

### `PUT /events/:id`
- **Description**: Updates the details of an existing event. The event's ID is required, and only users with "owner" authorization can update event details.

### `DELETE /events/:id`
- **Description**: Deletes an event from the system by its ID. Only users with "owner" authorization can perform this action.

### `POST /events/:id/distribute-teams`
- **Description**: Distributes teams for a specific event. The event's ID is required, and the user must be authenticated.

---

## Review API

### `POST /reviews`
- **Description**: Creates a new review for a stadium. The request requires the user to be authenticated.

### `GET /reviews/Recent`
- **Description**: Retrieves the most recent reviews. Only authenticated users can access this information.

### `GET /reviews/:stadiumId/stadium`
- **Description**: Retrieves reviews for a specific stadium by its ID.

### `GET /reviews/:userId/user`
- **Description**: Retrieves reviews written by a specific user.

### `DELETE /reviews/:id`
- **Description**: Deletes a specific review by its ID. The user must be authenticated and authorized as "owner" to delete the review.

---

## Tournament API

### `POST /tournaments`
- **Description**: Creates a new tournament. This action requires the user to be authenticated and authorized as "owner".

### `GET /tournaments`
- **Description**: Retrieves all tournaments. Only authenticated users can access this information.

### `GET /tournaments/:id`
- **Description**: Retrieves a specific tournament by its ID.

### `PUT /tournaments/:id`
- **Description**: Updates a specific tournament's details. The user must be authenticated and authorized as "owner".

### `DELETE /tournaments/:id`
- **Description**: Deletes a specific tournament by its ID. The user must be authenticated and authorized as "owner".

### `PATCH /tournaments/:id`
- **Description**: Updates the status of a specific tournament. This action requires the user to be authenticated and authorized as "owner".

### `PATCH /tournaments/:id/winner`
- **Description**: Sets the winner of a specific tournament. The user must be authenticated and authorized as "owner".

---

## Key Takeaways from this Project
This project enabled me to build a robust sports event management platform, incorporating features like real-time match predictions using AI-powered models, stadium reservations, and a seamless booking system. I leveraged technologies such as MongoDB, JWT authentication, and GeoJSON for location-based stadium recommendations to ensure a personalized and efficient user experience. Throughout the project, I honed my skills in managing complex data, optimizing performance, and delivering a dynamic platform for sports enthusiasts.

## Project Inspiration
The inspiration for this project stemmed from a desire to create an all-in-one platform for sports enthusiasts, bringing together match predictions, stadium bookings, and real-time event updates. Observing the growing demand for seamless online experiences in the sports industry, I saw an opportunity to integrate advanced technologies like AI, GeoJSON, and real-time data to enhance the sports engagement. This project reflects my passion for leveraging technology to solve real-world problems while providing users with a dynamic and intuitive platform for managing their sports activities.









