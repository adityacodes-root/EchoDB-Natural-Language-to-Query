# EchoDB - Natural Language to Query

This project is a Next.js application that allows users to query a PostgreSQL database using natural language and visualize the results. It's powered by the AI SDK by Vercel and uses OpenAI's GPT-4o model to translate natural language queries into SQL.

![Screenshot_01-May_01-14-07_32056](https://github.com/user-attachments/assets/ee921f10-02b2-4dcf-99d2-076a044c30d7)


## Screenshots

### Home Page with Categorized Recommendations
![swappy-20250410-212233](https://github.com/user-attachments/assets/1cfdf879-026c-4252-8af6-487e0425fad3)

### Query Results with Selected Columns
![Screenshot_01-May_01-26-37_15104](https://github.com/user-attachments/assets/5ab2ed23-622d-4961-ae37-e4efc6d77731)

### CRUD Operation Feedback
![Screenshot_01-May_01-32-49_8556](https://github.com/user-attachments/assets/ce539025-38bd-46b5-8ed9-e726a951b37e)
![Screenshot_01-May_01-33-41_19703](https://github.com/user-attachments/assets/9b28b32a-2fb5-4f84-8d85-5c157d9166e3)

### Light Mode
![Screenshot_01-May_01-34-45_23151](https://github.com/user-attachments/assets/e4972200-d163-419b-a113-0fc5d8c4d84a)

### Chatbot Interface
![Screenshot_01-May_01-35-47_22050](https://github.com/user-attachments/assets/493b9923-4d0b-4ef9-ba45-4f6a03878b2b)
![Screenshot_01-May_01-37-39_19915](https://github.com/user-attachments/assets/656d4fcb-a9eb-49c9-9bbf-41c6c40197e4)

### Chart Visualization
![Screenshot_01-May_01-40-42_31515](https://github.com/user-attachments/assets/6853b13b-a559-4978-9e64-3ab5e77737b3)


## Acknowledgments

This project is based on the [Natural Language PostgreSQL](https://github.com/vercel-labs/natural-language-postgres) project by Vercel Labs, which is licensed under the Apache License 2.0. I've extended and modified the original project to add additional features and improvements.

## Key Improvements

### Enhanced Database Interaction
- **Full CRUD Operations**: Complete support for Create, Read, Update, and Delete operations on local databases through natural language
- **Visual Operation Feedback**: Clear visual indicators for successful database operations with affected row counts
- **Improved Database Connectivity**: Better handling of local database connections with detailed error reporting
- **Selected Column Viewing**: Ability to see which columns are being selected in queries for better transparency

### Improved User Experience
- **Categorized Query Recommendations**: Better organized suggestions grouped by analysis type (Regional, Industry, Growth, etc.)
- **Geographic Focus**: Specialized recommendations focusing on India, China, and USA unicorn data
- **Data Export Options**: Download query results as CSV or JSON files for further analysis
- **Enhanced Loading States**: Multi-step loading indicators showing progress through query generation and execution
- **Responsive Design**: Optimized layout for all screen sizes with mobile-first approach
- **Dark Mode Support**: Theme toggle for comfortable viewing in any lighting condition

### Advanced Visualization
- **Dynamic Chart Selection**: Automatically selects the most appropriate chart type based on data structure
- **Multiple Chart Types**: Support for bar, line, area, and pie charts with proper formatting
- **Interactive Charts**: Added tooltips, legends, and axis labels for better data interpretation

## Features

- **Natural Language to SQL**: Users can input queries in plain English or any other language, which are then converted to SQL using AI.
- **AI-Powered Chatbot**: Interactive chatbot interface for natural language database queries and assistance
- **Full CRUD Operations**: Support for INSERT, UPDATE, and DELETE operations through natural language with visual feedback.
- **Data Visualization**: Results are displayed in both table and chart formats, with the chart type automatically selected based on the data.
- **Query Explanation**: Users can view the full SQL query and get an AI-generated explanation of each part of the query.
- **Categorized Recommendations**: Pre-built query suggestions organized by analysis type to help users explore the data.
- **Geographic Focus**: Specialized recommendations focusing on India, China, and USA unicorn data.
- **Data Export**: Export query results as CSV or JSON files for further analysis.
- **Selected Column Viewing**: See which columns are being selected in queries for better transparency.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing in any environment.
- **Responsive Design**: Optimized layout for all screen sizes with mobile-first approach.

## Technology Stack

- Next.js for the frontend and API routes
- AI SDK by Vercel for AI integration
- OpenAI's GPT-4o for natural language processing
- PostgreSQL for data storage
- Framer Motion for animations
- ShadcnUI for UI components
- Tailwind CSS for styling
- Recharts for data visualization

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- PostgreSQL (v15 or higher)

## Getting Started

1. **Install PostgreSQL**
   - **Linux (Ubuntu/Debian)**:
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - **Start PostgreSQL service**:
     ```bash
     sudo systemctl start postgresql
     sudo systemctl enable postgresql
     ```
   - **Create a database and user**:
     ```bash
     sudo -u postgres psql
     CREATE DATABASE echodb;
     CREATE USER yourusername WITH PASSWORD 'yourpassword';
     GRANT ALL PRIVILEGES ON DATABASE echodb TO yourusername;
     \q
     ```

2. **Clone and Setup the Project**
   ```bash
   git clone https://github.com/yourusername/echodb-nlp-to-query.git
   cd echodb-nlp-to-query
   pnpm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```
   OPENAI_API_KEY=your_api_key_here
   POSTGRES_URL="postgres://yourusername:yourpassword@localhost:5432/echodb"
   POSTGRES_PRISMA_URL="postgres://yourusername:yourpassword@localhost:5432/echodb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NO_SSL="postgres://yourusername:yourpassword@localhost:5432/echodb?sslmode=disable"
   POSTGRES_URL_NON_POOLING="postgres://yourusername:yourpassword@localhost:5432/echodb?connect_timeout=15"
   POSTGRES_USER="yourusername"
   POSTGRES_HOST="localhost"
   POSTGRES_PASSWORD="yourpassword"
   POSTGRES_DATABASE="echodb"
   ```

4. **Download and Prepare the Dataset**
   - Go to https://www.cbinsights.com/research-unicorn-companies
   - Download the unicorn companies dataset
   - Save it as `unicorns.csv` in the root of your project

5. **Seed the Database**
   ```bash
   pnpm run seed
   ```

6. **Start the Development Server**
   ```bash
   pnpm run dev
   ```

Your project should now be running on [http://localhost:3000](http://localhost:3000).

## Troubleshooting

### PostgreSQL Issues
- **Connection Refused**: Make sure PostgreSQL is running:
  ```bash
  sudo systemctl status postgresql
  ```
- **Permission Denied**: Ensure your user has the correct permissions:
  ```bash
  sudo -u postgres psql -c "ALTER USER yourusername WITH SUPERUSER;"
  ```
- **Database Doesn't Exist**: Create it manually:
  ```bash
  sudo -u postgres createdb echodb
  ```

### Next.js Issues
- **Port Already in Use**: Kill the process using port 3000:
  ```bash
  kill $(lsof -t -i:3000)
  ```
- **Build Errors**: Try cleaning the cache:
  ```bash
  rm -rf .next
  pnpm install
  pnpm run build
  ```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)
- [ShadcnUI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/en-US/)
