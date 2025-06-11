# Backend Application for Shift Management

This project is a backend application designed for managing shift schedules, user authentication, and role management in a healthcare setting. It includes features for department data management, shift change requests, and fair workload distribution.

## Features

- **User Authentication**: Secure login and registration for users with role management (Admin and Staff).
- **Department Management**: Create, update, and retrieve department data (e.g., Emergency, Surgery).
- **Shift Scheduling**: Create and manage shift schedules for different departments.
- **Shift Change Requests**: Submit and manage requests for shift changes.
- **Fair Workload Distribution**: Implements an algorithm for automatic fair shift assignment based on department schedules.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (or any other database of choice)
- JWT for authentication

## Project Structure

```
backend-app
├── src
│   ├── app.ts
│   ├── config
│   │   └── index.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── department.controller.ts
│   │   ├── shift.controller.ts
│   │   └── shiftRequest.controller.ts
│   ├── models
│   │   ├── user.model.ts
│   │   ├── department.model.ts
│   │   ├── shift.model.ts
│   │   └── shiftRequest.model.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── department.routes.ts
│   │   ├── shift.routes.ts
│   │   └── shiftRequest.routes.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── department.service.ts
│   │   ├── shift.service.ts
│   │   ├── shiftRequest.service.ts
│   │   └── fairAssignment.service.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── utils
│   │   └── fairAssignmentAlgorithm.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd backend-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Configure your database connection in `src/config/index.ts`.

5. Start the application:
   ```
   npm start
   ```

## API Documentation

Refer to the individual controller files for detailed API endpoints and usage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.