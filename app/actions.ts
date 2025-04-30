"use server";

import { Config, configSchema, explanationsSchema, Result } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { sql } from "@vercel/postgres";
import { generateObject } from "ai";
import { z } from "zod";
import { query, executeQuery } from "@/lib/db";

/**
 * Converts natural language input to SQL query using GPT-4
 * @param input - Natural language query from user
 * @returns Generated SQL query as string
 */
export const generateQuery = async (input: string) => {
  "use server";
  try {
    // Use GPT-4 to generate SQL query from natural language
    const result = await generateObject({
      model: openai("gpt-4o"),
      // System prompt containing database schema and rules
      system: `You are a SQL (postgres) and data visualization expert. Your job is to help the user write SQL queries to interact with the database. The table schema is as follows:

      unicorns (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL UNIQUE,
      valuation DECIMAL(10, 2) NOT NULL,
      date_joined DATE,
      country VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      select_investors TEXT NOT NULL
    );

    You can help with all types of SQL operations (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, DROP TABLE, etc.).
    Only ALTER, GRANT, and REVOKE operations are not allowed for safety reasons.

    For things like industry, company names and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(industry) ILIKE LOWER('%search_term%').

    Note: select_investors is a comma-separated list of investors. Trim whitespace to ensure you're grouping properly. Note, some fields may be null or have only one value.
    When answering questions about a specific field, ensure you are selecting the identifying column (ie. what is Vercel's valuation would select company and valuation').

    The industries available are:
    - healthcare & life sciences
    - consumer & retail
    - financial services
    - enterprise tech
    - insurance
    - media & entertainment
    - industrials
    - health

    If the user asks for a category that is not in the list, infer based on the list above.

    Note: valuation is in billions of dollars so 10b would be 10.0.
    Note: if the user asks for a rate, return it as a decimal. For example, 0.1 would be 10%.

    If the user asks for 'over time' data, return by year.

    When searching for UK or USA, write out United Kingdom or United States respectively.

    For SELECT queries, ensure they return quantitative data that can be plotted on a chart when appropriate. There should always be at least two columns. If the user asks for a single column, return the column and the count of the column. If the user asks for a rate, return the rate as a decimal. For example, 0.1 would be 10%.
    `,
      // User's natural language query
      prompt: `Generate the SQL query to perform the requested operation: ${input}`,
      // Schema validation for the response
      schema: z.object({
        query: z.string(),
      }),
    });
    return result.object.query;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to generate query");
  }
};

/**
 * Executes the generated SQL query with safety checks
 * @param query - SQL query to execute
 * @returns Query results or operation status
 */
export const runGenerateSQLQuery = async (query: string) => {
  "use server";
  // Safety check: Prevent unsafe operations
  if (
    query.trim().toLowerCase().includes("alter") ||
    query.trim().toLowerCase().includes("grant") ||
    query.trim().toLowerCase().includes("revoke")
  ) {
    throw new Error("Unsafe operations are not allowed");
  }

  let data: any;
  try {
    // Execute the query
    data = await executeQuery(query);
  } catch (e: any) {
    // Handle table creation if needed
    if (e.message.includes('relation "unicorns" does not exist')) {
      console.log(
        "Table does not exist, creating and seeding it with dummy data now...",
      );
      throw Error("Table does not exist");
    } else {
      throw e;
    }
  }

  // Handle different types of operations
  if (query.trim().toLowerCase().startsWith("select")) {
    // Return rows for SELECT queries
    return data.rows as Result[];
  }
  
  // Return operation status for other queries (INSERT, UPDATE, DELETE)
  return {
    message: "Operation completed successfully",
    affectedRows: data.rowCount,
    operation: query.trim().split(" ")[0].toUpperCase()
  };
};

/**
 * Explains the generated SQL query in simple terms
 * @param input - Original natural language query
 * @param sqlQuery - Generated SQL query
 * @returns Structured explanation of the query
 */
export const explainQuery = async (input: string, sqlQuery: string) => {
  "use server";
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        explanations: explanationsSchema,
      }),
      // System prompt for explanation generation
      system: `You are a SQL (postgres) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
    unicorns (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL UNIQUE,
      valuation DECIMAL(10, 2) NOT NULL,
      date_joined DATE,
      country VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      select_investors TEXT NOT NULL
    );

    When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM unicorns limit 20", the sections could be "SELECT *", "FROM UNICORNS", "LIMIT 20".
    If a section doesnt have any explanation, include it, but leave the explanation empty.

    `,
      // Prompt for explanation generation
      prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

      User Query:
      ${input}

      Generated SQL Query:
      ${sqlQuery}`,
    });
    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to generate query");
  }
};

/**
 * Generates chart configuration based on query results
 * @param results - Query results to visualize
 * @param userQuery - Original user query
 * @returns Chart configuration with colors
 */
export const generateChartConfig = async (
  results: Result[],
  userQuery: string,
) => {
  "use server";
  const system = `You are a data visualization expert. `;

  try {
    // Generate chart configuration using GPT-4
    const { object: config } = await generateObject({
      model: openai("gpt-4o"),
      system,
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines.

      Here is an example complete config:
      export const chartConfig = {
        type: "pie",
        xKey: "month",
        yKeys: ["sales", "profit", "expenses"],
        colors: {
          sales: "#4CAF50",    // Green for sales
          profit: "#2196F3",   // Blue for profit
          expenses: "#F44336"  // Red for expenses
        },
        legend: true
      }

      User Query:
      ${userQuery}

      Data:
      ${JSON.stringify(results, null, 2)}`,
      schema: configSchema,
    });

    // Generate color scheme for the chart
    const colors: Record<string, string> = {};
    config.yKeys.forEach((key, index) => {
      colors[key] = `hsl(var(--chart-${index + 1}))`;
    });

    // Return complete chart configuration
    const updatedConfig: Config = { ...config, colors };
    return { config: updatedConfig };
  } catch (e) {
    // @ts-expect-errore
    console.error(e.message);
    throw new Error("Failed to generate chart suggestion");
  }
};

/**
 * Handles chatbot queries by combining database access with OpenAI
 * @param question - User's question about unicorn companies
 * @returns Generated response based on database data
 */
export const handleChatbotQuery = async (question: string) => {
  "use server";
  try {
    // First, generate a SQL query based on the question
    const query = await generateQuery(question);
    if (!query) {
      throw new Error("Failed to generate query");
    }

    // Execute the query to get actual data
    const result = await runGenerateSQLQuery(query);
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return "I couldn't find any data matching your question. Could you please rephrase or try a different question?";
    }

    // Use OpenAI to generate a natural language response based on the data
    const response = await generateObject({
      model: openai("gpt-4"),
      system: `You are a helpful assistant that explains data about unicorn companies. 
      You will be given a question and the corresponding data from the database.
      Your task is to provide a clear, concise, and natural explanation of the data.
      
      Important notes:
      - Valuation is in billions of dollars (e.g., 10.0 means $10B)
  } catch (error) {
    console.error("Error in chatbot query:", error);
    return "I apologize, but I encountered an error while processing your question. Please try again.";
      - When referring to countries, use full names (e.g., "United States" instead of "USA")
      - Be specific and include relevant numbers in your response
      - If the data shows trends or patterns, point them out
      - Keep your response focused and to the point`,
      prompt: `Question: ${question}\n\nData: ${JSON.stringify(result, null, 2)}`,
      schema: z.object({
        answer: z.string(),
      }),
    });

    return response.object.answer;
  } catch (error) {
    console.error("Error in chatbot query:", error);
    return "I apologize, but I encountered an error while processing your question. Please try again.";
  }
};
