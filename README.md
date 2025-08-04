# Hotel Room Booking System (Full Stack Project)

A complete full-stack hotel room booking application built using React.js (frontend), Spring Boot (backend), and MySQL (database). This project allows users to register, book hotel rooms, manage bookings, and post reviews. Admins can manage room listings and view user activities.

## Features

### User Module
- Register and login
- View available rooms with images
- Book and cancel hotel room reservations
- Post reviews after successful bookings
- Upload and view profile pictures

### Admin Module
- Login as admin
- Add, update, and delete room listings
- Upload and manage room images
- View all bookings and user reviews

### Common Features
- Image upload support for both profile and rooms
- Role-based logic using simple request parameters (no session or token-based auth)
- Responsive frontend using React.js
- RESTful APIs using Spring Boot
- MySQL database integration
- Manual ID and field handling (no JPA or Lombok)

## Tech Stack

- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Spring Boot, Java
- Database: MySQL
- Tools: Postman, Eclipse, VS Code, Git

  HotelRoomFullStack-Frontend-Backend-/
├── backend/ # Spring Boot project
│ ├── src/
│ │ └── main/java/
│ │ └── com.example.hotel/
│ │ ├── controller/
│ │ ├── entity/
│ │ ├── repository/
│ │ └── service/
│ └── application.properties
├── frontend/ # React project
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ └── App.js


## How to Run

### Backend (Spring Boot)

1. Navigate to the `backend/` directory.
2. Open the project in your preferred IDE (Eclipse/IntelliJ).
3. Configure `application.properties` with your MySQL DB credentials.
4. Run the main application class to start the Spring Boot server.

### Frontend (React)

1. Navigate to the `frontend/` directory.
2. Run the following commands:

npm install
npm start


3. The frontend will run on `http://localhost:3000`.

## Database Configuration

Make sure you have a MySQL database created (e.g., `hotel_booking`). Update your `application.properties` file:

spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update


## Future Enhancements

- Add pagination and filters for room listings
- Implement session or JWT-based authentication
- Add booking history and email notifications
- Role-based dashboard views for user and admin

## Author

**Jegan Baskar**  
Final Year Computer Science Student  
Portfolio: https://jeganbaskar.netlify.app  
LinkedIn: https://linkedin.com/in/jegan2705  
GitHub: https://github.com/jeganbaskar19




## Project Structure

