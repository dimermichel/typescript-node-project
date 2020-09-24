# Password Recovery

**Functional Requirements**

- The user should be able to recover the password using the email;
- The user should be able to receive an email with the password recovery instructions;
- The user should be able to reset the password;

**Non Functional Requirements**

- Work with Mailtrap to test emails sent in development environment;
- Work with Amazon SES to send email in production environment;
- Emails should be sent as a background job;

**Business Logic**

- The forgotten password link should expire after 2 hours;
- The user should confirm the new password;

# Profile Update

**Functional Requirements**

- The user should be able to update the name, email and password;

**Business Logic**

- The user should not be able to change the email to an existing email;
- In order to update the password, the user must inform the old password;
- In order to update the password, the user must confirm the new password;

# Barber Dashboard

**Functional Requirements**

- The user should be able to list all the appointments for a given date;
- The worker should be able to receive a notification when a new appointment is created;
- The worker should be able to list all the unread notifications;

**Non Functional Requirements**

- The daily appointments must be stored in cache;
- The worker notifications should be stored in the MongoDB database;
- The worker notifications should be sent in realtime with Socket.io;

**Business Logic**

- The notification should have a status of read and unread;

# Service Schedule

**Functional Requirements**

- The user should be able to list all the available workers;
- The user should be able to list at least one available the date from a worker;
- The user should be able to list all the available time from a specific date of a worker;
- The user should be able to schedule an appointment;

**Non Functional Requirements**

- The available workers list should be stored in cache;

**Business Logic**

- Each appointment should last exactly 1 hour;
- The appointments should be available between 8h to 18h;
- The user should not be able to schedule a concurrent appointment;
- The user should not be able to schedule a previous date appointment;
- The user should not be able to schedule an appointment with himself;
