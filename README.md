# Pharmacy Data Solutions (PDS) - Invoice Validation System

A full-stack web application that validates pharmacy invoices against a trusted reference database. The system identifies discrepancies in pricing, formulations, drug strengths, and payer information.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Sample Data Format](#sample-data-format)
- [Troubleshooting](#troubleshooting)

## Features

- **Excel File Upload**: Upload pharmacy invoice files in .xlsx or .xls format
- **Real-time Validation**: Compare invoice data against reference API
- **Discrepancy Detection**:
  - Unit Price validation (flags >10% overcharges)
  - Formulation mismatches
  - Drug strength discrepancies
  - Payer information validation
- **Professional Dashboard**: Color-coded results with detailed analysis tables
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and validation

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Multer** for file uploads
- **Axios** for API calls
- **xlsx** for Excel file parsing

### Frontend
- **React 18** with **TypeScript**
- **React Dropzone** for file uploads
- **Axios** for API communication
- **Inline Styles** for component styling

## Prerequisites

### For Mac Users:
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

### For Windows Users:
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer (.msi file)
3. Open Command Prompt or PowerShell and verify:
```cmd
node --version
npm --version
```

## Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd pds-challenge
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Install development dependencies
npm install -D @types/node @types/express @types/cors @types/multer typescript ts-node nodemon

# Create environment file
echo "PORT=3001
NODE_ENV=development" > .env
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies (use legacy-peer-deps for compatibility)
npm install --legacy-peer-deps

# Install additional dependencies
npm install axios react-dropzone --legacy-peer-deps
npm install -D @types/react-dropzone --legacy-peer-deps

# Create environment file
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env

# Fix TypeScript version compatibility
npm install typescript@4.9.5 --save-dev --legacy-peer-deps
```

## Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:3001`

### Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend application will start on `http://localhost:3000`

### Verify Everything is Working
1. Open your browser to `http://localhost:3000`
2. You should see "Server Online" status in the header
3. Upload an Excel file to test the validation

## Project Structure

```
pds-challenge/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── uploadController.ts
│   │   ├── services/
│   │   │   └── validationService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx
│   │   │   └── SimpleDashboard.tsx
│   │   ├── services/
│   │   │   └── apiService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env
│   ├── package.json
│   └── public/
└── README.md
```

## API Endpoints

### Backend Endpoints:
- `GET /health` - Health check endpoint
- `GET /api/reference-drugs` - Fetch reference drug database
- `POST /api/upload-invoice` - Upload and validate Excel invoice

### External API:
- Reference Database: `https://685daed17b57aebd2af6da54.mockapi.io/api/v1/drugs`

## Usage

### 1. Prepare Your Excel File
Create an Excel file with these columns:
- `drugName` - Name of the drug
- `standardUnitPrice` - Price per unit
- `formulation` - Drug formulation (e.g., Tablet, Capsule)
- `strength` - Drug strength (e.g., 500mg)
- `payer` - Insurance payer (e.g., Medicare, Medicaid)

### 2. Upload and Validate
1. Open the application at `http://localhost:3000`
2. Drag and drop your Excel file or click to select
3. Wait for processing and validation
4. Review the results dashboard

### 3. Interpret Results
- **Red Cards**: Price discrepancies (>10% overcharge)
- **Green Cards**: Formulation mismatches
- **Yellow Cards**: Strength discrepancies
- **Blue Cards**: Payer mismatches
- **Purple Cards**: Total issues requiring action

## Sample Data Format

### Excel File Example:
| drugName | standardUnitPrice | formulation | strength | payer |
|----------|-------------------|-------------|----------|-------|
| Amoxicillin | 0.50 | Capsule | 500 mg | medicaid |
| Insulin Glargine | 120.00 | Solution (vial) | 100 units/mL | medicaid |
| Metformin | 0.20 | Tablet (ER) | 500 mg | medicare |

### Expected API Response Format:
```json
{
  "success": true,
  "data": {
    "discrepancies": [...],
    "summary": {
      "total_drugs": 7,
      "total_discrepancies": 9,
      "price_discrepancies": 3,
      "formulation_discrepancies": 2,
      "strength_discrepancies": 2,
      "payer_discrepancies": 2
    }
  }
}
```

## Troubleshooting

### Common Issues:

**1. Backend not starting:**
```bash
# Check if port 3001 is in use
lsof -i :3001  # Mac/Linux
netstat -an | findstr 3001  # Windows

# Kill the process if needed
kill -9 <PID>  # Mac/Linux
```

**2. Frontend compilation errors:**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**3. TypeScript version conflicts:**
```bash
# Downgrade TypeScript version
npm install typescript@4.9.5 --save-dev --legacy-peer-deps
```

**4. Web-vitals errors:**
```bash
# Remove web-vitals from index.tsx
# Comment out or remove these lines:
# import reportWebVitals from './reportWebVitals';
# reportWebVitals();
```

**5. Server offline status:**
- Ensure backend is running on port 3001
- Check console logs for backend errors
- Verify `.env` files are properly configured

### Environment Variables:

**Backend (.env):**
```
PORT=3001
NODE_ENV=development
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:3001/api
```

### Development Commands:

```bash
# Backend
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server

# Frontend
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
```

## Deployment

For production deployment:

1. Build the frontend: `npm run build`
2. Build the backend: `npm run build`
3. Deploy backend to cloud service (Azure, AWS, etc.)
4. Serve frontend build files through web server
5. Update environment variables for production URLs

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure both servers are running
4. Check browser console for frontend errors
5. Check terminal/console for backend errors
