import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import createConnection from "../index";

const createUserAdmin = async () => {
  const connection = await createConnection("localhost");

  const id = uuidv4();

  const password = await hash("admin", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, admin, created_at, driver_license)
    VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'XXX-1111')`
  );

  await connection.close();
};

createUserAdmin().then(() => console.log("User admin created"));
