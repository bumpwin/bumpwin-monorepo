// QuestDB configuration
export const QUESTDB_CONFIG = {
  // QuestDB project configuration
  PROJECT: {
    HOST: (process.env.QDB_HOST as string) || "localhost",
    PORT: (process.env.QDB_PG_PORT as string) || 8812,
    USER: (process.env.QDB_USER as string) || "admin",
    PASSWORD: (process.env.QDB_PASSWORD as string) || "questdb"
  },
};
