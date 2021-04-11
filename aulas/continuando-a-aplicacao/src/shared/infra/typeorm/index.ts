import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "172.23.0.2"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host,
    })
  );
};
