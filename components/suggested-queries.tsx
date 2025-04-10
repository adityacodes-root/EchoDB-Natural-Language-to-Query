import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Globe2, TrendingUp, Building2, DollarSign, Users, Calendar, BarChart3 } from "lucide-react";

export const SuggestedQueries = ({
  handleSuggestionClick,
}: {
  handleSuggestionClick: (suggestion: string) => void;
}) => {
  const suggestionQueries = [
    {
      category: "Regional Analysis",
      icon: <Globe2 className="h-5 w-5" />,
      queries: [
        {
          desktop: "Compare total valuation of unicorns in India vs China vs USA",
          mobile: "Regional value",
        },
        {
          desktop: "Show the growth of unicorns in Bangalore vs Beijing vs San Francisco",
          mobile: "City growth",
        },
        {
          desktop: "Compare average valuation of unicorns across India, China, and USA",
          mobile: "Avg value",
        },
        {
          desktop: "Which cities in these three countries have the most unicorns?",
          mobile: "Top cities",
        },
        {
          desktop: "Compare unicorn density (per capita) in India, China, and USA",
          mobile: "Density",
        },
      ],
    },
    {
      category: "Industry Trends",
      icon: <Building2 className="h-5 w-5" />,
      queries: [
        {
          desktop: "Compare fintech unicorn valuations across India, China, and USA",
          mobile: "Fintech value",
        },
        {
          desktop: "Show the distribution of AI unicorns in these three countries",
          mobile: "AI dist",
        },
        {
          desktop: "Compare enterprise tech unicorn growth in these regions",
          mobile: "Tech growth",
        },
        {
          desktop: "Which industries are most common in each country?",
          mobile: "Top industries",
        },
        {
          desktop: "Compare healthcare unicorns across these three regions",
          mobile: "Healthcare",
        },
      ],
    },
    {
      category: "Growth & Trends",
      icon: <TrendingUp className="h-5 w-5" />,
      queries: [
        {
          desktop: "Show unicorn growth rate in India vs China vs USA over time",
          mobile: "Growth rate",
        },
        {
          desktop: "Compare yearly unicorn emergence in these three countries",
          mobile: "Yearly new",
        },
        {
          desktop: "Show the cumulative valuation growth in each region",
          mobile: "Value growth",
        },
        {
          desktop: "Which country has the fastest-growing unicorn ecosystem?",
          mobile: "Fastest growth",
        },
        {
          desktop: "Compare the age distribution of unicorns across these countries",
          mobile: "Age dist",
        },
      ],
    },
    {
      category: "Valuation Analysis",
      icon: <DollarSign className="h-5 w-5" />,
      queries: [
        {
          desktop: "Show the top 10 highest-valued unicorns from these three countries",
          mobile: "Top valued",
        },
        {
          desktop: "Compare median valuation by industry across these regions",
          mobile: "Median value",
        },
        {
          desktop: "Which country has the highest average unicorn valuation?",
          mobile: "Highest avg",
        },
        {
          desktop: "Show valuation distribution by company age in each country",
          mobile: "Value by age",
        },
      ],
    },
    {
      category: "Investor Insights",
      icon: <Users className="h-5 w-5" />,
      queries: [
        {
          desktop: "Which investors are most active across these three countries?",
          mobile: "Top investors",
        },
        {
          desktop: "Compare investment patterns in India vs China vs USA",
          mobile: "Investment",
        },
        {
          desktop: "Show the most common investors in fintech unicorns by country",
          mobile: "Fintech inv",
        },
        {
          desktop: "Which investors have backed unicorns in multiple countries?",
          mobile: "Global inv",
        },
      ],
    },
    {
      category: "Time Analysis",
      icon: <Calendar className="h-5 w-5" />,
      queries: [
        {
          desktop: "Show unicorn emergence by quarter in these three countries",
          mobile: "Quarterly",
        },
        {
          desktop: "Compare unicorn growth during different economic periods",
          mobile: "Econ periods",
        },
        {
          desktop: "Which country had the most unicorns founded in 2020?",
          mobile: "2020 count",
        },
        {
          desktop: "Show the acceleration of unicorn formation over time by country",
          mobile: "Acceleration",
        },
      ],
    },
  ];

  return (
    <motion.div
      key="suggestions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Explore Unicorn Data
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe2 className="h-4 w-4" />
            <span>Focus: India, China, USA</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suggestionQueries.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-lg font-medium text-foreground mb-3">
                {category.icon}
                <span>{category.category}</span>
              </div>
              <div className="space-y-2">
                {category.queries.map((query, queryIndex) => (
                  <Button
                    key={queryIndex}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3 text-sm hover:bg-primary/5 whitespace-normal"
                    onClick={() => handleSuggestionClick(query.desktop)}
                  >
                    <span className="hidden sm:inline">{query.desktop}</span>
                    <span className="sm:hidden">{query.mobile}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
