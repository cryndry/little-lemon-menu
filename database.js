import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {tx.executeSql('create table if not exists menuitems (id integer primary key not null, title text, price text, category text);');},
      reject,
      resolve
    );
  });
};

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        console.log(rows)
        resolve(rows._array);
      });
    });
  });
};

export function saveMenuItems(menuItems) {
  let sqlQuery = "INSERT INTO menuitems (id, title, price, category) VALUES ";
  menuItems.forEach((item, index) => {
    let queryString = `(${item.id}, '${item.title}', '${item.price}', '${item.category}')`;
    if (index === menuItems.length - 1) {
      sqlQuery += queryString;
    } else {
      sqlQuery += queryString + ", ";
    }
  });
  console.log(menuItems);
  console.log(sqlQuery);
  db.transaction((tx) => {
    tx.executeSql(sqlQuery, []);
  });
};

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      let newQuery = [];
      activeCategories.forEach(category => {
        newQuery.push(`category='${category}'`);
      });
      newQuery = newQuery.join(" OR ");
      const querySql = `SELECT * FROM menuitems WHERE (${newQuery}) ${query === "" ? "" : `AND title LIKE '%${query}%'`}`;
      console.log(querySql)
      tx.executeSql(querySql, [], (_, { rows }) => {
        resolve(rows._array);
        console.log(rows)
      });
    });
  });
};