# EchoDB - Natural Language to Query

This project is a Next.js application that allows users to query a PostgreSQL database using natural language and visualize the results. It's powered by the AI SDK by Vercel and uses OpenAI's GPT-4o model to translate natural language queries into SQL.

![EchoDB Screenshot](https://via.placeholder.com/1200x600?text=EchoDB+Screenshot)

## Demo

![Demo Video](https://via.placeholder.com/1200x600?text=Demo+Video)

## Screenshots

### Home Page with Categorized Recommendations
![Home Page](https://via.placeholder.com/800x450?text=Home+Page+with+Categorized+Recommendations)

### Query Results with Selected Columns
![Query Results](https://via.placeholder.com/800x450?text=Query+Results+with+Selected+Columns)

### CRUD Operation Feedback
![CRUD Operations](https://via.placeholder.com/800x450?text=CRUD+Operation+Feedback)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x450?text=Dark+Mode)

### Chart Visualization
![Chart Visualization](https://via.placeholder.com/800x450?text=Chart+Visualization)

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
