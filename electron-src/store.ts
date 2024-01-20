import Store from "electron-store";

const store = new Store();

export const getData = () => {
  const user = store.get("annotate-user");
  if (user) {
    return true;
  }
  return false;
};

export const updateData = (data: any) => {
  store.set("annotate-user", data);
};
